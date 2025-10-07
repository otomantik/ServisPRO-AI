import { z } from 'zod'

/**
 * Common validation schemas
 */

export const emailSchema = z.string().email('Geçerli bir e-posta adresi girin')

export const phoneSchema = z.string()
  .regex(/^0\d{10}$/, 'Telefon numarası 0 ile başlamalı ve 11 haneli olmalıdır')
  .optional()
  .or(z.literal(''))

export const requiredPhoneSchema = z.string()
  .regex(/^0\d{10}$/, 'Telefon numarası 0 ile başlamalı ve 11 haneli olmalıdır')

/**
 * Customer validation schemas
 */
export const createCustomerSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  phone: requiredPhoneSchema,
  phone2: phoneSchema,
  email: emailSchema.optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  type: z.enum(['individual', 'corporate']).default('individual'),
  categoryId: z.string().optional(),
  taxNo: z.string().optional(),
  taxOffice: z.string().optional(),
  isSupplier: z.boolean().default(false),
})

export const updateCustomerSchema = createCustomerSchema.partial()

/**
 * Service validation schemas
 */
export const createServiceSchema = z.object({
  customerId: z.string().cuid('Geçersiz müşteri ID'),
  technicianId: z.string().cuid('Geçersiz teknisyen ID').optional(),
  deviceBrand: z.string().optional(),
  deviceType: z.string().optional(),
  deviceModel: z.string().optional(),
  serialNo: z.string().optional(),
  problem: z.string().min(5, 'Problem açıklaması en az 5 karakter olmalıdır'),
  priority: z.enum(['low', 'normal', 'urgent']).default('normal'),
  laborCost: z.number().min(0).default(0),
  partsCost: z.number().min(0).default(0),
  operatorNote: z.string().optional(),
  availableTime: z.string().optional(),
})

export const updateServiceSchema = z.object({
  technicianId: z.string().cuid().optional(),
  deviceBrand: z.string().optional(),
  deviceType: z.string().optional(),
  deviceModel: z.string().optional(),
  serialNo: z.string().optional(),
  problem: z.string().optional(),
  solution: z.string().optional(),
  diagnosis: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional(),
  priority: z.enum(['low', 'normal', 'urgent']).optional(),
  laborCost: z.number().min(0).optional(),
  partsCost: z.number().min(0).optional(),
  totalCost: z.number().min(0).optional(),
  paymentStatus: z.enum(['paid', 'unpaid', 'partial']).optional(),
  deliveryDate: z.string().datetime().optional(),
})

/**
 * Stock validation schemas
 */
export const createStockSchema = z.object({
  code: z.string().min(3, 'Stok kodu en az 3 karakter olmalıdır'),
  name: z.string().min(2, 'Stok adı en az 2 karakter olmalıdır'),
  categoryId: z.string().cuid().optional(),
  price: z.number().min(0, 'Fiyat negatif olamaz'),
  unit: z.string().default('Adet'),
  quantity: z.number().int().min(0).default(0),
  minQuantity: z.number().int().min(0).default(0),
  description: z.string().optional(),
  brands: z.array(z.string()).optional(),
  deviceTypes: z.array(z.string()).optional(),
  status: z.boolean().default(true),
})

export const updateStockSchema = createStockSchema.partial()

/**
 * Cash transaction validation schemas
 */
export const createCashTransactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive('Tutar pozitif olmalıdır'),
  paymentMethod: z.enum(['cash', 'card', 'transfer']).default('cash'),
  paymentTypeId: z.string().cuid().optional(),
  relatedServiceId: z.string().cuid().optional(),
  technicianId: z.string().cuid().optional(),
  description: z.string().optional(),
  transactionDate: z.string().datetime().optional(),
})

/**
 * User validation schemas
 */
export const createUserSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  phone: phoneSchema,
  position: z.string().default('Teknisyen'),
  status: z.boolean().default(true),
})

export const updateUserSchema = createUserSchema.partial().omit({ password: true })

export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6, 'Yeni şifre en az 6 karakter olmalıdır'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
})

/**
 * Login validation schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Şifre gereklidir'),
})

/**
 * Validation helper function
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        if (!errors[path]) {
          errors[path] = []
        }
        errors[path].push(err.message)
      })
      return { success: false, errors }
    }
    throw error
  }
}

