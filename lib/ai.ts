// AI-powered features for the service management system
import { prisma } from "@/lib/prisma"

export interface AIInsight {
  type: 'trend' | 'anomaly' | 'prediction' | 'suggestion'
  title: string
  description: string
  confidence: number
  action?: string
  data?: any
}

export interface CashFlowAnalysis {
  totalIncome: number
  totalExpense: number
  netCashFlow: number
  trend: 'increasing' | 'decreasing' | 'stable'
  insights: AIInsight[]
}

export interface CustomerSegment {
  segment: 'loyal' | 'inactive' | 'high_spender' | 'new'
  customers: any[]
  count: number
  totalValue: number
}

export class AIService {
  // Analyze cash flow and generate insights
  static async analyzeCashFlow(months: number = 6): Promise<CashFlowAnalysis> {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - months)

    const transactions = await prisma.cashTransaction.findMany({
      where: {
        transactionDate: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { transactionDate: 'asc' }
    })

    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const netCashFlow = income - expense

    // Calculate trend
    const monthlyData = this.groupByMonth(transactions)
    const trend = this.calculateTrend(monthlyData)

    // Generate insights
    const insights = await this.generateCashFlowInsights(transactions, income, expense, trend)

    return {
      totalIncome: income,
      totalExpense: expense,
      netCashFlow,
      trend,
      insights
    }
  }

  // Segment customers based on behavior
  static async segmentCustomers(): Promise<CustomerSegment[]> {
    const customers = await prisma.customer.findMany({
      include: {
        services: {
          include: {
            cashTransactions: true
          }
        }
      }
    })

    const segments: CustomerSegment[] = []

    // Loyal customers (multiple services, recent activity)
    const loyalCustomers = customers.filter(customer => {
      const recentServices = customer.services.filter(s => 
        new Date(s.createdAt) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      )
      return customer.services.length >= 3 && recentServices.length > 0
    })

    segments.push({
      segment: 'loyal',
      customers: loyalCustomers,
      count: loyalCustomers.length,
      totalValue: loyalCustomers.reduce((sum, c) => 
        sum + c.services.reduce((s, service) => s + service.totalCost, 0), 0
      )
    })

    // Inactive customers (no recent activity)
    const inactiveCustomers = customers.filter(customer => {
      const recentServices = customer.services.filter(s => 
        new Date(s.createdAt) > new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
      )
      return recentServices.length === 0 && customer.services.length > 0
    })

    segments.push({
      segment: 'inactive',
      customers: inactiveCustomers,
      count: inactiveCustomers.length,
      totalValue: inactiveCustomers.reduce((sum, c) => 
        sum + c.services.reduce((s, service) => s + service.totalCost, 0), 0
      )
    })

    // High spenders (total value > average)
    const totalValue = customers.reduce((sum, c) => 
      sum + c.services.reduce((s, service) => s + service.totalCost, 0), 0
    )
    const averageValue = totalValue / customers.length

    const highSpenders = customers.filter(customer => {
      const customerValue = customer.services.reduce((sum, service) => sum + service.totalCost, 0)
      return customerValue > averageValue * 2
    })

    segments.push({
      segment: 'high_spender',
      customers: highSpenders,
      count: highSpenders.length,
      totalValue: highSpenders.reduce((sum, c) => 
        sum + c.services.reduce((s, service) => s + service.totalCost, 0), 0
      )
    })

    return segments
  }

  // Predict next month's expenses and income
  static async predictNextMonth(): Promise<{ income: number, expense: number, confidence: number }> {
    const last6Months = await prisma.cashTransaction.findMany({
      where: {
        transactionDate: {
          gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)
        }
      },
      orderBy: { transactionDate: 'asc' }
    })

    const monthlyData = this.groupByMonth(last6Months)
    const incomeTrend = this.calculateTrend(monthlyData.map(m => ({ ...m, net: m.income })))
    const expenseTrend = this.calculateTrend(monthlyData.map(m => ({ ...m, net: m.expense })))

    const avgIncome = monthlyData.reduce((sum, m) => sum + m.income, 0) / monthlyData.length
    const avgExpense = monthlyData.reduce((sum, m) => sum + m.expense, 0) / monthlyData.length

    // Simple linear regression for prediction
    const predictedIncome = avgIncome * (incomeTrend === 'increasing' ? 1.1 : incomeTrend === 'decreasing' ? 0.9 : 1.0)
    const predictedExpense = avgExpense * (expenseTrend === 'increasing' ? 1.1 : expenseTrend === 'decreasing' ? 0.9 : 1.0)

