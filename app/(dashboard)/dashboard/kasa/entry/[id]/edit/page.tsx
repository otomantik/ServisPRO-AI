"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, Loader2, Sparkles } from "lucide-react"
import Link from "next/link"
import { routes } from "@/lib/routes"
import { expenseCategories, suggestExpenseDescription } from "@/lib/summary"

export default function EditKasaEntryPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  // In client components, params is actually sync despite the type
  const params = paramsPromise as unknown as { id: string };
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    method: 'cash' as 'cash' | 'card' | 'transfer',
    category: 'maaş',
    customerName: '',
    invoiceNo: '',
    description: '',
    date: '',
  })

  useEffect(() => {
    loadEntry()
  }, [params.id])

  const loadEntry = async () => {
    try {
      const res = await fetch(`/api/kasa/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setFormData({
          type: data.type,
          amount: data.amount.toString(),
          method: data.method,
          category: data.category || 'maaş',
          customerName: data.customerName || '',
          invoiceNo: data.invoiceNo || '',
          description: data.summary || '',
          date: new Date(data.date).toISOString().split('T')[0],
        })
      } else {
        setError('Kayıt bulunamadı')
      }
    } catch (err) {
      setError('Veri yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

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
    setSaving(true)
    setError(null)

    try {
      const res = await fetch(`/api/kasa/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push(routes.kasa.view(params.id))
      } else {
        const errorData = await res.json()
        setError(errorData.error || 'Güncelleme başarısız')
      }
    } catch (err: any) {
      setError(err.message || 'Bağlantı hatası')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={routes.kasa.view(params.id)}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kasa Hareketi Düzenle</h1>
          <p className="text-gray-600 mt-1">
            Kayıt bilgilerini güncelleyin
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
            <Card>
              <CardHeader>
                <CardTitle>İşlem Bilgileri</CardTitle>
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
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="cash">Nakit</option>
                    <option value="card">Kredi/Banka Kartı</option>
                    <option value="transfer">Havale/EFT</option>
                  </select>
                </div>

                {formData.type === 'expense' && (
                  <div className="space-y-2">
                    <Label htmlFor="category">Gider Kategorisi</Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>İşlemler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Değişiklikleri Kaydet
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" className="w-full" asChild>
                  <Link href={routes.kasa.view(params.id)}>
                    İptal
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

