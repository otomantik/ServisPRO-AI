"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight, CreditCard, Banknote } from "lucide-react"

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  paymentMethod: string
  transactionDate: string
  technician?: {
    name: string
  }
}

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data fetching
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'income',
        amount: 2500,
        description: 'Servis ödemesi - Klima tamiri',
        paymentMethod: 'Nakit',
        transactionDate: new Date().toISOString(),
        technician: { name: 'Ahmet Yılmaz' }
      },
      {
        id: '2',
        type: 'expense',
        amount: 800,
        description: 'Yedek parça alımı',
        paymentMethod: 'Kredi Kartı',
        transactionDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        type: 'income',
        amount: 1800,
        description: 'Periyodik bakım ücreti',
        paymentMethod: 'Havale',
        transactionDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        technician: { name: 'Mehmet Kaya' }
      },
      {
        id: '4',
        type: 'expense',
        amount: 1200,
        description: 'Elektrik faturası',
        paymentMethod: 'Banka Havalesi',
        transactionDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        type: 'income',
        amount: 3200,
        description: 'Kombi servisi - Tamir',
        paymentMethod: 'Nakit',
        transactionDate: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        technician: { name: 'Ali Demir' }
      }
    ]

    setTimeout(() => {
      setTransactions(mockTransactions)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              transaction.type === 'income' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              {transaction.type === 'income' ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {transaction.description}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {transaction.paymentMethod}
                </Badge>
                {transaction.technician && (
                  <span className="text-xs text-gray-500">
                    {transaction.technician.name}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-sm font-semibold ${
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </p>
            <p className="text-xs text-gray-500">
              {formatDateTime(transaction.transactionDate)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
