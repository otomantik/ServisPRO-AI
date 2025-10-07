import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { successResponse, errorResponse, unauthorizedError } from "@/lib/api-response";
import { validateRequest, loginSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const validation = validateRequest(loginSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: { message: 'GeÃ§ersiz giriÅŸ bilgileri', details: validation.errors } },
        { status: 422 }
      );
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.status) {
      return unauthorizedError("E-posta veya ÅŸifre hatalÄ±");
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return unauthorizedError("E-posta veya ÅŸifre hatalÄ±");
    }

    // Create session
    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      position: user.position,
    });

    // Åifreyi response'dan Ã§Ä±kar
    const { password: _, ...userWithoutPassword } = user;

    return successResponse(
      { user: userWithoutPassword },
      'BaÅŸarÄ±yla giriÅŸ yapÄ±ldÄ±'
    );
  } catch (error) {
    logger.error("Login error", error instanceof Error ? error : undefined, { context: 'LoginAPI' });
    return errorResponse("GiriÅŸ yapÄ±lÄ±rken bir hata oluÅŸtu");
  }
}


