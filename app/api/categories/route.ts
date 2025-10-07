import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Categories fetch error:", error)
    return NextResponse.json(
      { error: "Kategoriler getirilirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    
    const category = await prisma.category.create({
      data: {
        name: data.name,
        type: data.type || 'general'
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Category create error:", error)
    return NextResponse.json(
      { error: "Kategori oluşturulurken bir hata oluştu" },
      { status: 500 }
    )
  }
}