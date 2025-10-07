import { NextResponse } from "next/server";
import { getAccountsReceivable } from "@/lib/ledger";

export async function GET() {
  try {
    const total = await getAccountsReceivable();
    
    // Calculate customer count (simplified - count invoices with open status)
    const customerCount = 25; // Mock for now

    return NextResponse.json({
      total,
      customerCount,
    });
  } catch (error: any) {
    console.error("AR API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

