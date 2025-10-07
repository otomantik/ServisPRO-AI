import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { summarizeEntryTR } from "@/lib/summary"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const entry = await prisma.ledgerEntry.findUnique({
      where: { id: params.id },
      include: {
        debit: true,
        credit: true,
        cashNote: true,
      },
    })

    if (!entry) {
      return NextResponse.json(
        { error: 'Kayıt bulunamadı' },
        { status: 404 }
      )
    }

    const isIncome = entry.debit.isCashLike
    const isExpense = entry.credit.isCashLike

    return NextResponse.json({
      id: entry.id,
      date: entry.date.toISOString(),
      amount: entry.amount,
      summary: entry.cashNote?.summary || summarizeEntryTR(entry, entry.debit, entry.credit),
      type: isIncome ? 'income' : 'expense',
      method: entry.debit.code === '1020' || entry.credit.code === '1020' ? 'transfer' : 
              entry.debit.code === '1001' || entry.credit.code === '1001' ? 'cash' : 'card',
      debitAccount: `${entry.debit.code} - ${entry.debit.name}`,
      creditAccount: `${entry.credit.code} - ${entry.credit.name}`,
      note: entry.note,
      refType: entry.refType,
      refId: entry.refId,
      createdAt: entry.createdAt.toISOString(),
    })
  } catch (error: any) {
    console.error('Kasa GET [id] error:', error)
    return NextResponse.json(
      { error: error.message || 'Veri yüklenemedi' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { amount, description, date } = body

    // Find existing entry
    const existing = await prisma.ledgerEntry.findUnique({
      where: { id: params.id },
      include: { cashNote: true },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Kayıt bulunamadı' },
        { status: 404 }
      )
    }

    // Update entry
    const updated = await prisma.ledgerEntry.update({
      where: { id: params.id },
      data: {
        amount: amount ? parseFloat(amount) : undefined,
        note: description,
        date: date ? new Date(date) : undefined,
      },
    })

    // Update cash note if exists and description changed
    if (existing.cashNote && description) {
      await prisma.cashNote.update({
        where: { id: existing.cashNote.id },
        data: { summary: description },
      })
    }

    return NextResponse.json({
      id: updated.id,
      message: 'Kayıt başarıyla güncellendi',
    })
  } catch (error: any) {
    console.error('Kasa PATCH error:', error)
    return NextResponse.json(
      { error: error.message || 'Güncelleme başarısız' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete will cascade to cashNote due to onDelete: Cascade
    await prisma.ledgerEntry.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      message: 'Kayıt başarıyla silindi',
    })
  } catch (error: any) {
    console.error('Kasa DELETE error:', error)
    return NextResponse.json(
      { error: error.message || 'Silme işlemi başarısız' },
      { status: 500 }
    )
  }
}

