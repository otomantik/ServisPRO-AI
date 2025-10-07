import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAccountsReceivable } from "@/lib/ledger"

export async function GET(request: NextRequest) {
  try {
    // Get all invoices
    const invoices = await prisma.invoice.findMany({
      take: 100,
      orderBy: { issueDate: 'desc' },
      include: {
        customer: true,
        payments: true,
      },
    })

    // Transform for frontend
    const transformedInvoices = invoices.map(invoice => {
      const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0)
      const balance = invoice.total - totalPaid

      // Determine status
      let status = invoice.status
      if (balance === 0 && invoice.status !== 'void') {
        status = 'paid'
      } else if (invoice.dueDate && new Date(invoice.dueDate) < new Date() && balance > 0) {
        status = 'overdue'
      }

      return {
        id: invoice.id,
        invoiceNo: invoice.invoiceNo,
        customerName: invoice.customer.name,
        total: invoice.total,
        paid: totalPaid,
        balance,
        status,
        issueDate: invoice.issueDate.toISOString(),
        dueDate: invoice.dueDate?.toISOString(),
      }
    })

    // Calculate stats
    const totalReceivable = transformedInvoices
      .filter(inv => inv.status !== 'paid' && inv.status !== 'void')
      .reduce((sum, inv) => sum + inv.balance, 0)

    const overdueAmount = transformedInvoices
      .filter(inv => inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.balance, 0)

    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const paidThisMonth = transformedInvoices
      .filter(inv => {
        const payments = invoices.find(i => i.id === inv.id)?.payments || []
        return payments.some(p => new Date(p.createdAt) >= thisMonthStart)
      })
      .reduce((sum, inv) => sum + inv.paid, 0)

    return NextResponse.json({
      invoices: transformedInvoices,
      stats: {
        totalReceivable,
        overdueAmount,
        paidThisMonth,
      },
    })
  } catch (error: any) {
    console.error('Alacaklar GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Veriler yüklenemedi' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerId, total, dueDate, note } = body

    if (!customerId || !total) {
      return NextResponse.json(
        { error: 'Eksik alan: customerId ve total gerekli' },
        { status: 400 }
      )
    }

    // Generate invoice number
    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: { createdAt: 'desc' },
    })

    const year = new Date().getFullYear()
    const lastNo = lastInvoice?.invoiceNo.split('-')[1] || '0'
    const nextNo = (parseInt(lastNo) + 1).toString().padStart(3, '0')
    const invoiceNo = `${year}-${nextNo}`

    // Create invoice
    const totalAmount = parseFloat(total)
    const subtotalAmount = totalAmount / 1.20 // KDV hariç tutar
    
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNo,
        customer: {
          connect: { id: customerId }
        },
        subtotal: subtotalAmount,
        total: totalAmount,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        note,
        status: 'open',
      },
    })

    // Post to ledger (Debit: Alacaklar, Credit: Gelir)
    // This will be done via separate endpoint or here
    // For now, just create the invoice

    return NextResponse.json(
      { id: invoice.id, invoiceNo, message: 'Fatura başarıyla oluşturuldu' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Alacaklar POST error:', error)
    return NextResponse.json(
      { error: error.message || 'Fatura oluşturulamadı' },
      { status: 500 }
    )
  }
}

