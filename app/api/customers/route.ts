import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || ''
    const categoryId = searchParams.get('categoryId') || ''

    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (type) {
      where.type = type
    }
    
    if (categoryId) {
      where.categoryId = categoryId
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          category: true,
          services: {
            select: {
              totalCost: true,
              status: true
            }
          },
          _count: {
            select: {
              services: true,
              periodicMaintenances: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.customer.count({ where })
    ])

    return NextResponse.json({
      customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Customers fetch error:", error)
    return NextResponse.json(
      { error: "Müşteriler getirilirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        phone: data.phone,
        phone2: data.phone2,
        email: data.email,
        address: data.address,
        city: data.city,
        district: data.district,
        type: data.type,
        categoryId: data.categoryId || null,
        isSupplier: data.isSupplier || false,
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error("Customer create error:", error)
    return NextResponse.json(
      { error: "Müşteri oluşturulurken bir hata oluştu" },
      { status: 500 }
    )
  }
}