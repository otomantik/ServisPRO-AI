"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Calendar,
  Eye,
  Edit,
  Download
} from "lucide-react"
import Link from "next/link"
import { routes } from "@/lib/routes"
import { formatCurrencyTR, formatDateTR } from "@/lib/summary"

interface LedgerEntryWithDetails {
  id: string
  date: string
  amount: number
  summary: string
  type: 'income' | 'expense'
  method: 'cash' | 'card' | 'transfer'
  debitAccount: string
  creditAccount: string
}

export default function KasaPage() {
  const [entries, setEntries] = useState<LedgerEntryWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    cashBalance: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/kasa')
      if (res.ok) {
        const data = await res.json()
        setEntries(data.entries || [])
        setStats(data.stats || { totalIncome: 0, totalExpense: 0, cashBalance: 0 })
      }
    } catch (error) {
      console.error('Failed to load cash data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || entry.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kasa Yönetimi</h1>
          <p className="text-gray-600 mt-1">
            Gelir, gider ve nakit akışı takibi (Çift taraflı kayıt sistemi)
          </p>
        </div>
        <Button asChild>
          <Link href={routes.kasa.new()}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Kayıt
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrencyTR(stats.totalIncome)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Müşteri tahsilatları ve diğer gelirler</p>
          </CardContent>
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Gider</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrencyTR(stats.totalExpense)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Maaş, yakıt, kira ve diğer giderler</p>
          </CardContent>
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kasa Bakiyesi</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.cashBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrencyTR(stats.cashBalance)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Güncel nakit + banka bakiyesi</p>
          </CardContent>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Açıklama, tutar veya tarih ile arayın..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterType('all')}
                size="sm"
              >
                Tümü
              </Button>
              <Button
                variant={filterType === 'income' ? 'default' : 'outline'}
                onClick={() => setFilterType('income')}
                size="sm"
              >
                Gelir
              </Button>
              <Button
                variant={filterType === 'expense' ? 'default' : 'outline'}
                onClick={() => setFilterType('expense')}
                size="sm"
              >
                Gider
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Dışa Aktar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <CardTitle>Kasa Hareketleri</CardTitle>
          <CardDescription>
            Tüm gelir ve gider kayıtları ({filteredEntries.length} kayıt)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Yükleniyor...</div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterType !== 'all' ? 'Kayıt bulunamadı' : 'Henüz kasa hareketi yok'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterType !== 'all'
                  ? 'Arama kriterlerinize uygun kayıt bulunamadı'
                  : 'İlk kasa hareketinizi oluşturmak için aşağıdaki butona tıklayın'}
              </p>
              {!searchTerm && filterType === 'all' && (
                <Button asChild>
                  <Link href={routes.kasa.new()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Kayıt Oluştur
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                  onClick={() => window.location.href = routes.kasa.view(entry.id)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      entry.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {entry.type === 'income' ? (
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{entry.summary}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDateTR(entry.date)}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          {entry.method === 'cash' ? 'Nakit' : 
                           entry.method === 'card' ? 'Kart' : 'Havale'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`text-xl font-bold ${
                        entry.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {entry.type === 'expense' ? '-' : '+'}{formatCurrencyTR(entry.amount)}
                      </p>
                      <Badge variant={entry.type === 'income' ? 'default' : 'destructive'}>
                        {entry.type === 'income' ? 'Gelir' : 'Gider'}
                      </Badge>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link href={routes.kasa.view(entry.id)}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link href={routes.kasa.edit(entry.id)}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-2">
            Çift Taraflı Kayıt Sistemi (Double-Entry Bookkeeping)
          </h4>
          <p className="text-blue-800 text-sm">
            Bu sistem, her işlemi iki hesap arasında kaydeder. Örneğin müşteriden tahsilat 
            yapıldığında "Alacaklar" hesabından "Kasa" veya "Banka" hesabına transfer olur. 
            Bu sayede her zaman dengeli bir muhasebe tutulur.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

