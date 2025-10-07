import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCashBalance, getTotalRevenue, getTotalExpenses } from "@/lib/ledger";

export async function GET(request: NextRequest) {
  try {
    // Get stats
    const balance = await getCashBalance();
    const income = await getTotalRevenue();
    const expense = await getTotalExpenses();

    // Get recent entries involving cash accounts
    const cashAccounts = await prisma.account.findMany({
      where: { isCashLike: true },
    });

    const cashAccountIds = cashAccounts.map((a) => a.id);

    const entries = await prisma.ledgerEntry.findMany({
      where: {
        OR: [
          { debitId: { in: cashAccountIds } },
          { creditId: { in: cashAccountIds } },
        ],
      },
      include: {
        debit: true,
        credit: true,
        cashNote: true,
      },
      orderBy: { date: "desc" },
      take: 50,
    });

    return NextResponse.json({
      stats: { balance, income, expense },
      entries,
    });
  } catch (error: any) {
    console.error("Cash API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

