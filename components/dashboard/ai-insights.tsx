"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  AlertTriangle, 
  Lightbulb, 
  Target,
  Brain,
  BarChart3
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface AIInsightsProps {
  cashFlow: {
    totalIncome: number
    totalExpense: number
    netCashFlow: number
    trend: 'increasing' | 'decreasing' | 'stable'
    insights: Array<{
      type: string
      title: string
      description: string
      confidence: number
      action?: string
    }>
  }
  customerSegments: Array<{
    segment: string
    customers: any[]
    count: number
    totalValue: number
  }>
  predictions: {
    income: number
    expense: number
    confidence: number
  }
  anomalies: Array<{
    type: string
    title: string
    description: string
    confidence: number
  }>
}

export function AIInsights({ cashFlow, customerSegments, predictions, anomalies }: AIInsightsProps) {
  const getSegmentIcon = (segment: string) => {
    switch (segment) {
      case 'loyal': return <Users className="w-4 h-4 text-green-600" />
      case 'inactive': return <Users className="w-4 h-4 text-gray-600" />
      case 'high_spender': return <Users className="w-4 h-4 text-blue-600" />
      default: return <Users className="w-4 h-4 text-gray-600" />
    }
  }

  const getSegmentLabel = (segment: string) => {
    switch (segment) {
      case 'loyal': return 'Sadık Müşteriler'
      case 'inactive': return 'Pasif Müşteriler'
      case 'high_spender': return 'Yüksek Harcama'
      default: return segment
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">AI İçgörüleri</h2>
        </div>
        <Badge variant="outline" className="text-purple-600 border-purple-200">
          <Brain className="w-3 h-3 mr-1" />
          Akıllı Analiz
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Insights */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <BarChart3 className="w-5 h-5 mr-2" />
              Nakit Akışı Analizi
            </CardTitle>
            <CardDescription className="text-blue-700">
              AI destekli finansal analiz ve öneriler
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(cashFlow.totalIncome)}
                </p>
                <p className="text-sm text-green-700">Toplam Gelir</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(cashFlow.totalExpense)}
                </p>
                <p className="text-sm text-red-700">Toplam Gider</p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Net Nakit Akışı</span>
                <Badge variant={cashFlow.netCashFlow > 0 ? 'success' : 'destructive'}>
                  {cashFlow.trend === 'increasing' ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : cashFlow.trend === 'decreasing' ? (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  ) : null}
                  {cashFlow.trend === 'increasing' ? 'Yükseliş' : cashFlow.trend === 'decreasing' ? 'Düşüş' : 'Sabit'}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(cashFlow.netCashFlow)}
              </p>
            </div>

            {cashFlow.insights.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">AI Önerileri:</h4>
                {cashFlow.insights.slice(0, 2).map((insight, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-2">
                      <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">{insight.title}</p>
                        <p className="text-xs text-blue-700 mt-1">{insight.description}</p>
                        {insight.action && (
                          <p className="text-xs text-blue-600 mt-1 font-medium">
                            💡 {insight.action}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Segmentation */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-800">
              <Users className="w-5 h-5 mr-2" />
              Müşteri Segmentasyonu
            </CardTitle>
            <CardDescription className="text-purple-700">
              AI destekli müşteri analizi ve kategorilendirme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {customerSegments.map((segment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getSegmentIcon(segment.segment)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {getSegmentLabel(segment.segment)}
                    </p>
                    <p className="text-xs text-gray-600">
                      {segment.count} müşteri
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(segment.totalValue)}
                  </p>
                  <p className="text-xs text-gray-600">Toplam değer</p>
                </div>
              </div>
            ))}

            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-800">AI Önerisi</p>
                  <p className="text-xs text-purple-700">
                    Sadık müşterilerinize özel kampanyalar düzenleyin
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictions and Anomalies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Month Predictions */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <Target className="w-5 h-5 mr-2" />
              Gelecek Ay Tahmini
            </CardTitle>
            <CardDescription className="text-green-700">
              AI destekli gelir ve gider tahminleri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(predictions.income)}
                </p>
                <p className="text-sm text-green-700">Tahmini Gelir</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-xl font-bold text-orange-600">
                  {formatCurrency(predictions.expense)}
                </p>
                <p className="text-sm text-orange-700">Tahmini Gider</p>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Güvenilirlik</span>
                <Badge variant="outline">
                  %{Math.round(predictions.confidence * 100)}
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${predictions.confidence * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Anomaly Detection */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Anomali Tespiti
            </CardTitle>
            <CardDescription className="text-orange-700">
              Olağandışı işlemler ve uyarılar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {anomalies.length > 0 ? (
              <div className="space-y-3">
                {anomalies.slice(0, 3).map((anomaly, index) => (
                  <div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-orange-800">{anomaly.title}</p>
                        <p className="text-xs text-orange-700 mt-1">{anomaly.description}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          Güven: %{Math.round(anomaly.confidence * 100)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Anomali tespit edilmedi</p>
                <p className="text-xs text-gray-500">Tüm işlemler normal görünüyor</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
