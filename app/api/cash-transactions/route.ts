import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    const transaction = await prisma.cashTransaction.create({
      data: {
        type: data.type,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        paymentTypeId: data.paymentTypeId || null,
        paymentStatus: data.paymentStatus,
        relatedServiceId: data.relatedServiceId || null,
        technicianId: data.technicianId || null,
        description: data.description || null,
        transactionDate: new Date(data.transactionDate),
        installmentCount: data.installmentCount || 1,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Cash transaction creation error:", error);
    return NextResponse.json(
      { error: "Kasa hareketi oluşturulamadı" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const transactions = await prisma.cashTransaction.findMany({
      include: {
        paymentType: true,
        technician: true,
        service: {
          include: {
            customer: true,
          },
        },
      },
      orderBy: { transactionDate: "desc" },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Cash transactions fetch error:", error);
    return NextResponse.json(
      { error: "Kasa hareketleri getirilemedi" },
      { status: 500 }
    );
  }
}
