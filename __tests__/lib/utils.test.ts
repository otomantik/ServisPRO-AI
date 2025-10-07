import { formatCurrency, formatDate, formatNumber, cn } from '@/lib/utils'

describe('Utils', () => {
  describe('formatCurrency', () => {
    it('should format Turkish Lira correctly', () => {
      expect(formatCurrency(1000)).toBe('₺1.000,00')
      expect(formatCurrency(1234.56)).toBe('₺1.234,56')
      expect(formatCurrency(0)).toBe('₺0,00')
    })

    it('should handle negative values', () => {
      expect(formatCurrency(-500)).toBe('-₺500,00')
    })
  })

  describe('formatNumber', () => {
    it('should format numbers with Turkish locale', () => {
      expect(formatNumber(1000)).toBe('1.000')
      expect(formatNumber(1234567)).toBe('1.234.567')
    })
  })

  describe('formatDate', () => {
    it('should format dates correctly', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toMatch(/15\.01\.2024/)
    })
  })

  describe('cn', () => {
    it('should merge class names', () => {
      const result = cn('text-red-500', 'bg-blue-500')
      expect(result).toContain('text-red-500')
      expect(result).toContain('bg-blue-500')
    })

    it('should handle conditional classes', () => {
      const result = cn('base-class', false && 'hidden', true && 'visible')
      expect(result).toContain('base-class')
      expect(result).toContain('visible')
      expect(result).not.toContain('hidden')
    })
  })
})

