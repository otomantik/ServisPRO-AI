import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, hasPermission } from './session'
import { unauthorizedError, forbiddenError } from './api-response'

/**
 * API Route Guard - Requires authentication
 */
export async function withAuth(
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const user = await getCurrentUser()
      
      if (!user) {
        return unauthorizedError('Oturum açmanız gerekiyor')
      }

      return await handler(req, user)
    } catch (error) {
      console.error('Auth guard error:', error)
      return unauthorizedError('Yetkisiz erişim')
    }
  }
}

/**
 * API Route Guard - Requires specific permission
 */
export async function withPermission(
  permission: string,
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const user = await getCurrentUser()
      
      if (!user) {
        return unauthorizedError('Oturum açmanız gerekiyor')
      }

      const hasAccess = await hasPermission(permission)
      
      if (!hasAccess) {
        return forbiddenError('Bu işlem için yetkiniz yok')
      }

      return await handler(req, user)
    } catch (error) {
      console.error('Permission guard error:', error)
      return forbiddenError('Erişim reddedildi')
    }
  }
}

/**
 * API Route Guard - Admin only
 */
export async function withAdmin(
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  return withPermission('admin', handler)
}

