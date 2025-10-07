import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateStockCode } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    const stock = await prisma.stock.create({
      data: {
        code: generateStockCode(),
        name: data.name,
        categoryId: data.categoryId || null,
        price: data.price,
        unit: data.unit,
        quantity: data.quantity,
        minQuantity: data.minQuantity,
        description: data.description || null,
      },
    });

    return NextResponse.json(stock);
  } catch (error) {
    console.error("Stock creation error:", error);
    return NextResponse.json(
      { error: "Stok ürünü oluşturulamadı" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const stocks = await prisma.stock.findMany({
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(stocks);
  } catch (error) {
    console.error("Stocks fetch error:", error);
    return NextResponse.json(
      { error: "Stoklar getirilemedi" },
      { status: 500 }
    );
  }
}
