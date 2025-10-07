import { logger } from './logger'

/**
 * Global error handler for unhandled errors
 */
export function setupErrorHandlers() {
  if (typeof window === 'undefined') {
    return
  }

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled Promise Rejection', event.reason)
    event.preventDefault()
  })

  // Handle global errors
  window.addEventListener('error', (event) => {
    logger.error('Global Error', event.error, {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    })
  })
}

/**
 * Error boundary helper
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
  }
}

/**
 * Handle API errors
 */
export function handleApiError(error: any): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error.response) {
    // HTTP error
    return new AppError(
      error.response.data?.message || 'API Error',
      error.response.data?.code,
      error.response.status,
      error.response.data
    )
  }

  if (error.request) {
    // Network error
    return new AppError('Network Error', 'NETWORK_ERROR', 0, { originalError: error.message })
  }

  // Generic error
  return new AppError(error.message || 'Unknown Error', 'UNKNOWN_ERROR', 500)
}

