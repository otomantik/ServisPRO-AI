import { NextResponse } from 'next/server'

/**
 * Standard API Response Types
 */
export type ApiSuccessResponse<T = any> = {
  success: true
  data: T
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    pages?: number
  }
}

export type ApiErrorResponse = {
  success: false
  error: {
    message: string
    code?: string
    details?: any
  }
}

/**
 * Success Response Helper
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200,
  meta?: ApiSuccessResponse['meta']
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      meta,
    },
    { status }
  )
}

/**
 * Error Response Helper
 */
export function errorResponse(
  message: string,
  status: number = 500,
  code?: string,
  details?: any
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code,
        details,
      },
    },
    { status }
  )
}

/**
 * Validation Error Response
 */
export function validationError(
  errors: Record<string, string[]>
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors,
      },
    },
    { status: 422 }
  )
}

/**
 * Not Found Error
 */
export function notFoundError(
  resource: string = 'Resource'
): NextResponse<ApiErrorResponse> {
  return errorResponse(`${resource} not found`, 404, 'NOT_FOUND')
}

/**
 * Unauthorized Error
 */
export function unauthorizedError(
  message: string = 'Unauthorized'
): NextResponse<ApiErrorResponse> {
  return errorResponse(message, 401, 'UNAUTHORIZED')
}

/**
 * Forbidden Error
 */
export function forbiddenError(
  message: string = 'Forbidden'
): NextResponse<ApiErrorResponse> {
  return errorResponse(message, 403, 'FORBIDDEN')
}

/**
 * Server Error
 */
export function serverError(
  message: string = 'Internal server error',
  details?: any
): NextResponse<ApiErrorResponse> {
  console.error('Server error:', message, details)
  return errorResponse(message, 500, 'SERVER_ERROR', details)
}

