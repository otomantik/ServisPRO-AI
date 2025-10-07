import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Tek fatura getir
    if (id) {
      const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: {
          customer: true,
          payments: true,
        },
      });

      if (!invoice) {
        return NextResponse.json({ error: "Fatura bulunamadı" }, { status: 404 });
      }

      return NextResponse.json(invoice);
    }

    // Tüm faturaları getir
    const invoices = await prisma.invoice.findMany({
      include: {
        customer: true,
        payments: true,
      },
      orderBy: { issueDate: "desc" },
      take: 100,
    });

    return NextResponse.json(invoices);
  } catch (error: any) {
    console.error("Invoices API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

