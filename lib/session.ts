import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { prisma } from './prisma'
import { logger } from './logger'

const SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production'
)

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export interface SessionData {
  userId: string
  email: string
  name: string
  position: string
  iat: number
  exp: number
}

/**
 * Create session token
 */
export async function createSession(user: {
  id: string
  email: string
  name: string
  position: string
}): Promise<string> {
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    name: user.name,
    position: user.position,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY)

  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  })

  return token
}

/**
 * Verify session token
 */
export async function verifySession(token: string): Promise<SessionData | null> {
  try {
    const verified = await jwtVerify(token, SECRET_KEY)
    return verified.payload as unknown as SessionData
  } catch (error) {
    return null
  }
}

/**
 * Get session from cookies
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value

    if (!token) {
      return null
    }

    return await verifySession(token)
  } catch (error) {
    return null
  }
}

/**
 * Get current user from session
 */
export async function getCurrentUser() {
  const session = await getSession()
  
  if (!session) {
    return null
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        position: true,
        status: true,
        phone: true,
        permissions: true,
      },
    })

    if (!user || !user.status) {
      return null
    }

    return user
  } catch (error) {
    logger.error('Get current user error', error instanceof Error ? error : undefined, { context: 'getCurrentUser' })
    return null
  }
}

/**
 * Delete session
 */
export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

/**
 * Refresh session
 */
export async function refreshSession() {
  const session = await getSession()
  
  if (!session) {
    return false
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        position: true,
      },
    })

    if (!user) {
      return false
    }

    await createSession(user)
    return true
  } catch (error) {
    logger.error('Refresh session error', error instanceof Error ? error : undefined, { context: 'refreshSession' })
    return false
  }
}

/**
 * Check if user has permission
 */
export async function hasPermission(permission: string): Promise<boolean> {
  const user = await getCurrentUser()
  
  if (!user) {
    return false
  }

  // Admins have all permissions
  if (user.position === 'Sahip/Yönetici' || user.position === 'Admin') {
    return true
  }

  // Check specific permissions
  if (user.permissions) {
    try {
      const permissions = JSON.parse(user.permissions)
      return permissions.includes(permission)
    } catch {
      return false
    }
  }

  return false
}

/**
 * Require authentication - throw if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}

/**
 * Require permission - throw if not authorized
 */
export async function requirePermission(permission: string) {
  const user = await requireAuth()
  const hasAccess = await hasPermission(permission)
  
  if (!hasAccess) {
    throw new Error('Forbidden')
  }

  return user
}

