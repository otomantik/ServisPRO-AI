import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        category: true,
        services: {
          include: {
            technician: true,
            cashTransactions: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        periodicMaintenances: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })

    if (!customer) {
      return NextResponse.json(
        { error: "Müşteri bulunamadı" },
        { status: 404 }
      )
    }

    return NextResponse.json(customer)
  } catch (error) {
    console.error("Customer fetch error:", error)
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json()
    
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        phone2: data.phone2,
        email: data.email,
        address: data.address,
        city: data.city,
        district: data.district,
        type: data.type,
        categoryId: data.categoryId,
        isSupplier: data.isSupplier,
      }
    })

    return NextResponse.json(customer)
  } catch (error) {
    console.error("Customer update error:", error)
    return NextResponse.json(
      { error: "Müşteri güncellenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.customer.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Customer delete error:", error)
    return NextResponse.json(
      { error: "Müşteri silinirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
