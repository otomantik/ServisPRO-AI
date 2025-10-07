import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const paymentTypes = await prisma.paymentType.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(paymentTypes);
  } catch (error) {
    console.error("Payment types fetch error:", error);
    return NextResponse.json(
      { error: "Ödeme türleri getirilemedi" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    const paymentType = await prisma.paymentType.create({
      data: {
        name: data.name,
        direction: data.direction,
      },
    });

    return NextResponse.json(paymentType);
  } catch (error) {
    console.error("Payment type creation error:", error);
    return NextResponse.json(
      { error: "Ödeme türü oluşturulamadı" },
      { status: 500 }
    );
  }
}
