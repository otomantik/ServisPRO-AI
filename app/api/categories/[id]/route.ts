import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    
    const category = await prisma.category.update({
      where: { id },
      data: {
        type: data.type,
        name: data.name,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Category update error:", error);
    return NextResponse.json(
      { error: "Kategori güncellenemedi" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Category delete error:", error);
    return NextResponse.json(
      { error: "Kategori silinemedi" },
      { status: 500 }
    );
  }
}
