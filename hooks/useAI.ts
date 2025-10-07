"use client"

import { useState } from "react"

// Type definitions
export interface FinanceInsight {
  type: 'info' | 'warning' | 'critical'
  title: string
  detail: string
  value?: number
}

export interface CustomerSegment {
  id: string
  name: string
  code: string
  count: number
  totalValue: number
  avgValue: number
}

export interface InventoryAlert {
  id: string
  name: string
  stock: number
  minStock: number
  reorderQty: number
  urgency: 'low' | 'medium' | 'high'
}

export interface Opportunity {
  id: string
  type: 'upsell' | 'cross_sell' | 'cost_save' | 'reorder' | 'retention'
  title: string
  detail: string
  estValue: number
  targetId?: string
}

export interface NLQResult {
  answer: string
  link?: string
  chartData?: any
  table?: {
    headers: string[]
    rows: any[][]
  }
}

// Check if AI keys are available
const hasAIKey = typeof window !== 'undefined' && (
  process.env.NEXT_PUBLIC_OPENAI_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_KEY ||
  process.env.NEXT_PUBLIC_DEEPSEEK_KEY
)

// Stub implementations
async function stubAnalyzeFinance(): Promise<{
  insights: FinanceInsight[]
  forecast: { month: string, predicted: number, confidence: number }[]
  anomalies: { date: string, amount: number, reason: string }[]
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))

  return {
    insights: [
      {
        type: 'info',
        title: 'Pozitif Nakit Akışı',
        detail: 'Bu ay gelirleriniz giderlerinizi %23 oranında aştı. Sağlıklı bir nakit akışınız var.',
        value: 23
      },
      {
        type: 'warning',
        title: 'Yüksek Kart Komisyonu',
        detail: 'Kart ödemelerindeki komisyon oranınız sektör ortalamasının üzerinde. Banka ile görüşerek %15 tasarruf sağlayabilirsiniz.',
        value: 15
      },
      {
        type: 'critical',
        title: 'Gelir Düşüşü Trendi',
        detail: 'Son 3 aydır gelirlerinizde düşüş trendi gözlemleniyor. Müşteri kazanım stratejinizi gözden geçirmelisiniz.',
        value: -12
      }
    ],
    forecast: [
      { month: 'Gelecek Ay', predicted: 45000, confidence: 0.85 },
      { month: '2 Ay Sonra', predicted: 47000, confidence: 0.75 },
      { month: '3 Ay Sonra', predicted: 49000, confidence: 0.65 }
    ],
    anomalies: [
      { date: '2025-09-15', amount: 15000, reason: 'Beklenmeyen yüksek gider - Ekipman alımı' },
      { date: '2025-10-03', amount: 8500, reason: 'Olağandışı gelir artışı - Toplu servis ödemesi' }
    ]
  }
}

async function stubAnalyzeCustomers(): Promise<{
  segments: CustomerSegment[]
  churnRisks: { id: string, name: string, score: number, reason: string }[]
  opportunities: Opportunity[]
}> {
  await new Promise(resolve => setTimeout(resolve, 800))

  return {
    segments: [
      { id: '1', name: 'Sadık Müşteriler', code: 'LOYAL', count: 45, totalValue: 125000, avgValue: 2777 },
      { id: '2', name: 'Yüksek Değerli', code: 'HIGH_VALUE', count: 12, totalValue: 98000, avgValue: 8166 },
      { id: '3', name: 'Risk Altında', code: 'AT_RISK', count: 23, totalValue: 34000, avgValue: 1478 },
      { id: '4', name: 'Uyuyan Müşteriler', code: 'DORMANT', count: 67, totalValue: 12000, avgValue: 179 }
    ],
    churnRisks: [
      { id: '1', name: 'Ahmet Teknoloji Ltd.', score: 0.85, reason: 'Son 4 ayda işlem yok, önceden aylık müşteriydi' },
      { id: '2', name: 'Mehmet Yılmaz', score: 0.72, reason: 'İşlem sıklığı %60 azaldı, son serviste memnuniyetsizlik' },
      { id: '3', name: 'Beyaz Elektronik', score: 0.68, reason: 'Rakip firmaya geçiş sinyalleri' }
    ],
    opportunities: [
      {
        id: '1',
        type: 'upsell',
        title: 'Premium Bakım Paketi Fırsatı',
        detail: '23 müşteri yüksek frekanslı servis kullanıyor. Yıllık bakım paketi önerisi %40 ek gelir sağlayabilir.',
        estValue: 35000
      },
      {
        id: '2',
        type: 'retention',
        title: 'Churn Önleme Kampanyası',
        detail: 'Risk altındaki 23 müşteri için özel indirim kampanyası ile %70 retention sağlanabilir.',
        estValue: 28000
      },
      {
        id: '3',
        type: 'cross_sell',
        title: 'Aksesuar Satış Potansiyeli',
        detail: 'Servis alan müşterilere yedek parça ve aksesuar satışı ile %25 ek gelir.',
        estValue: 18500
      }
    ]
  }
}

