import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { successResponse, unauthorizedError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return unauthorizedError("Oturum bulunamadı");
    }

    return successResponse(user);
  } catch (error) {
    console.error("Get current user error:", error);
    return unauthorizedError("Oturum doğrulanamadı");
  }
}

