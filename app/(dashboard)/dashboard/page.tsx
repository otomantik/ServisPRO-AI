"use client";

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Wrench, 
  DollarSign, 
  Activity,
  Calendar,
  Package,
  CreditCard,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Plus
} from "lucide-react"
import Link from "next/link"
import { formatCurrencyTR } from "@/lib/summary"

interface DashboardStats {
  services: {
    total: number
    pending: number
    inProgress: number
    completed: number
    today: number
  }
  customers: {
    total: number
    new30Days: number
  }
  stock: {
    total: number
    lowStock: number
  }
  financial: {
    totalIncome: number
    totalExpense: number
    netProfit: number
    thisMonthIncome: number
    thisMonthExpense: number
    lastMonthIncome: number
  }
  recentServices: Array<{
    id: string
    serviceNo: string
    customerName: string
    deviceBrand: string
    deviceType: string
    status: string
    totalCost: number
  }>
  topDeviceBrands: Array<{ brand: string; count: number }>
  monthlyRevenue: Array<{ month: string; income: number; expense: number }>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch('/api/dashboard')
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to load dashboard', error)
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!stats) {
    return <div className="text-center py-12 text-gray-500">Veriler yüklenemedi</div>
  }

  const incomeChange = stats.financial.lastMonthIncome > 0 
    ? ((stats.financial.thisMonthIncome - stats.financial.lastMonthIncome) / stats.financial.lastMonthIncome) * 100 
    : 0
  const isIncomeUp = incomeChange >= 0

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Hoş Geldiniz! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
            ServisPro AI - Akıllı servis yönetimi ile işlerinizi kolaylaştırın
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Bugün
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/analytics">
              <Activity className="w-4 h-4 mr-2" />
              Rapor Al
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Services */}
        <Card className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/dashboard/services'}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servisler</CardTitle>
            <Wrench className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              {stats.services.total}
            </div>
            <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
              <div className="flex items-center text-xs text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                <span className="hidden xs:inline">{stats.services.completed} tamamlandı</span>
                <span className="xs:hidden">{stats.services.completed}</span>
              </div>
              <div className="flex items-center text-xs text-orange-600">
                <Clock className="w-3 h-3 mr-1" />
                <span className="hidden xs:inline">{stats.services.pending} bekliyor</span>
                <span className="xs:hidden">{stats.services.pending}</span>
              </div>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
        </Card>

        {/* Customers */}
        <Card className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/dashboard/customers'}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Müşteriler</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-green-600">
              {stats.customers.total}
            </div>
            <div className="flex items-center text-xs text-green-600 mt-3">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Son 30 günde {stats.customers.new30Days} yeni</span>
              <span className="sm:hidden">+{stats.customers.new30Days} yeni</span>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
        </Card>

        {/* Stock */}
        <Card className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/dashboard/stock'}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stok</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-orange-600">
              {stats.stock.total}
            </div>
            <div className="flex items-center text-xs mt-3">
              {stats.stock.lowStock > 0 ? (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">{stats.stock.lowStock} ürün kritik</span>
                  <span className="sm:hidden">{stats.stock.lowStock} kritik</span>
                </div>
              ) : (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Stoklar yeterli</span>
                  <span className="sm:hidden">Yeterli</span>
                </div>
              )}
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
        </Card>

        {/* Cash */}
        <Card className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/dashboard/kasa'}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Kâr</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-xl sm:text-2xl md:text-3xl font-bold ${stats.financial.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrencyTR(stats.financial.netProfit)}
            </div>
            <div className="flex items-center text-xs text-gray-600 mt-3">
              <CreditCard className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Bu yıl toplam</span>
              <span className="sm:hidden">Yıllık</span>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
        </Card>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
              Finansal Durum
            </CardTitle>
            <CardDescription>
              Bu ayın gelir ve gider durumu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Bu Ay Gelir */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Bu Ay Gelir</span>
                  <div className="flex items-center gap-2">
                    {isIncomeUp ? (
                      <div className="flex items-center text-xs text-green-600">
                        <ArrowUpRight className="w-3 h-3" />
                        {Math.abs(incomeChange).toFixed(1)}%
                      </div>
                    ) : (
                      <div className="flex items-center text-xs text-red-600">
                        <ArrowDownRight className="w-3 h-3" />
                        {Math.abs(incomeChange).toFixed(1)}%
                      </div>
                    )}
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrencyTR(stats.financial.thisMonthIncome)}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all" 
                    style={{ 
                      width: `${Math.min((stats.financial.thisMonthIncome / (stats.financial.thisMonthIncome + stats.financial.thisMonthExpense)) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* Bu Ay Gider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Bu Ay Gider</span>
                  <span className="text-lg font-bold text-red-600">
                    {formatCurrencyTR(stats.financial.thisMonthExpense)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all" 
                    style={{ 
                      width: `${Math.min((stats.financial.thisMonthExpense / (stats.financial.thisMonthIncome + stats.financial.thisMonthExpense)) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* Bu Ay Kar */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Bu Ay Net Kar</span>
                  <span className={`text-2xl font-bold ${(stats.financial.thisMonthIncome - stats.financial.thisMonthExpense) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrencyTR(stats.financial.thisMonthIncome - stats.financial.thisMonthExpense)}
                  </span>
                </div>
              </div>

              {/* Yıllık Toplam */}
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Yıllık Toplam Gelir</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrencyTR(stats.financial.totalIncome)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Yıllık Toplam Gider</p>
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrencyTR(stats.financial.totalExpense)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Device Brands */}
        <Card>
          <CardHeader>
            <CardTitle>Popüler Markalar</CardTitle>
            <CardDescription>
              En çok servis verilen markalar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topDeviceBrands.slice(0, 5).map((item, index) => (
                <div key={item.brand} className="flex items-center">
                  <div className="flex-1 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.brand}</p>
                      <p className="text-xs text-gray-600">{item.count} servis</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(item.count / stats.topDeviceBrands[0].count) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hızlı İşlemler</CardTitle>
          <CardDescription className="hidden sm:block">
            Sık kullanılan işlemler için hızlı erişim
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Button asChild className="h-20 sm:h-24 flex flex-col text-xs sm:text-sm">
              <Link href="/dashboard/services/new">
                <Wrench className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2" />
                Yeni Servis
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 sm:h-24 flex flex-col text-xs sm:text-sm">
              <Link href="/dashboard/customers/new">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2" />
                Yeni Müşteri
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 sm:h-24 flex flex-col text-xs sm:text-sm">
              <Link href="/dashboard/stock/new">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2" />
                Stok Ekle
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 sm:h-24 flex flex-col text-xs sm:text-sm">
              <Link href="/dashboard/kasa/new">
                <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2" />
                Kasa Hareketi
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Kasa ve Alacaklar Modülleri */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kasa Modülü */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                <CardTitle>Kasa Hareketleri</CardTitle>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/kasa-detay">
                  Detay
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            <CardDescription>
              Son nakit hareketleri ve durum
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Gelir</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrencyTR(stats.financial.totalIncome)}
                  </p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Gider</p>
                  <p className="text-lg font-bold text-red-600">
                    {formatCurrencyTR(stats.financial.totalExpense)}
                  </p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Bakiye</p>
                  <p className={`text-lg font-bold ${stats.financial.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatCurrencyTR(stats.financial.netProfit)}
                  </p>
                </div>
              </div>
              <Button asChild className="w-full" variant="outline">
                <Link href="/dashboard/kasa/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Hareket
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alacaklar Modülü */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-orange-600" />
                <CardTitle>Alacaklar</CardTitle>
              </div>
              <Button variant="outline" size="sm" asChild>
<Link href="/dashboard/alacaklar-detay">
                  Detay
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            <CardDescription>
              Faturalar ve tahsilat durumu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Toplam</p>
                  <p className="text-lg font-bold text-orange-600">
                    {formatCurrencyTR(stats.financial.totalIncome)}
                  </p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Tahsil</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrencyTR(stats.financial.thisMonthIncome)}
                  </p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Kalan</p>
                  <p className="text-lg font-bold text-blue-600">
                    {formatCurrencyTR(stats.financial.totalIncome - stats.financial.thisMonthIncome)}
                  </p>
                </div>
              </div>
              <Button asChild className="w-full" variant="outline">
                <Link href="/dashboard/alacaklar/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Fatura
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Services */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Son Servisler</CardTitle>
              <CardDescription>
                En son eklenen servis kayıtları
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/services">
                Tümünü Gör
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentServices.slice(0, 5).map((service) => (
              <div 
                key={service.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => window.location.href = `/dashboard/services/${service.id}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    service.status === 'completed' ? 'bg-green-100' :
                    service.status === 'in_progress' ? 'bg-blue-100' : 'bg-orange-100'
                  }`}>
                    {service.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : service.status === 'in_progress' ? (
                      <Activity className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">#{service.serviceNo}</p>
                    <p className="text-sm text-gray-600">{service.customerName}</p>
                    <p className="text-xs text-gray-500">{service.deviceBrand} {service.deviceType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatCurrencyTR(service.totalCost)}</p>
                  <p className="text-xs text-gray-600">
                    {service.status === 'completed' ? 'Tamamlandı' :
                     service.status === 'in_progress' ? 'Devam Ediyor' : 'Bekliyor'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
