import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { postLedger, getCashBalance, getTotalRevenue, getTotalExpenses } from "@/lib/ledger"
import { summarizeEntryTR } from "@/lib/summary"

export async function GET(request: NextRequest) {
  try {
    // Get all ledger entries involving cash/bank accounts
    const entries = await prisma.ledgerEntry.findMany({
      take: 100,
      orderBy: { date: 'desc' },
      include: {
        debit: true,
        credit: true,
        cashNote: true,
      },
    })

    // Filter to only show cash-involved transactions
    const cashEntries = entries.filter(
      e => e.debit.isCashLike || e.credit.isCashLike
    )

    // Transform for frontend
    const transformedEntries = cashEntries.map(entry => {
      const isIncome = entry.debit.isCashLike // Money coming INTO cash
      const isExpense = entry.credit.isCashLike // Money going OUT of cash

      return {
        id: entry.id,
        date: entry.date.toISOString(),
        amount: entry.amount,
        summary: entry.cashNote?.summary || summarizeEntryTR(entry, entry.debit, entry.credit),
        type: isIncome ? 'income' : 'expense',
        method: entry.debit.code === '1020' || entry.credit.code === '1020' ? 'transfer' : 'cash',
        debitAccount: entry.debit.name,
        creditAccount: entry.credit.name,
        note: entry.note,
        refType: entry.refType,
        refId: entry.refId,
        createdAt: entry.createdAt.toISOString(),
      }
    })

    // Get stats
    const [cashBalance, totalRevenue, totalExpenses] = await Promise.all([
      getCashBalance(),
      getTotalRevenue(),
      getTotalExpenses(),
    ])

    return NextResponse.json({
      entries: transformedEntries,
      stats: {
        totalIncome: totalRevenue,
        totalExpense: totalExpenses,
        cashBalance,
      },
    })
  } catch (error: any) {
    console.error('Kasa GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Veriler yüklenemedi' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, amount, method, category, customerName, invoiceNo, description, date } = body

    if (!type || !amount || !method) {
      return NextResponse.json(
        { error: 'Eksik alan: type, amount, method gerekli' },
        { status: 400 }
      )
    }

    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: 'Geçersiz tutar' },
        { status: 400 }
      )
    }

    const transactionDate = date ? new Date(date) : new Date()

    // Determine account codes
    let debitCode: string
    let creditCode: string
    let cashSummary: string

    const accountCode = method === 'transfer' ? '1020' : '1001' // Banka or Kasa

    if (type === 'income') {
      // Income: Debit Cash/Bank, Credit Receivables (or Revenue for direct cash sales)
      debitCode = accountCode
      creditCode = '1200' // Alacaklar
      cashSummary = invoiceNo
        ? `Müşteri tahsilatı – ${customerName || 'Anonim'} (Fatura ${invoiceNo})`
        : `Müşteri tahsilatı – ${customerName || 'Anonim'}`
    } else {
      // Expense: Debit Expense, Credit Cash/Bank
      debitCode = '6000' // Gider
      creditCode = accountCode
      const categoryLabel = category || 'Genel Gider'
      cashSummary = description || `${categoryLabel} gideri`
    }

    // Post to ledger using transaction
    const entry = await prisma.$transaction(async (tx) => {
      return await postLedger(tx, {
        date: transactionDate,
        debitCode,
        creditCode,
        amount: parsedAmount,
        note: description,
        refType: type === 'income' ? 'Payment' : 'Expense',
        cashSummary,
      })
    })

    return NextResponse.json(
      { id: entry.id, message: 'Kayıt başarıyla oluşturuldu' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Kasa POST error:', error)
    return NextResponse.json(
      { error: error.message || 'Kayıt oluşturulamadı' },
      { status: 500 }
    )
  }
}

