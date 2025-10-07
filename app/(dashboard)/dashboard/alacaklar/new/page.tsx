"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  Save, 
  Loader2,
  FileText,
  User,
  Calendar,
  DollarSign
} from "lucide-react"
import Link from "next/link"
import { routes } from "@/lib/routes"

interface Customer {
  id: string
  name: string
  phone: string
}

export default function NewAlacaklarPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loadingCustomers, setLoadingCustomers] = useState(true)
  const [formData, setFormData] = useState({
    customerId: '',
    total: '',
    dueDate: '',
    note: '',
  })

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await fetch('/api/customers?limit=100')
        if (res.ok) {
          const data = await res.json()
          setCustomers(data.customers || data || [])
        }
      } catch (err) {
        console.error('Failed to load customers:', err)
      } finally {
        setLoadingCustomers(false)
      }
    }
    loadCustomers()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/alacaklar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const data = await res.json()
        alert(`Fatura başarıyla oluşturuldu: ${data.invoiceNo}`)
        router.push(routes.alacaklar.list())
      } else {
        const errorData = await res.json()
        setError(errorData.error || 'Fatura oluşturulurken bir hata oluştu')
      }
    } catch (err: any) {
      setError(err.message || 'Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }

  // Auto-calculate due date (30 days from now)
  useEffect(() => {
    if (!formData.dueDate) {
      const thirtyDaysLater = new Date()
      thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30)
      setFormData(prev => ({
        ...prev,
        dueDate: thirtyDaysLater.toISOString().split('T')[0]
      }))
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={routes.alacaklar.list()}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Yeni Fatura Oluştur</h1>
          <p className="text-gray-600 mt-1">
            Müşteriye fatura düzenleyin ve alacak kaydı oluşturun
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer & Amount */}
            <Card>
              <CardHeader>
                <CardTitle>Fatura Bilgileri</CardTitle>
                <CardDescription>
                  Müşteri ve tutar bilgileri
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerId">Müşteri *</Label>
                  {loadingCustomers ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Müşteriler yükleniyor...
                    </div>
                  ) : (
                    <select
                      id="customerId"
                      name="customerId"
                      value={formData.customerId}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    >
                      <option value="">Müşteri Seçin</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name} - {customer.phone}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="total">Toplam Tutar *</Label>
                    <Input
                      id="total"
                      name="total"
                      type="number"
                      step="0.01"
                      value={formData.total}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Vade Tarihi</Label>
                    <Input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-gray-600">
                      Varsayılan: 30 gün sonra
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Fatura Notu</Label>
                  <Textarea
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Fatura detayları, servis açıklaması..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Fatura Nasıl İşlenir?
                </h4>
                <div className="text-blue-800 text-sm space-y-2">
                  <p>
                    1. Fatura oluşturulduğunda otomatik olarak "Alacaklar" hesabına kaydedilir
                  </p>
                  <p>
                    2. Müşteri ödeme yaptığında, ödeme "Kasa" veya "Banka" hesabına aktarılır
                  </p>
                  <p>
                    3. Sistem, vadesi yaklaşan veya geçmiş faturaları otomatik tespit eder
                  </p>
                  <p>
                    4. Tüm işlemler çift taraflı kayıt sistemi ile muhasebeye kaydedilir
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>İşlemler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button type="submit" className="w-full" disabled={loading || loadingCustomers}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Fatura Oluştur
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" className="w-full" asChild>
                  <Link href={routes.alacaklar.list()}>
                    İptal
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Preview */}
            {formData.total && formData.customerId && (
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-900">Önizleme</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-700">Müşteri:</p>
                      <p className="font-medium">
                        {customers.find(c => c.id === formData.customerId)?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-700">Tutar:</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₺{parseFloat(formData.total).toLocaleString('tr-TR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-700">Vade:</p>
                      <p className="font-medium">{formData.dueDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Tips */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-sm">Hızlı İpuçları</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-xs text-gray-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>Fatura no otomatik oluşturulur (YYYY-001)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Calendar className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>Varsayılan vade 30 gündür</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <DollarSign className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>Tahsilat kasa hareketlerinden yapılır</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

