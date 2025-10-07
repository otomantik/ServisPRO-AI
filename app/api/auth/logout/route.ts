import { NextRequest } from "next/server";
import { deleteSession } from "@/lib/session";
import { successResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    await deleteSession();
    return successResponse(null, 'Başarıyla çıkış yapıldı');
  } catch (error) {
    console.error("Logout error:", error);
    return successResponse(null, 'Çıkış yapıldı'); // Even on error, return success
  }
}

