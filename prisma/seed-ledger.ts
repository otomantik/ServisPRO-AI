import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker/locale/tr'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding ledger system...')

  // 1. Create core accounts
  console.log('Creating core accounts...')
  const accounts = [
    { code: '1001', name: 'Kasa', type: 'asset' as const, isCashLike: true },
    { code: '1020', name: 'Banka Hesabı', type: 'asset' as const, isCashLike: true },
    { code: '1200', name: 'Alacaklar', type: 'asset' as const, isCashLike: false },
    { code: '6000', name: 'Genel Giderler', type: 'expense' as const, isCashLike: false },
    { code: '7000', name: 'Satış Gelirleri', type: 'revenue' as const, isCashLike: false },
  ]

  for (const account of accounts) {
    await prisma.account.upsert({
      where: { code: account.code },
      update: account,
      create: account,
    })
  }

  // Get account IDs for posting
  const kasa = await prisma.account.findUniqueOrThrow({ where: { code: '1001' } })
  const banka = await prisma.account.findUniqueOrThrow({ where: { code: '1020' } })
  const alacaklar = await prisma.account.findUniqueOrThrow({ where: { code: '1200' } })
  const giderler = await prisma.account.findUniqueOrThrow({ where: { code: '6000' } })
  const gelirler = await prisma.account.findUniqueOrThrow({ where: { code: '7000' } })

  // 2. Get or create sample customers
  console.log('Getting customers...')
  const customers = await prisma.customer.findMany({ take: 20 })
  
  if (customers.length === 0) {
    console.log('No customers found. Please run customer seed first.')
    return
  }

  // 3. Create realistic transactions over 6 months
  console.log('Creating ledger entries (6 months)...')
  
  const now = new Date()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1)

  const expenseCategories = [
    { category: 'maaş', descriptions: ['Personel maaş ödemesi', 'Aylık maaş tahakkuku', 'Çalışan ödemesi'] },
    { category: 'yakıt', descriptions: ['Araç yakıt alımı', 'Mazot gideri', 'Benzin - servis aracı'] },
    { category: 'yemek', descriptions: ['Personel yemek ücreti', 'Çalışan yemeği', 'Öğle yemeği'] },
    { category: 'kira', descriptions: ['Aylık kira ödemesi', 'İşyeri kira', 'Ofis kira bedeli'] },
    { category: 'elektrik', descriptions: ['Elektrik faturası', 'Enerji gideri'] },
    { category: 'malzeme', descriptions: ['Malzeme alımı', 'Stok tedariki', 'Parça alımı'] },
  ]

  const entries: any[] = []

  // Create 150-200 transactions spread over 6 months
  const transactionCount = faker.number.int({ min: 150, max: 200 })

  for (let i = 0; i < transactionCount; i++) {
    const randomDate = faker.date.between({ from: sixMonthsAgo, to: now })
    const isIncome = faker.datatype.boolean() // 50% income, 50% expense

    if (isIncome) {
      // Income: Customer payment
      const customer = faker.helpers.arrayElement(customers)
      const amount = faker.number.float({ min: 500, max: 5000, precision: 0.01 })
      const useBank = faker.datatype.boolean({ probability: 0.6 }) // 60% bank, 40% cash
      const accountId = useBank ? banka.id : kasa.id
      const invoiceNo = `${now.getFullYear()}-${faker.string.numeric(3)}`

      const summary = `Müşteri tahsilatı – ${customer.name} (Fatura ${invoiceNo})`

      const entry = await prisma.ledgerEntry.create({
        data: {
          date: randomDate,
          debitId: accountId, // Money INTO cash/bank
          creditId: alacaklar.id, // FROM receivables
          amount,
          refType: 'Payment',
          refId: invoiceNo,
          note: `Fatura ${invoiceNo} tahsilatı`,
        },
      })

      await prisma.cashNote.create({
        data: {
          entryId: entry.id,
          summary,
          tags: `tahsilat,${useBank ? 'havale' : 'nakit'}`,
        },
      })

      entries.push(entry)
    } else {
      // Expense: Business expense
      const expenseType = faker.helpers.arrayElement(expenseCategories)
      const amount = faker.number.float({ min: 200, max: 3000, precision: 0.01 })
      const useBank = faker.datatype.boolean({ probability: 0.7 }) // 70% bank, 30% cash
      const accountId = useBank ? banka.id : kasa.id
      const description = faker.helpers.arrayElement(expenseType.descriptions)

      const entry = await prisma.ledgerEntry.create({
        data: {
          date: randomDate,
          debitId: giderler.id, // Expense account
          creditId: accountId, // Money OUT of cash/bank
          amount,
          refType: 'Expense',
          note: description,
        },
      })

      await prisma.cashNote.create({
        data: {
          entryId: entry.id,
          summary: `${description} (${expenseType.category})`,
          tags: `gider,${expenseType.category},${useBank ? 'havale' : 'nakit'}`,
        },
      })

      entries.push(entry)
    }

    // Progress indicator
    if (i % 50 === 0) {
      console.log(`  Created ${i}/${transactionCount} transactions...`)
    }
  }

  console.log(`✅ Created ${entries.length} ledger entries`)

  // 4. Create some invoices
  console.log('Creating invoices...')
  const invoices: any[] = []

  for (let i = 0; i < 30; i++) {
    const customer = faker.helpers.arrayElement(customers)
    const total = faker.number.float({ min: 1000, max: 10000, precision: 0.01 })
    const issueDate = faker.date.between({ from: sixMonthsAgo, to: now })
    const dueDate = faker.date.soon({ days: 30, refDate: issueDate })
    const invoiceNo = `${now.getFullYear()}-${(i + 1).toString().padStart(3, '0')}`

    const subtotal = total / 1.20 // KDV hariç
    
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNo,
        customer: {
          connect: { id: customer.id }
        },
        subtotal,
        total,
        issueDate,
        dueDate,
        status: faker.helpers.arrayElement(['open', 'paid', 'overdue']),
        note: `Servis işlemleri - ${faker.commerce.productDescription()}`,
      },
    })

    // Create A/R entry (Debit: Alacaklar, Credit: Gelir)
    await prisma.ledgerEntry.create({
      data: {
        date: issueDate,
        debitId: alacaklar.id,
        creditId: gelirler.id,
        amount: total,
        refType: 'Invoice',
        refId: invoiceNo,
        note: `Fatura ${invoiceNo} - ${customer.name}`,
      },
    })

    // If paid, create payment entry
    if (invoice.status === 'paid') {
      const paymentDate = faker.date.between({ from: issueDate, to: now })
      const paymentMethod = faker.helpers.arrayElement(['cash', 'card', 'transfer'])
      const accountId = paymentMethod === 'transfer' ? banka.id : kasa.id

      await prisma.payment.create({
        data: {
          customerId: customer.id,
          invoiceId: invoice.id,
          method: paymentMethod,
          amount: total,
          note: `Fatura ${invoiceNo} ödemesi`,
          createdAt: paymentDate,
        },
      })

      // Post payment to ledger
      const entry = await prisma.ledgerEntry.create({
        data: {
          date: paymentDate,
          debitId: accountId, // Cash/Bank
          creditId: alacaklar.id, // Receivables
          amount: total,
          refType: 'Payment',
          refId: invoiceNo,
          note: `Fatura ${invoiceNo} tahsilatı`,
        },
      })

      await prisma.cashNote.create({
        data: {
          entryId: entry.id,
          summary: `Müşteri tahsilatı – ${customer.name} (Fatura ${invoiceNo})`,
          tags: `tahsilat,${paymentMethod}`,
        },
      })
    }

    invoices.push(invoice)

    if (i % 10 === 0) {
      console.log(`  Created ${i}/30 invoices...`)
    }
  }

  console.log(`✅ Created ${invoices.length} invoices`)

  // 5. Calculate and display summary
  const [cashBalance, totalReceivable] = await Promise.all([
    prisma.$queryRaw<{ balance: number }[]>`
      SELECT 
        COALESCE(SUM(
          CASE 
            WHEN a.is_cash_like THEN le.amount
            ELSE 0
          END
        ), 0) - COALESCE(SUM(
          CASE 
            WHEN a2.is_cash_like THEN le.amount
            ELSE 0
          END
        ), 0) as balance
      FROM ledger_entries le
      LEFT JOIN accounts a ON le.debit_id = a.id
      LEFT JOIN accounts a2 ON le.credit_id = a.id
    `,
    getAccountsReceivable(),
  ])

  console.log('\n📊 Ledger Summary:')
  console.log(`  💰 Cash Balance: ₺${cashBalance[0]?.balance.toFixed(2) || '0'}`)
  console.log(`  📝 Accounts Receivable: ₺${totalReceivable.toFixed(2)}`)
  console.log(`  📄 Total Invoices: ${invoices.length}`)
  console.log(`  📋 Total Entries: ${entries.length}`)

  console.log('\n✅ Ledger seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

