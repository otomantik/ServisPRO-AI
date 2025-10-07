/**
 * Toast Helper Functions
 * 
 * Bu dosya, alert() yerine kullanılacak modern toast notification wrapper'larını içerir.
 * Daha iyi UX için alert() kullanımından kaçının.
 */

import { showSuccess, showError, showWarning, toastPromise } from './toast'

/**
 * Başarılı işlem bildirimi
 * @example
 * await saveData()
 * notifySuccess("Veriler kaydedildi!")
 */
export const notifySuccess = (message: string) => {
  showSuccess(message)
}

/**
 * Hata bildirimi
 * @example
 * catch (error) {
 *   notifyError("İşlem başarısız!")
 * }
 */
export const notifyError = (message: string) => {
  showError(message)
}

/**
 * Uyarı bildirimi
 * @example
 * if (stock < 10) {
 *   notifyWarning("Stok azalıyor!")
 * }
 */
export const notifyWarning = (message: string) => {
  showWarning(message)
}

/**
 * Async işlemler için otomatik toast
 * @example
 * await handleAsyncOperation(
 *   fetch('/api/data', { method: 'POST', body: JSON.stringify(data) }),
 *   {
 *     loading: 'Kaydediliyor...',
 *     success: 'Başarıyla kaydedildi!',
 *     error: 'Kayıt başarısız!'
 *   }
 * )
 */
export const handleAsyncOperation = async <T>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string
    error: string
  }
) => {
  return toastPromise(promise, messages)
}

/**
 * API işlemleri için wrapper
 * @example
 * const result = await apiRequest(
 *   fetch('/api/customers', { method: 'POST', body: JSON.stringify(customer) }),
 *   'Müşteri',
 *   'oluşturuldu'
 * )
 */
export const apiRequest = async <T>(
  promise: Promise<Response>,
  entityName: string,
  action: string
) => {
  return toastPromise(
    promise.then(async (res) => {
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Bilinmeyen hata' }))
        throw new Error(error.error || error.message || 'İşlem başarısız')
      }
      return res.json()
    }),
    {
      loading: `${entityName} ${action}...`,
      success: `${entityName} başarıyla ${action}!`,
      error: (err) => err.message || `${entityName} ${action} başarısız!`
    }
  )
}

/**
 * Silme işlemleri için özel wrapper
 * @example
 * await handleDelete(
 *   fetch(`/api/customers/${id}`, { method: 'DELETE' }),
 *   'Müşteri'
 * )
 */
export const handleDelete = async (
  promise: Promise<Response>,
  entityName: string
) => {
  return apiRequest(promise, entityName, 'silindi')
}

/**
 * Kaydetme işlemleri için özel wrapper
 * @example
 * await handleSave(
 *   fetch('/api/customers', { method: 'POST', body: JSON.stringify(data) }),
 *   'Müşteri'
 * )
 */
export const handleSave = async (
  promise: Promise<Response>,
  entityName: string
) => {
  return apiRequest(promise, entityName, 'kaydedildi')
}

/**
 * Güncelleme işlemleri için özel wrapper
 * @example
 * await handleUpdate(
 *   fetch(`/api/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
 *   'Müşteri'
 * )
 */
export const handleUpdate = async (
  promise: Promise<Response>,
  entityName: string
) => {
  return apiRequest(promise, entityName, 'güncellendi')
}

/**
 * Konfirmasyon gerektiren işlemler
 * @example
 * const confirmed = await confirmAction('Bu müşteriyi silmek istediğinize emin misiniz?')
 * if (confirmed) {
 *   // Silme işlemi
 * }
 */
export const confirmAction = (message: string): boolean => {
  // Modern bir confirm modal kullanmak ideal ama geçici olarak confirm() kullanabiliriz
  // TODO: Custom modal component ile değiştir
  return confirm(message)
}

// ========================================
// MIGRATION HELPERS
// alert() → toast dönüşümü için yardımcılar
// ========================================

/**
 * alert() yerine kullan
 * @deprecated Use notifyError or notifySuccess instead
 * @example
 * // ❌ Eski
 * alert("İşlem başarılı!")
 * 
 * // ✅ Yeni
 * showAlert("İşlem başarılı!", "success")
 */
export const showAlert = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
  console.warn('showAlert is deprecated. Use notifySuccess, notifyError, or notifyWarning instead.')
  
  switch (type) {
    case 'success':
      showSuccess(message)
      break
    case 'error':
      showError(message)
      break
    case 'warning':
      showWarning(message)
      break
  }
}

/**
 * Migration helper: alert() kullanımını detect et ve uyar
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalAlert = window.alert
  window.alert = function(message?: any) {
    console.warn(
      '⚠️ alert() kullanımı deprecated! notifySuccess() veya notifyError() kullanın.',
      '\nMesaj:', message
    )
    return originalAlert.call(window, message)
  }
}

