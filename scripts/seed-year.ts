import { PrismaClient } from "@prisma/client";
import { postLedger } from "../lib/ledger";
import { expenseCategoryList, suggestExpenseDescription } from "../lib/summary";

const prisma = new PrismaClient();

// Helper to chunk arrays
function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// Helper to generate random date within range
function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

// Helper to get random item from array
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("🌱 Starting 1-year data seed...\n");

  // Step 1: Seed core accounts
  console.log("📊 Creating core accounts...");
  const accounts = [
    { code: "1001", name: "Kasa (Nakit)", type: "asset", isCashLike: true },
    { code: "1020", name: "Banka", type: "asset", isCashLike: true },
    { code: "1200", name: "Alacaklar", type: "asset", isCashLike: false },
    { code: "6000", name: "Giderler", type: "expense", isCashLike: false },
    { code: "7000", name: "Satış Gelirleri", type: "revenue", isCashLike: false },
  ];

  for (const account of accounts) {
    await prisma.account.upsert({
      where: { code: account.code },
      create: account,
      update: {},
    });
  }
  console.log(`✅ Created ${accounts.length} accounts\n`);

  // Step 2: Get or create customers (from existing seed)
  console.log("👥 Fetching customers...");
  let customers = await prisma.customer.findMany({ take: 100 });
  if (customers.length === 0) {
    console.log("⚠️  No customers found. Please run customer seed first.");
    return;
  }
  console.log(`✅ Found ${customers.length} customers\n`);

  // Step 3: Generate 1 year of data
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);
  const endDate = new Date();

  console.log(`📅 Generating data from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}\n`);

  // Arrays to store data for bulk insert
  const invoices: any[] = [];
  const payments: any[] = [];
  const ledgerEntries: any[] = [];
  const cashNotes: any[] = [];

  let invoiceCounter = 1;
  let totalInvoices = 0;
  let totalPayments = 0;
  let totalExpenses = 0;

  // Generate data day by day
  console.log("🔄 Generating transactions...");
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  for (let day = 0; day < days; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + day);

    // Skip weekends (optional, but makes data more realistic)
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    // 1-6 invoices per day
    const invoiceCount = Math.floor(Math.random() * 6) + 1;
    
    for (let i = 0; i < invoiceCount; i++) {
      const customer = randomItem(customers);
      const subtotal = Math.floor(Math.random() * 8000) + 500; // 500-8500 TRY
      const discount = Math.random() < 0.2 ? Math.floor(subtotal * 0.1) : 0; // 10% discount 20% of the time
      const vatRate = 20;
      const discountedSubtotal = subtotal - discount;
      const total = Math.round(discountedSubtotal * (1 + vatRate / 100) * 100) / 100;

      const invoice = {
        id: `inv_${Date.now()}_${invoiceCounter}`,
        invoiceNo: `2024-${String(invoiceCounter).padStart(4, "0")}`,
        customerId: customer.id,
        issueDate: currentDate,
        dueDate: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
        subtotal,
        vatRate,
        discount,
        total,
        currency: "TRY",
        status: "open",
        note: Math.random() < 0.3 ? "Periyodik bakım faturası" : null,
      };

      invoices.push(invoice);
      invoiceCounter++;
      totalInvoices++;

      // 75% chance of payment
      if (Math.random() < 0.75) {
        const paymentMethod = randomItem(["cash", "card", "transfer"]);
        
        // 30% chance of partial payment
        if (Math.random() < 0.3) {
          // 2 partial payments
          const payment1Amount = Math.round(total * 0.6 * 100) / 100;
          const payment2Amount = Math.round((total - payment1Amount) * 100) / 100;
          
          const payment1 = {
            id: `pay_${Date.now()}_${totalPayments + 1}`,
            customerId: customer.id,
            invoiceId: invoice.id,
            method: paymentMethod,
            amount: payment1Amount,
            fee: paymentMethod === "card" ? Math.round(payment1Amount * 0.02 * 100) / 100 : 0,
            note: "1. taksit",
            createdAt: currentDate,
          };

          const payment2Date = new Date(currentDate.getTime() + 15 * 24 * 60 * 60 * 1000);
          const payment2 = {
            id: `pay_${Date.now()}_${totalPayments + 2}`,
            customerId: customer.id,
            invoiceId: invoice.id,
            method: paymentMethod,
            amount: payment2Amount,
            fee: paymentMethod === "card" ? Math.round(payment2Amount * 0.02 * 100) / 100 : 0,
            note: "2. taksit",
            createdAt: payment2Date,
          };

          payments.push(payment1, payment2);
          totalPayments += 2;

          // Mark invoice as paid
          invoice.status = "paid";
        } else {
          // Full payment
          const payment = {
            id: `pay_${Date.now()}_${totalPayments + 1}`,
            customerId: customer.id,
            invoiceId: invoice.id,
            method: paymentMethod,
            amount: total,
            fee: paymentMethod === "card" ? Math.round(total * 0.02 * 100) / 100 : 0,
            note: "Tam ödeme",
            createdAt: currentDate,
          };

          payments.push(payment);
          totalPayments++;

          // Mark invoice as paid
          invoice.status = "paid";
        }
      }
    }

    // 1-4 expenses per day
    const expenseCount = Math.floor(Math.random() * 4) + 1;
    
    for (let i = 0; i < expenseCount; i++) {
      const category = randomItem(expenseCategoryList);
      const amount = Math.floor(Math.random() * 3000) + 100; // 100-3100 TRY
      const note = suggestExpenseDescription(category);
      const paymentMethod = randomItem(["cash", "transfer"]);

      totalExpenses++;

      // We'll create these via postLedger in a transaction later
      // For now, just track the count
    }

    // Progress indicator
    if (day % 30 === 0) {
      console.log(`  📆 Processed ${day}/${days} days...`);
    }
  }

  console.log(`✅ Generated ${totalInvoices} invoices, ${totalPayments} payments\n`);

  // Step 4: Insert invoices in chunks
  console.log("💾 Inserting invoices...");
  const invoiceChunks = chunk(invoices, 1000);
  for (const invoiceChunk of invoiceChunks) {
    await prisma.invoice.createMany({
      data: invoiceChunk,
    });
  }
  console.log(`✅ Inserted ${invoices.length} invoices\n`);

  // Step 5: Insert payments in chunks
  console.log("💾 Inserting payments...");
  const paymentChunks = chunk(payments, 1000);
  for (const paymentChunk of paymentChunks) {
    await prisma.payment.createMany({
      data: paymentChunk,
    });
  }
  console.log(`✅ Inserted ${payments.length} payments\n`);

  // Step 6: Create ledger entries for invoices
  console.log("📒 Creating ledger entries for invoices...");
  const arAccount = await prisma.account.findUnique({ where: { code: "1200" } });
  const revenueAccount = await prisma.account.findUnique({ where: { code: "7000" } });

  if (!arAccount || !revenueAccount) {
    throw new Error("Core accounts not found");
  }

  const invoiceLedgerEntries = invoices.map((inv, idx) => ({
    id: `le_inv_${idx}`,
    date: inv.issueDate,
    debitId: arAccount.id,
    creditId: revenueAccount.id,
    amount: inv.total,
    currency: "TRY",
    refType: "Invoice",
    refId: inv.id,
    note: `Fatura ${inv.invoiceNo}`,
  }));

  const invoiceLedgerChunks = chunk(invoiceLedgerEntries, 1000);
  for (const ledgerChunk of invoiceLedgerChunks) {
    await prisma.ledgerEntry.createMany({
      data: ledgerChunk,
    });
  }
  console.log(`✅ Created ${invoiceLedgerEntries.length} invoice ledger entries\n`);

  // Step 7: Create ledger entries for payments
  console.log("📒 Creating ledger entries for payments...");
  const cashAccount = await prisma.account.findUnique({ where: { code: "1001" } });
  const bankAccount = await prisma.account.findUnique({ where: { code: "1020" } });
  const expenseAccount = await prisma.account.findUnique({ where: { code: "6000" } });

  if (!cashAccount || !bankAccount || !expenseAccount) {
    throw new Error("Core accounts not found");
  }

  const paymentLedgerEntries: any[] = [];
  const paymentCashNotes: any[] = [];
  let ledgerCounter = 0;

  for (const payment of payments) {
    const debitAccountId =
      payment.method === "transfer" ? bankAccount.id : cashAccount.id;

    const paymentEntry = {
      id: `le_pay_${ledgerCounter++}`,
      date: payment.createdAt,
      debitId: debitAccountId,
      creditId: arAccount.id,
      amount: payment.amount,
      currency: "TRY",
      refType: "Payment",
      refId: payment.id,
      note: payment.note,
    };

    paymentLedgerEntries.push(paymentEntry);

    // Create cash note
    paymentCashNotes.push({
      id: `cn_${paymentEntry.id}`,
      entryId: paymentEntry.id,
      summary: `Müşteri tahsilatı – ${payment.method === "transfer" ? "Havale" : "Nakit"}`,
    });

    // Card fee
    if (payment.method === "card" && payment.fee > 0) {
      const feeEntry = {
        id: `le_fee_${ledgerCounter++}`,
        date: payment.createdAt,
        debitId: expenseAccount.id,
        creditId: debitAccountId,
        amount: payment.fee,
        currency: "TRY",
        refType: "Payment",
        refId: payment.id,
        note: "Kredi kartı komisyonu",
      };

      paymentLedgerEntries.push(feeEntry);

      paymentCashNotes.push({
        id: `cn_${feeEntry.id}`,
        entryId: feeEntry.id,
        summary: "Kredi kartı komisyonu",
      });
    }
  }

  const paymentLedgerChunks = chunk(paymentLedgerEntries, 1000);
  for (const ledgerChunk of paymentLedgerChunks) {
    await prisma.ledgerEntry.createMany({
      data: ledgerChunk,
    });
  }
  console.log(`✅ Created ${paymentLedgerEntries.length} payment ledger entries\n`);

  // Step 8: Insert cash notes
  console.log("📝 Creating cash notes...");
  const cashNoteChunks = chunk(paymentCashNotes, 1000);
  for (const noteChunk of cashNoteChunks) {
    await prisma.cashNote.createMany({
      data: noteChunk,
    });
  }
  console.log(`✅ Created ${paymentCashNotes.length} cash notes\n`);

  // Step 9: Create expense ledger entries
  console.log("📒 Creating expense ledger entries...");
  const expenseLedgerEntries: any[] = [];
  const expenseCashNotes: any[] = [];

  for (let day = 0; day < days; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + day);

    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const expenseCount = Math.floor(Math.random() * 4) + 1;

    for (let i = 0; i < expenseCount; i++) {
      const category = randomItem(expenseCategoryList);
      const amount = Math.floor(Math.random() * 3000) + 100;
      const note = suggestExpenseDescription(category);
      const paymentMethod = randomItem(["cash", "transfer"]);
      const creditAccountId =
        paymentMethod === "transfer" ? bankAccount.id : cashAccount.id;

      const expenseEntry = {
        id: `le_exp_${ledgerCounter++}`,
        date: currentDate,
        debitId: expenseAccount.id,
        creditId: creditAccountId,
        amount,
        currency: "TRY",
        refType: "Expense",
        refId: null,
        note,
        meta: JSON.stringify({ category }),
      };

      expenseLedgerEntries.push(expenseEntry);

      expenseCashNotes.push({
        id: `cn_${expenseEntry.id}`,
        entryId: expenseEntry.id,
        summary: `${category}${note ? ` – ${note}` : ""}`,
      });
    }
  }

  const expenseLedgerChunks = chunk(expenseLedgerEntries, 1000);
  for (const ledgerChunk of expenseLedgerChunks) {
    await prisma.ledgerEntry.createMany({
      data: ledgerChunk,
    });
  }
  console.log(`✅ Created ${expenseLedgerEntries.length} expense ledger entries\n`);

  const expenseCashNoteChunks = chunk(expenseCashNotes, 1000);
  for (const noteChunk of expenseCashNoteChunks) {
    await prisma.cashNote.createMany({
      data: noteChunk,
    });
  }
  console.log(`✅ Created ${expenseCashNotes.length} expense cash notes\n`);

  // Summary
  console.log("🎉 Seed complete!\n");
  console.log("📊 Summary:");
  console.log(`  - ${accounts.length} accounts`);
  console.log(`  - ${invoices.length} invoices`);
  console.log(`  - ${payments.length} payments`);
  console.log(`  - ${invoiceLedgerEntries.length + paymentLedgerEntries.length + expenseLedgerEntries.length} ledger entries`);
  console.log(`  - ${paymentCashNotes.length + expenseCashNotes.length} cash notes\n`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

