"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Users,
  Package,
  DollarSign,
  Search,
  Sparkles,
  BarChart3,
  ArrowRight,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { routes } from "@/lib/routes"
import { useAI } from "@/hooks/useAI"
import type { FinanceInsight, CustomerSegment, InventoryAlert, Opportunity } from "@/hooks/useAI"

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'finance' | 'customers' | 'inventory' | 'operations' | 'ask'>('finance')
  const [nlqQuery, setNlqQuery] = useState("")
  const ai = useAI()

  // State for AI results
  const [financeData, setFinanceData] = useState<any>(null)
  const [customerData, setCustomerData] = useState<any>(null)
  const [inventoryData, setInventoryData] = useState<any>(null)
  const [nlqResult, setNlqResult] = useState<any>(null)

  const handleAnalyzeFinance = async () => {
    const result = await ai.analyzeFinance()
    setFinanceData(result)
  }

  const handleAnalyzeCustomers = async () => {
    const result = await ai.analyzeCustomers()
    setCustomerData(result)
  }

  const handleAnalyzeInventory = async () => {
    const result = await ai.analyzeInventory()
    setInventoryData(result)
  }

  const handleNLQSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nlqQuery.trim()) return
    const result = await ai.ask(nlqQuery)
    setNlqResult(result)
  }

  const tabs = [
    { id: 'finance', label: 'Finans', icon: DollarSign },
    { id: 'customers', label: 'Müşteriler', icon: Users },
    { id: 'inventory', label: 'Envanter', icon: Package },
    { id: 'operations', label: 'Operasyonlar', icon: BarChart3 },
    { id: 'ask', label: 'AI\'ya Sor', icon: Sparkles }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-blue-600" />
          AI Destekli Analizler
        </h1>
        <p className="text-gray-600 mt-1">
          İşletmeniz için derin içgörüler ve öneriler
          {!ai.isLive && (
            <Badge variant="outline" className="ml-2">Demo Mode</Badge>
          )}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                  ${activeTab === tab.id 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Finance Tab */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Finans Analizi</CardTitle>
                <CardDescription>
                  Gelir, gider, nakit akışı ve tahminler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleAnalyzeFinance} disabled={ai.loading}>
                  {ai.loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analiz ediliyor...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Finans Analizini Başlat
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {financeData && (
              <>
                {/* Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle>İçgörüler ve Uyarılar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {financeData.insights.map((insight: FinanceInsight, idx: number) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border-l-4 ${
                          insight.type === 'critical' ? 'bg-red-50 border-red-500' :
                          insight.type === 'warning' ? 'bg-orange-50 border-orange-500' :
                          'bg-blue-50 border-blue-500'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                              {insight.type === 'critical' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                              {insight.title}
                            </h4>
                            <p className="text-sm text-gray-700 mt-1">{insight.detail}</p>
                          </div>
                          {insight.value && (
                            <Badge variant={insight.value > 0 ? 'default' : 'destructive'}>
                              {insight.value > 0 ? '+' : ''}{insight.value}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Forecast */}
                <Card>
                  <CardHeader>
                    <CardTitle>Gelir Tahmini</CardTitle>
                    <CardDescription>Önümüzdeki 3 ay için AI tahminleri</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {financeData.forecast.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{item.month}</p>
                            <p className="text-sm text-gray-600">
                              Güven: %{(item.confidence * 100).toFixed(0)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              ₺{item.predicted.toLocaleString('tr-TR')}
                            </p>
                            <TrendingUp className="w-4 h-4 text-green-600 ml-auto" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Anomalies */}
                {financeData.anomalies.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Tespit Edilen Anomaliler</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {financeData.anomalies.map((anomaly: any, idx: number) => (
                          <div key={idx} className="p-4 bg-orange-50 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-gray-900">{anomaly.date}</p>
                                <p className="text-sm text-gray-700 mt-1">{anomaly.reason}</p>
                              </div>
                              <p className="font-bold text-orange-600">
                                ₺{anomaly.amount.toLocaleString('tr-TR')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Müşteri Analizi</CardTitle>
                <CardDescription>
                  Segmentasyon, churn riski ve fırsatlar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleAnalyzeCustomers} disabled={ai.loading}>
                  {ai.loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analiz ediliyor...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Müşteri Analizini Başlat
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {customerData && (
              <>
                {/* Segments */}
                <Card>
                  <CardHeader>
                    <CardTitle>Müşteri Segmentleri</CardTitle>
                    <CardDescription>RFM tabanlı segmentasyon</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {customerData.segments.map((segment: CustomerSegment) => (
                        <div key={segment.id} className="p-4 border rounded-lg hover:shadow-md transition">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">{segment.name}</h4>
                              <Badge variant="outline" className="mt-1">{segment.code}</Badge>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">{segment.count}</p>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>Toplam Değer: <span className="font-medium">₺{segment.totalValue.toLocaleString('tr-TR')}</span></p>
                            <p>Ortalama: <span className="font-medium">₺{segment.avgValue.toLocaleString('tr-TR')}</span></p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Churn Risks */}
                {customerData.churnRisks.length > 0 && (
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                      <CardTitle className="text-red-900 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Yüksek Churn Riski
                      </CardTitle>
                      <CardDescription className="text-red-700">
                        Bu müşteriler kaybedilme riski taşıyor
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {customerData.churnRisks.map((risk: any) => (
                          <div key={risk.id} className="p-4 bg-white rounded-lg border border-red-200">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{risk.name}</h4>
                              <Badge variant="destructive">
                                Risk: %{(risk.score * 100).toFixed(0)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700">{risk.reason}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Opportunities */}
                {customerData.opportunities.length > 0 && (
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-green-900">Fırsatlar</CardTitle>
                      <CardDescription className="text-green-700">
                        Gelir artırma önerileri
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {customerData.opportunities.map((opp: Opportunity) => (
                          <div key={opp.id} className="p-4 bg-white rounded-lg border border-green-200">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-gray-900">{opp.title}</h4>
                                  <Badge>{opp.type}</Badge>
                                </div>
                                <p className="text-sm text-gray-700">{opp.detail}</p>
                              </div>
                              <div className="text-right ml-4">
                                <p className="text-xs text-gray-600">Tahmini Değer</p>
                                <p className="text-lg font-bold text-green-600">
                                  ₺{opp.estValue.toLocaleString('tr-TR')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Envanter Analizi</CardTitle>
                <CardDescription>
                  Stok uyarıları ve sipariş önerileri
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleAnalyzeInventory} disabled={ai.loading}>
                  {ai.loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analiz ediliyor...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Envanter Analizini Başlat
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {inventoryData && (
              <>
                {/* Low Stock Alerts */}
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-orange-900 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Düşük Stok Uyarıları
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {inventoryData.alerts.map((alert: InventoryAlert) => (
                        <div key={alert.id} className="p-4 bg-white rounded-lg border border-orange-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{alert.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Mevcut: <span className="font-medium">{alert.stock}</span> / 
                                Min: <span className="font-medium">{alert.minStock}</span>
                              </p>
                              <p className="text-sm text-blue-600 mt-1">
                                Önerilen sipariş: <span className="font-medium">{alert.reorderQty} adet</span>
                              </p>
                            </div>
                            <Badge variant={
                              alert.urgency === 'high' ? 'destructive' :
                              alert.urgency === 'medium' ? 'default' : 'outline'
                            }>
                              {alert.urgency === 'high' ? 'Acil' :
                               alert.urgency === 'medium' ? 'Önemli' : 'Düşük'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Slow Moving Stock */}
                {inventoryData.slowMoving.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Yavaş Hareket Eden Stoklar</CardTitle>
                      <CardDescription>Tasfiye veya promosyon önerileri</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {inventoryData.slowMoving.map((item: any) => (
                          <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">{item.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {item.daysSinceLastSale} gündür satış yok
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-900">{item.stock} adet</p>
                                <Badge variant="outline">Tasfiye öner</Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Reorder Plan */}
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-900">Sipariş Planı</CardTitle>
                    <CardDescription className="text-green-700">
                      AI tarafından optimize edilmiş sipariş önerileri
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {inventoryData.reorderPlan.map((item: any) => (
                        <div key={item.id} className="p-4 bg-white rounded-lg border border-green-200">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-gray-900">{item.name}</h4>
                                <Badge variant={
                                  item.priority === 'urgent' ? 'destructive' :
                                  item.priority === 'high' ? 'default' : 'outline'
                                }>
                                  {item.priority === 'urgent' ? 'Acil' :
                                   item.priority === 'high' ? 'Yüksek' : 'Orta'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                Miktar: <span className="font-medium">{item.qty} adet</span>
                              </p>
                            </div>
                            <p className="text-lg font-bold text-green-600">
                              ₺{item.estimatedCost.toLocaleString('tr-TR')}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="pt-3 border-t">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-gray-900">Toplam Tahmini Maliyet:</p>
                          <p className="text-xl font-bold text-green-600">
                            ₺{inventoryData.reorderPlan.reduce((sum: number, item: any) => sum + item.estimatedCost, 0).toLocaleString('tr-TR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

        {/* Operations Tab */}
        {activeTab === 'operations' && (
          <Card>
            <CardHeader>
              <CardTitle>Operasyon Analizi</CardTitle>
              <CardDescription>
                Teknisyen performansı, SLA ve darboğazlar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Operasyon analizi özellikleri yakında eklenecek
                </p>
                <Button variant="outline" asChild>
                  <Link href={routes.services.list()}>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Servisler Sayfasına Git
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ask AI Tab */}
        {activeTab === 'ask' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI'ya Soru Sorun</CardTitle>
                <CardDescription>
                  Doğal dilde soru sorun, AI size cevap versin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNLQSubmit} className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      value={nlqQuery}
                      onChange={(e) => setNlqQuery(e.target.value)}
                      placeholder='Örn: "Son ay ne kadar harcadık?", "En karlı müşteriler kimler?"'
                      disabled={ai.loading}
                    />
                  </div>
                  <Button type="submit" disabled={ai.loading || !nlqQuery.trim()}>
                    {ai.loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </Button>
                </form>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => setNlqQuery("Son ay ne kadar harcadık?")}
                  >
                    Son ay ne kadar harcadık?
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => setNlqQuery("En karlı müşteriler kimler?")}
                  >
                    En karlı müşteriler kimler?
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => setNlqQuery("Hangi stoklar 14 gün içinde tükeniyor?")}
                  >
                    Hangi stoklar tükeniyor?
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {nlqResult && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-900">AI Cevabı</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-900 mb-4">{nlqResult.answer}</p>

                  {nlqResult.link && (
                    <Button variant="outline" asChild className="mb-4">
                      <Link href={nlqResult.link}>
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Detaylı Görünüm
                      </Link>
                    </Button>
                  )}

                  {nlqResult.table && (
                    <div className="overflow-x-auto bg-white rounded-lg border">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {nlqResult.table.headers.map((header: string, idx: number) => (
                              <th key={idx} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {nlqResult.table.rows.map((row: any[], idx: number) => (
                            <tr key={idx}>
                              {row.map((cell: any, cellIdx: number) => (
                                <td key={cellIdx} className="px-4 py-3 text-sm text-gray-900">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
