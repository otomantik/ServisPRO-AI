import { validateRequest, loginSchema, createCustomerSchema } from '@/lib/validation'

describe('Validation', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const data = {
        email: 'test@example.com',
        password: 'password123'
      }
      const result = validateRequest(loginSchema, data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('test@example.com')
      }
    })

    it('should reject invalid email', () => {
      const data = {
        email: 'invalid-email',
        password: 'password123'
      }
      const result = validateRequest(loginSchema, data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errors.email).toBeDefined()
      }
    })

    it('should reject missing password', () => {
      const data = {
        email: 'test@example.com',
        password: ''
      }
      const result = validateRequest(loginSchema, data)
      expect(result.success).toBe(false)
    })
  })

  describe('createCustomerSchema', () => {
    it('should validate correct customer data', () => {
      const data = {
        name: 'Test Customer',
        phone: '05551234567',
        type: 'individual'
      }
      const result = validateRequest(createCustomerSchema, data)
      expect(result.success).toBe(true)
    })

    it('should reject invalid phone number', () => {
      const data = {
        name: 'Test Customer',
        phone: '123', // Invalid
        type: 'individual'
      }
      const result = validateRequest(createCustomerSchema, data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errors.phone).toBeDefined()
      }
    })

    it('should reject short name', () => {
      const data = {
        name: 'A', // Too short
        phone: '05551234567',
        type: 'individual'
      }
      const result = validateRequest(createCustomerSchema, data)
      expect(result.success).toBe(false)
    })
  })
})

