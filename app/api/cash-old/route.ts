import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const [transactions, summary] = await Promise.all([
      prisma.cashTransaction.findMany({
        take: 50,
        orderBy: { transactionDate: "desc" },
        include: {
          paymentType: true,
          technician: true,
        },
      }),
      prisma.cashTransaction.groupBy({
        by: ["type"],
        _sum: {
          amount: true,
        },
      }),
    ])

    const income = summary.find((s) => s.type === "income")?._sum.amount || 0
    const expense = summary.find((s) => s.type === "expense")?._sum.amount || 0

    return NextResponse.json({
      transactions,
      balance: income - expense,
      income,
      expense,
    })
  } catch (error: any) {
    console.error('Cash GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Kasa verileri alınamadı' },
      { status: 500 }
    )
  }
}