    return {
      income: Math.round(predictedIncome),
      expense: Math.round(predictedExpense),
      confidence: 0.75 // Simple confidence based on data consistency
    }
  }

  // Detect anomalies in transactions
  static async detectAnomalies(): Promise<AIInsight[]> {
    const transactions = await prisma.cashTransaction.findMany({
      where: {
        transactionDate: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    })

    const insights: AIInsight[] = []

    // Check for unusually large transactions
    const amounts = transactions.map(t => t.amount)
    const avgAmount = amounts.reduce((sum, a) => sum + a, 0) / amounts.length
    const stdDev = Math.sqrt(amounts.reduce((sum, a) => sum + Math.pow(a - avgAmount, 2), 0) / amounts.length)

    const anomalies = transactions.filter(t => Math.abs(t.amount - avgAmount) > 2 * stdDev)

    anomalies.forEach(transaction => {
      insights.push({
        type: 'anomaly',
        title: 'Unusual Transaction Detected',
        description: `Transaction of ${transaction.amount} TL is significantly different from average`,
        confidence: 0.8,
        action: 'Review transaction details',
        data: transaction
      })
    })

    return insights
  }

  // Suggest categories for transactions
  static async suggestCategory(description: string, amount: number): Promise<string[]> {
    // Simple keyword-based categorization
    const keywords = {
      'Yakıt': ['benzin', 'diesel', 'yakıt', 'fuel', 'gas'],
      'Maaş': ['maaş', 'salary', 'ücret', 'wage'],
      'Yedek Parça': ['parça', 'part', 'yedek', 'spare'],
      'Bakım': ['bakım', 'maintenance', 'servis', 'service'],
      'Elektrik': ['elektrik', 'electricity', 'fatura', 'bill'],
      'Su': ['su', 'water', 'fatura', 'bill'],
      'Kira': ['kira', 'rent', 'kiralama'],
      'Telefon': ['telefon', 'phone', 'internet', 'data']
    }

    const suggestions: string[] = []
    const lowerDesc = description.toLowerCase()

    Object.entries(keywords).forEach(([category, words]) => {
      if (words.some(word => lowerDesc.includes(word))) {
        suggestions.push(category)
      }
    })

    // If no keyword matches, suggest based on amount ranges
    if (suggestions.length === 0) {
      if (amount > 5000) suggestions.push('Büyük Harcama')
      else if (amount > 1000) suggestions.push('Orta Harcama')
      else suggestions.push('Küçük Harcama')
    }

    return suggestions
  }

  // Private helper methods
  private static groupByMonth(transactions: any[]) {
    const monthlyData: { [key: string]: { income: number, expense: number, net: number } } = {}

    transactions.forEach(transaction => {
      const month = new Date(transaction.transactionDate).toISOString().substring(0, 7)
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0, net: 0 }
      }
      
      if (transaction.type === 'income') {
        monthlyData[month].income += transaction.amount
      } else {
        monthlyData[month].expense += transaction.amount
      }
      
      // Calculate net for each month
      monthlyData[month].net = monthlyData[month].income - monthlyData[month].expense
    })

    return Object.values(monthlyData)
  }

  private static calculateTrend(data: { net: number }[]): 'increasing' | 'decreasing' | 'stable' {
    if (data.length < 2) return 'stable'

    const firstHalf = data.slice(0, Math.floor(data.length / 2))
    const secondHalf = data.slice(Math.floor(data.length / 2))

    const firstAvg = firstHalf.reduce((sum, d) => sum + d.net, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.net, 0) / secondHalf.length

    const change = (secondAvg - firstAvg) / firstAvg

    if (change > 0.1) return 'increasing'
    if (change < -0.1) return 'decreasing'
    return 'stable'
  }

  private static async generateCashFlowInsights(
    transactions: any[], 
    income: number, 
    expense: number, 
    trend: string
  ): Promise<AIInsight[]> {
    const insights: AIInsight[] = []

    // Cash flow health
    const netCashFlow = income - expense
    if (netCashFlow < 0) {
      insights.push({
        type: 'trend',
        title: 'Negative Cash Flow Alert',
        description: `Your expenses (${expense.toLocaleString()} TL) exceed income (${income.toLocaleString()} TL)`,
        confidence: 1.0,
        action: 'Review expenses and increase revenue'
      })
    } else if (netCashFlow > income * 0.3) {
      insights.push({
        type: 'trend',
        title: 'Healthy Cash Flow',
        description: `Great! You have a positive cash flow of ${netCashFlow.toLocaleString()} TL`,
        confidence: 0.9,
        action: 'Consider investing surplus funds'
      })
    }

    // Trend analysis
    if (trend === 'increasing') {
      insights.push({
        type: 'trend',
        title: 'Positive Growth Trend',
        description: 'Your cash flow is showing an upward trend',
        confidence: 0.8,
        action: 'Maintain current strategies'
      })
    } else if (trend === 'decreasing') {
      insights.push({
        type: 'trend',
        title: 'Declining Cash Flow',
        description: 'Your cash flow is decreasing over time',
        confidence: 0.8,
        action: 'Analyze and address declining revenue'
      })
    }

    return insights
  }
}
