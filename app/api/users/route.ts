import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        position: true,
        status: true,
        phone: true,
        address: true,
        city: true,
        district: true,
        hireDate: true,
        createdAt: true,
      },
    })

    return NextResponse.json(users)
  } catch (error: any) {
    console.error('Users GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Kullanıcılar alınamadı' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kullanılıyor' },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(data.password || '123456', 10)
    
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        phone2: data.phone2 || null,
        address: data.address || null,
        city: data.city || 'Kırklareli',
        district: data.district || 'Lüleburgaz',
        position: data.position || 'Teknisyen',
        tcNo: data.tcNo || null,
        status: true,
        hireDate: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        position: true,
        status: true,
        phone: true,
        createdAt: true,
      }
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error: any) {
    console.error('User creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Kullanıcı oluşturulurken bir hata oluştu' },
      { status: 500 }
    )
  }
}
