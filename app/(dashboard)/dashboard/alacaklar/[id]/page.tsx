"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  User,
  Calendar,
  DollarSign,
  CreditCard,
  Phone,
  Mail,
  MapPin
} from "lucide-react"
import Link from "next/link"
import { formatCurrencyTR, formatDateTR } from "@/lib/summary"

interface InvoiceDetail {
  id: string
  invoiceNo: string
  customer: {
    id: string
    name: string
    phone?: string
    email?: string
    address?: string
    city?: string
    district?: string
  }
  issueDate: string
  dueDate?: string
  subtotal: number
  vatRate: number
  discount: number
  total: number
  status: 'draft' | 'open' | 'paid' | 'overdue' | 'void'
  payments: Array<{
    id: string
    amount: number
    method: string
    createdAt: string
  }>
  note?: string
}

export default function FaturaDetayPage() {
  const params = useParams()
  const router = useRouter()
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInvoice()
  }, [params.id])

  const loadInvoice = async () => {
    try {
      const res = await fetch(`/api/invoices?id=${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setInvoice(data)
      } else {
        console.error('Fatura yüklenemedi')
      }
    } catch (error) {
      console.error('Fatura yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Ödendi</Badge>
      case 'overdue':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" /> Vadesi Geçmiş</Badge>
      case 'open':
        return <Badge variant="default"><Clock className="w-3 h-3 mr-1" /> Açık</Badge>
      case 'draft':
        return <Badge variant="outline"><FileText className="w-3 h-3 mr-1" /> Taslak</Badge>
      case 'void':
        return <Badge variant="outline">İptal</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash': return 'Nakit'
      case 'card': return 'Kredi Kartı'
      case 'transfer': return 'Havale/EFT'
      default: return method
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Fatura Bulunamadı</h2>
          <p className="text-gray-600 mb-6">Bu fatura mevcut değil veya silinmiş olabilir.</p>
          <Button asChild>
            <Link href="/dashboard/alacaklar">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Faturalara Dön
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0)
  const balance = invoice.total - totalPaid

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/alacaklar">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fatura Detayı</h1>
            <p className="text-gray-600 mt-1">Fatura No: {invoice.invoiceNo}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(invoice.status)}
          <Button variant="outline" size="icon">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle>Fatura Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Fatura No</p>
                  <p className="font-semibold">{invoice.invoiceNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Durum</p>
                  <div>{getStatusBadge(invoice.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Düzenleme Tarihi
                  </p>
                  <p className="font-semibold">{formatDateTR(invoice.issueDate)}</p>
                </div>
                {invoice.dueDate && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Vade Tarihi
                    </p>
                    <p className="font-semibold">{formatDateTR(invoice.dueDate)}</p>
                  </div>
                )}
              </div>

              {invoice.note && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-1">Not</p>
                  <p className="text-gray-900">{invoice.note}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Tutar Bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span className="font-semibold">{formatCurrencyTR(invoice.subtotal)}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>İndirim</span>
                    <span className="font-semibold">- {formatCurrencyTR(invoice.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">KDV (%{invoice.vatRate})</span>
                  <span className="font-semibold">
                    {formatCurrencyTR((invoice.subtotal - invoice.discount) * (invoice.vatRate / 100))}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
                  <span className="text-lg font-bold">Toplam</span>
                  <span className="text-2xl font-bold text-blue-600">{formatCurrencyTR(invoice.total)}</span>
                </div>
                {totalPaid > 0 && (
                  <>
                    <div className="flex justify-between items-center text-green-600">
                      <span>Ödenen</span>
                      <span className="font-semibold">{formatCurrencyTR(totalPaid)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Kalan</span>
                      <span className={`text-xl font-bold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrencyTR(balance)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payments */}
          {invoice.payments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Ödeme Geçmişi</CardTitle>
                <CardDescription>{invoice.payments.length} ödeme kaydı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invoice.payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{getPaymentMethodLabel(payment.method)}</p>
                          <p className="text-sm text-gray-600">{formatDateTR(payment.createdAt)}</p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-green-600">{formatCurrencyTR(payment.amount)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Müşteri Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ad Soyad / Firma</p>
                <p className="font-semibold">{invoice.customer.name}</p>
              </div>
              {invoice.customer.phone && (
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Telefon
                  </p>
                  <p className="font-medium">{invoice.customer.phone}</p>
                </div>
              )}
              {invoice.customer.email && (
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> E-posta
                  </p>
                  <p className="font-medium">{invoice.customer.email}</p>
                </div>
              )}
              {invoice.customer.address && (
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Adres
                  </p>
                  <p className="text-sm">
                    {invoice.customer.address}
                    {invoice.customer.district && `, ${invoice.customer.district}`}
                    {invoice.customer.city && `, ${invoice.customer.city}`}
                  </p>
                </div>
              )}
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/dashboard/customers/${invoice.customer.id}`}>
                  Müşteri Detayı
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hızlı İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="default">
                <DollarSign className="w-4 h-4 mr-2" />
                Ödeme Al
              </Button>
              <Button className="w-full" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                PDF İndir
              </Button>
              <Button className="w-full" variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Düzenle
              </Button>
              <Button className="w-full" variant="destructive" disabled>
                <Trash2 className="w-4 h-4 mr-2" />
                Sil
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

