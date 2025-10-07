import toast from 'react-hot-toast'

/**
 * Success toast helper
 */
export const showSuccess = (message: string) => {
  toast.success(message, {
    style: {
      background: '#10b981',
      color: '#fff',
    },
  })
}

/**
 * Error toast helper
 */
export const showError = (message: string) => {
  toast.error(message, {
    style: {
      background: '#ef4444',
      color: '#fff',
    },
  })
}

/**
 * Info toast helper
 */
export const showInfo = (message: string) => {
  toast(message, {
    icon: 'ℹ️',
    style: {
      background: '#3b82f6',
      color: '#fff',
    },
  })
}

/**
 * Warning toast helper
 */
export const showWarning = (message: string) => {
  toast(message, {
    icon: '⚠️',
    style: {
      background: '#f59e0b',
      color: '#fff',
    },
  })
}

/**
 * Loading toast helper
 */
export const showLoading = (message: string) => {
  return toast.loading(message)
}

/**
 * Dismiss toast
 */
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId)
}

/**
 * Async operation with toast
 */
export const toastPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string
    error: string | ((err: any) => string)
  }
) => {
  return toast.promise(promise, messages)
}

