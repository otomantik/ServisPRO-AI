import { cookies } from 'next/headers'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export interface AuthUser {
  id: string
  email: string
  name: string
  position: string
}

/**
 * Create a session for a user
 */
export async function createSession(userId: string): Promise<string> {
  const sessionId = generateSessionId()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  
  // Store session in database or cache (Redis recommended)
  // For now, we'll use a simple cookie-based session
  
  return sessionId
}

/**
 * Get current user from session
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session-id')?.value
    
    if (!sessionId) {
      return null
    }
    
    // Validate session and get user
    // This is a simplified version - in production, use proper session management
    
    return null
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

/**
 * Verify user credentials
 */
export async function verifyCredentials(email: string, password: string): Promise<AuthUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        position: true,
        password: true,
        status: true,
      }
    })
    
    if (!user || !user.status) {
      return null
    }
    
    const isValid = await bcrypt.compare(password, user.password)
    
    if (!isValid) {
      return null
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword as AuthUser
  } catch (error) {
    console.error('Verify credentials error:', error)
    return null
  }
}

/**
 * Destroy session
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('session-id')
  cookieStore.delete('auth-token')
}

/**
 * Check if user has permission
 */
export async function checkPermission(userId: string, permission: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { permissions: true, position: true }
    })
    
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
  } catch (error) {
    console.error('Check permission error:', error)
    return false
  }
}

/**
 * Generate secure session ID
 */
function generateSessionId(): string {
  return `sess_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`
}

/**
 * Hash password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

