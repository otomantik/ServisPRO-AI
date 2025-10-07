import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    const services = await prisma.service.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        customer: true,
        technician: true,
      },
    });

    return NextResponse.json(services);
  } catch (error: any) {
    console.error("Services API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Generate service number
    const year = new Date().getFullYear();
    const lastService = await prisma.service.findFirst({
      where: {
        serviceNo: {
          startsWith: `${year}-`
        }
      },
      orderBy: { serviceNo: 'desc' }
    });
    
    let nextNumber = 1;
    if (lastService && lastService.serviceNo) {
      const lastNumber = parseInt(lastService.serviceNo.split('-')[1]);
      nextNumber = lastNumber + 1;
    }
    
    const serviceNo = `${year}-${String(nextNumber).padStart(4, '0')}`;
    
    const service = await prisma.service.create({
      data: {
        serviceNo,
        customerId: data.customerId,
        technicianId: data.technicianId || null,
        deviceBrand: data.deviceBrand || null,
        deviceType: data.deviceType || null,
        deviceModel: data.deviceModel || null,
        serialNo: data.serialNo || null,
        problem: data.problem || null,
        priority: data.priority || 'normal',
        status: 'pending',
        laborCost: data.laborCost || 0,
        partsCost: data.partsCost || 0,
      },
      include: {
        customer: true,
        technician: true,
      }
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error: any) {
    console.error("Service creation error:", error);
    return NextResponse.json(
      { error: error.message || "Servis oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}