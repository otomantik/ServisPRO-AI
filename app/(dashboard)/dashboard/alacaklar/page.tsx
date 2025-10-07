"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Plus, 
  Search, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import { routes } from "@/lib/routes"
import { formatCurrencyTR, formatDateTR } from "@/lib/summary"

interface Invoice {
  id: string
  invoiceNo: string
  customerName: string
  total: number
  paid: number
  balance: number
  status: 'draft' | 'open' | 'paid' | 'overdue' | 'void'
  issueDate: string
  dueDate?: string
}

export default function FaturalarPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalReceivable: 0,
    overdueAmount: 0,
    paidThisMonth: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/alacaklar')
      if (res.ok) {
        const data = await res.json()
        setInvoices(data.invoices || [])
        setStats(data.stats || { totalReceivable: 0, overdueAmount: 0, paidThisMonth: 0 })
      }
    } catch (error) {
      console.error('Failed to load receivables:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-600">Ödendi</Badge>
      case 'overdue':
        return <Badge variant="destructive">Vadesi Geçmiş</Badge>
      case 'open':
        return <Badge variant="default">Açık</Badge>
      case 'draft':
        return <Badge variant="outline">Taslak</Badge>
      case 'void':
        return <Badge variant="outline">İptal</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fatura Yönetimi</h1>
          <p className="text-gray-600 mt-1">
            Faturalar ve müşteri tahsilatları
          </p>
        </div>
        <Button asChild>
          <Link href={routes.alacaklar.new()}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Fatura
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Alacak</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrencyTR(stats.totalReceivable)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Tahsil edilmemiş faturalar</p>
          </CardContent>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vadesi Geçmiş</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrencyTR(stats.overdueAmount)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Acil takip gerekli</p>
          </CardContent>
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bu Ay Tahsilat</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrencyTR(stats.paidThisMonth)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Başarıyla tahsil edildi</p>
          </CardContent>
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Fatura no veya müşteri adı ile arayın..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Invoice List */}
      <Card>
        <CardHeader>
          <CardTitle>Faturalar</CardTitle>
          <CardDescription>
            Tüm fatura ve tahsilat kayıtları ({filteredInvoices.length} kayıt)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Yükleniyor...</div>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Fatura bulunamadı' : 'Henüz fatura kaydı yok'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? 'Arama kriterlerinize uygun fatura bulunamadı'
                  : 'İlk faturanızı oluşturmak için aşağıdaki butona tıklayın'}
              </p>
              {!searchTerm && (
                <Button asChild>
                  <Link href={routes.alacaklar.new()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Fatura Oluştur
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => window.location.href = routes.alacaklar.view(invoice.id)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      invoice.status === 'paid' ? 'bg-green-100' :
                      invoice.status === 'overdue' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      {invoice.status === 'paid' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : invoice.status === 'overdue' ? (
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      ) : (
                        <Clock className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{invoice.invoiceNo}</h4>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {invoice.customerName}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDateTR(invoice.issueDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrencyTR(invoice.total)}
                    </p>
                    {invoice.balance > 0 && invoice.status !== 'paid' && (
                      <p className="text-sm text-red-600 mt-1">
                        Kalan: {formatCurrencyTR(invoice.balance)}
                      </p>
                    )}
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
            Alacaklar Nedir?
          </h4>
          <p className="text-blue-800 text-sm">
            Alacaklar, müşterilerinize kestiğiniz faturalardan henüz tahsil edilmemiş tutarlardır. 
            Bu sayfa ile hangi faturaların ödendiğini, hangilerinin vadesi geçtiğini takip edebilir 
            ve tahsilat işlemlerini yönetebilirsiniz.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

