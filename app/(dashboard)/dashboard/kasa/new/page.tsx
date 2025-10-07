"use client"

import { useState } from "react"
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
  DollarSign,
  TrendingUp,
  TrendingDown,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import { routes } from "@/lib/routes"
import { expenseCategories, suggestExpenseDescription } from "@/lib/summary"

export default function NewKasaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    method: 'cash' as 'cash' | 'card' | 'transfer',
    category: 'maaş',
    customerName: '',
    invoiceNo: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSuggestDescription = () => {
    if (formData.type === 'expense' && formData.amount) {
      const amount = parseFloat(formData.amount)
      if (!isNaN(amount)) {
        const suggestion = suggestExpenseDescription(formData.category)
        setFormData(prev => ({ ...prev, description: suggestion }))
      }
    } else if (formData.type === 'income' && formData.customerName) {
      const suggestion = formData.invoiceNo
        ? `Müşteri tahsilatı – ${formData.customerName} (Fatura ${formData.invoiceNo})`
        : `Müşteri tahsilatı – ${formData.customerName}`
      setFormData(prev => ({ ...prev, description: suggestion }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/kasa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const data = await res.json()
        router.push(routes.kasa.view(data.id))
      } else {
        const errorData = await res.json()
        setError(errorData.error || 'Kayıt oluşturulurken bir hata oluştu')
      }
    } catch (err: any) {
      setError(err.message || 'Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={routes.kasa.list()}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Yeni Kasa Hareketi</h1>
          <p className="text-gray-600 mt-1">
            Gelir veya gider kaydı oluşturun
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
            {/* Transaction Type */}
            <Card>
              <CardHeader>
                <CardTitle>İşlem Türü</CardTitle>
                <CardDescription>
                  Gelir mi gider mi seçin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                    className={`p-6 border-2 rounded-lg transition-all ${
                      formData.type === 'income'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <TrendingUp className={`w-8 h-8 mx-auto mb-2 ${
                      formData.type === 'income' ? 'text-green-600' : 'text-gray-400'
                    }`} />
                    <p className={`font-semibold ${
                      formData.type === 'income' ? 'text-green-900' : 'text-gray-700'
                    }`}>
                      Gelir (Tahsilat)
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Müşteri ödemesi, satış geliri
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                    className={`p-6 border-2 rounded-lg transition-all ${
                      formData.type === 'expense'
                        ? 'border-red-600 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <TrendingDown className={`w-8 h-8 mx-auto mb-2 ${
                      formData.type === 'expense' ? 'text-red-600' : 'text-gray-400'
                    }`} />
                    <p className={`font-semibold ${
                      formData.type === 'expense' ? 'text-red-900' : 'text-gray-700'
                    }`}>
                      Gider (Ödeme)
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Maaş, yakıt, kira, malzeme
                    </p>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Details */}
            <Card>
              <CardHeader>
                <CardTitle>İşlem Detayları</CardTitle>
                <CardDescription>
                  Tutar ve ödeme bilgileri
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Tutar *</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Tarih *</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="method">Ödeme Yöntemi *</Label>
                  <select
                    id="method"
                    name="method"
                    value={formData.method}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="cash">Nakit</option>
                    <option value="card">Kredi/Banka Kartı</option>
                    <option value="transfer">Havale/EFT</option>
                  </select>
                </div>

                {formData.type === 'expense' && (
                  <div className="space-y-2">
                    <Label htmlFor="category">Gider Kategorisi *</Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {Object.entries(expenseCategories).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.type === 'income' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Müşteri Adı</Label>
                      <Input
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        placeholder="Müşteri adı..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invoiceNo">Fatura No</Label>
                      <Input
                        id="invoiceNo"
                        name="invoiceNo"
                        value={formData.invoiceNo}
                        onChange={handleChange}
                        placeholder="2025-001"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description">Açıklama</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleSuggestDescription}
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Öneri
                    </Button>
                  </div>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="İşlem açıklaması..."
                    rows={3}
                  />
                  <p className="text-xs text-gray-600">
                    AI öneri butonuna tıklayarak otomatik açıklama oluşturabilirsiniz
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Kaydet
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" className="w-full" asChild>
                  <Link href={routes.kasa.list()}>
                    İptal
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Preview */}
            {formData.amount && (
              <Card className={
                formData.type === 'income' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }>
                <CardHeader>
                  <CardTitle className={
                    formData.type === 'income' ? 'text-green-900' : 'text-red-900'
                  }>
                    Önizleme
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Tür:</span>
                      <span className="font-medium">
                        {formData.type === 'income' ? 'Gelir' : 'Gider'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Tutar:</span>
                      <span className={`font-bold ${
                        formData.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formData.type === 'expense' ? '-' : '+'}₺{parseFloat(formData.amount).toLocaleString('tr-TR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Yöntem:</span>
                      <span className="font-medium">
                        {formData.method === 'cash' ? 'Nakit' :
                         formData.method === 'card' ? 'Kart' : 'Havale'}
                      </span>
                    </div>
                    {formData.type === 'expense' && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">Kategori:</span>
                        <span className="font-medium">
                          {expenseCategories[formData.category as keyof typeof expenseCategories]}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900 text-sm">Bilgi</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-xs text-blue-800 space-y-2">
                  <li>• Gelir: Müşteri tahsilatları ve diğer gelirler</li>
                  <li>• Gider: Maaş, yakıt, kira ve diğer ödemeler</li>
                  <li>• Her kayıt otomatik olarak çift taraflı sisteme işlenir</li>
                  <li>• AI öneri ile otomatik açıklama oluşturabilirsiniz</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

