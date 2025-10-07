import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const staff = await prisma.user.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        district: true,
        position: true,
        status: true,
        hireDate: true,
        createdAt: true,
      },
    })

    return NextResponse.json(staff)
  } catch (error: any) {
    console.error('Staff GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Personel listesi alınamadı' },
      { status: 500 }
    )
  }
}

