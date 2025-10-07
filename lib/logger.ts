/**
 * Simple logger for development and production
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogOptions {
  level: LogLevel
  message: string
  data?: any
  error?: Error
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private formatMessage(options: LogOptions): string {
    const timestamp = new Date().toISOString()
    const { level, message, data } = options
    
    let formatted = `[${timestamp}] [${level.toUpperCase()}] ${message}`
    
    if (data) {
      formatted += ` ${JSON.stringify(data)}`
    }
    
    return formatted
  }

  info(message: string, data?: any) {
    const formatted = this.formatMessage({ level: 'info', message, data })
    console.log(formatted)
    
    // In production, send to logging service (e.g., Sentry, LogRocket)
    if (!this.isDevelopment) {
      this.sendToService('info', message, data)
    }
  }

  warn(message: string, data?: any) {
    const formatted = this.formatMessage({ level: 'warn', message, data })
    console.warn(formatted)
    
    if (!this.isDevelopment) {
      this.sendToService('warn', message, data)
    }
  }

  error(message: string, error?: Error, data?: any) {
    const formatted = this.formatMessage({ level: 'error', message, data, error })
    console.error(formatted)
    
    if (error) {
      console.error(error.stack)
    }
    
    if (!this.isDevelopment) {
      this.sendToService('error', message, { ...data, error: error?.message, stack: error?.stack })
    }
  }

  debug(message: string, data?: any) {
    if (this.isDevelopment) {
      const formatted = this.formatMessage({ level: 'debug', message, data })
      console.debug(formatted)
    }
  }

  private sendToService(level: LogLevel, message: string, data?: any) {
    // TODO: Implement actual logging service integration
    // Example: Sentry, LogRocket, Datadog, etc.
    
    // For now, we'll just track errors
    if (level === 'error' && typeof window !== 'undefined') {
      // Client-side error tracking
      if (window.console && window.console.error) {
        window.console.error('[Logger]', message, data)
      }
    }
  }
}

export const logger = new Logger()

// Convenience exports
export const logInfo = (message: string, data?: any) => logger.info(message, data)
export const logWarn = (message: string, data?: any) => logger.warn(message, data)
export const logError = (message: string, error?: Error, data?: any) => logger.error(message, error, data)
export const logDebug = (message: string, data?: any) => logger.debug(message, data)