async function stubAnalyzeInventory(): Promise<{
  alerts: InventoryAlert[]
  slowMoving: { id: string, name: string, stock: number, daysSinceLastSale: number }[]
  reorderPlan: { id: string, name: string, qty: number, estimatedCost: number, priority: string }[]
}> {
  await new Promise(resolve => setTimeout(resolve, 800))

  return {
    alerts: [
      { id: '1', name: 'Laptop Adaptörü 65W', stock: 2, minStock: 10, reorderQty: 20, urgency: 'high' },
      { id: '2', name: 'Termal Macun', stock: 5, minStock: 8, reorderQty: 15, urgency: 'medium' },
      { id: '3', name: 'HDMI Kablo 2m', stock: 8, minStock: 12, reorderQty: 25, urgency: 'low' }
    ],
    slowMoving: [
      { id: '1', name: 'VGA Adaptör', stock: 45, daysSinceLastSale: 127 },
      { id: '2', name: 'DVD-RW Sürücü', stock: 18, daysSinceLastSale: 89 },
      { id: '3', name: 'IDE Kablo', stock: 32, daysSinceLastSale: 156 }
    ],
    reorderPlan: [
      { id: '1', name: 'Laptop Adaptörü 65W', qty: 20, estimatedCost: 2400, priority: 'urgent' },
      { id: '2', name: 'Termal Macun', qty: 15, estimatedCost: 450, priority: 'high' },
      { id: '3', name: 'Klavye Türkçe Q', qty: 12, estimatedCost: 1800, priority: 'medium' }
    ]
  }
}

async function stubAsk(question: string): Promise<NLQResult> {
  await new Promise(resolve => setTimeout(resolve, 1000))

  const questionLower = question.toLowerCase()

  if (questionLower.includes('harcama') || questionLower.includes('gider') || questionLower.includes('spend')) {
    return {
      answer: 'Son ay toplam gideriniz ₺32,450 olarak gerçekleşti. Bu rakam bir önceki aya göre %8.5 daha yüksek. En büyük gider kalemleri: Personel (₺18,000), Malzeme (₺9,200), Kira (₺3,500).',
      link: '/dashboard/cash?filter=expense&period=last_month',
      chartData: {
        labels: ['Personel', 'Malzeme', 'Kira', 'Elektrik', 'Diğer'],
        values: [18000, 9200, 3500, 1200, 550]
      }
    }
  }

  if (questionLower.includes('müşteri') || questionLower.includes('customer') || questionLower.includes('gelir') || questionLower.includes('revenue')) {
    return {
      answer: 'Bu çeyrek en yüksek gelir getiren 10 müşteriniz toplam ₺127,500 ciro sağladı. Bu, toplam gelirinizin %68\'ini oluşturuyor. En büyük müşteriniz Ahmet Teknoloji Ltd. (₺24,500).',
      link: '/dashboard/customers?sort=revenue&order=desc',
      table: {
        headers: ['Müşteri', 'Toplam Gelir', 'Servis Sayısı', 'Ortalama'],
        rows: [
          ['Ahmet Teknoloji Ltd.', '₺24,500', '8', '₺3,062'],
          ['Beyaz Elektronik', '₺18,300', '6', '₺3,050'],
          ['Mehmet Yılmaz', '₺15,700', '12', '₺1,308']
        ]
      }
    }
  }

  if (questionLower.includes('stok') || questionLower.includes('inventory')) {
    return {
      answer: '14 gün içinde 3 ürününüzün stoğu tükenecek: Laptop Adaptörü (2 adet kaldı, günde 0.5 adet satılıyor), Termal Macun (5 adet), HDMI Kablo (8 adet). Acil sipariş vermeniz önerilir.',
      link: '/dashboard/stock?filter=low_stock',
      table: {
        headers: ['Ürün', 'Mevcut Stok', 'Günlük Satış', 'Tükenme Süresi'],
        rows: [
          ['Laptop Adaptörü 65W', '2', '0.5', '4 gün'],
          ['Termal Macun', '5', '0.3', '16 gün'],
          ['HDMI Kablo 2m', '8', '0.6', '13 gün']
        ]
      }
    }
  }

  return {
    answer: `"${question}" sorunuz için analiz yapılıyor. Şu anda bu sorgulama türü için stub veri döndürülüyor. Gerçek AI entegrasyonu ile daha detaylı analiz alabilirsiniz. Önerilen sorgular: "Son ay ne kadar harcadık?", "En karlı müşteriler kimler?", "Hangi stoklar tükeniyor?"`
  }
}

// Live AI implementations (placeholder for now)
async function liveAnalyzeFinance() {
  // TODO: Implement with OpenAI/Gemini API
  return stubAnalyzeFinance()
}

async function liveAnalyzeCustomers() {
  // TODO: Implement with OpenAI/Gemini API
  return stubAnalyzeCustomers()
}

async function liveAnalyzeInventory() {
  // TODO: Implement with OpenAI/Gemini API
  return stubAnalyzeInventory()
}

async function liveAsk(question: string) {
  // TODO: Implement with OpenAI/Gemini API
  return stubAsk(question)
}

// Main hook
export function useAI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeFinance = async () => {
    setLoading(true)
    setError(null)
    try {
      return hasAIKey ? await liveAnalyzeFinance() : await stubAnalyzeFinance()
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const analyzeCustomers = async () => {
    setLoading(true)
    setError(null)
    try {
      return hasAIKey ? await liveAnalyzeCustomers() : await stubAnalyzeCustomers()
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const analyzeInventory = async () => {
    setLoading(true)
    setError(null)
    try {
      return hasAIKey ? await liveAnalyzeInventory() : await stubAnalyzeInventory()
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const ask = async (question: string) => {
    setLoading(true)
    setError(null)
    try {
      return hasAIKey ? await liveAsk(question) : await stubAsk(question)
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    analyzeFinance,
    analyzeCustomers,
    analyzeInventory,
    ask,
    loading,
    error,
    isLive: hasAIKey
  }
}
