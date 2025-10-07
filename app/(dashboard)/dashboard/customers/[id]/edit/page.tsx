"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  Save, 
  Loader2
} from "lucide-react"
import Link from "next/link"
import { routes } from "@/lib/routes"

interface Category {
  id: string
  name: string
  type: string
}

interface Customer {
  id: string
  name: string
  phone: string | null
  phone2: string | null
  email: string | null
  address: string | null
  city: string | null
  district: string | null
  type: string
  categoryId: string | null
  taxNo: string | null
  taxOffice: string | null
  isSupplier: boolean
}

export default function EditCustomerPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    phone2: "",
    email: "",
    address: "",
    city: "",
    district: "",
    type: "individual",
    categoryId: "",
    taxNo: "",
    taxOffice: "",
    isSupplier: false
  })

  useEffect(() => {
    async function loadData() {
      try {
        // Load customer
        const customerRes = await fetch(`/api/customers/${params.id}`)
        if (customerRes.ok) {
          const customerData = await customerRes.json()
          setCustomer(customerData)
          setFormData({
            name: customerData.name || "",
            phone: customerData.phone || "",
            phone2: customerData.phone2 || "",
            email: customerData.email || "",
            address: customerData.address || "",
            city: customerData.city || "",
            district: customerData.district || "",
            type: customerData.type || "individual",
            categoryId: customerData.categoryId || "",
            taxNo: customerData.taxNo || "",
            taxOffice: customerData.taxOffice || "",
            isSupplier: customerData.isSupplier || false
          })
        } else {
          setError("Müşteri bulunamadı")
        }

        // Load categories
        const categoriesRes = await fetch("/api/categories")
        if (categoriesRes.ok) {
          const data = await categoriesRes.json()
          setCategories(data.filter((c: Category) => c.type === 'customer'))
        }
      } catch (err) {
        console.error("Failed to load data:", err)
        setError("Veri yüklenirken hata oluştu")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch(`/api/customers/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        router.push(routes.customers.view(params.id))
      } else {
        const errorData = await res.json()
        setError(errorData.error || "Müşteri güncellenirken bir hata oluştu.")
      }
    } catch (err: any) {
      setError(err.message || "Bağlantı hatası oluştu.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error && !customer) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" asChild>
          <Link href={routes.customers.list()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Müşteri Listesine Dön
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={routes.customers.view(params.id)}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Müşteri Düzenle</h1>
          <p className="text-gray-600 mt-1">
            {customer?.name} bilgilerini güncelleyin
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
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Temel Bilgiler</CardTitle>
                <CardDescription>
                  Müşterinin temel bilgileri
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ad Soyad / Firma Adı *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Örn: Ahmet Yılmaz veya ABC Teknoloji Ltd."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Müşteri Türü *</Label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="individual">Bireysel</option>
                    <option value="corporate">Kurumsal</option>
                  </select>
                </div>

                {categories.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Kategori</Label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Kategori Seçiniz</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.type === 'corporate' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="taxNo">Vergi No</Label>
                        <Input
                          id="taxNo"
                          name="taxNo"
                          value={formData.taxNo}
                          onChange={handleChange}
                          placeholder="1234567890"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taxOffice">Vergi Dairesi</Label>
                        <Input
                          id="taxOffice"
                          name="taxOffice"
                          value={formData.taxOffice}
                          onChange={handleChange}
                          placeholder="Örn: Kadıköy"
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>İletişim Bilgileri</CardTitle>
                <CardDescription>
                  Telefon, e-posta ve adres bilgileri
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(555) 555-5555"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone2">Telefon 2</Label>
                    <Input
                      id="phone2"
                      name="phone2"
                      type="tel"
                      value={formData.phone2}
                      onChange={handleChange}
                      placeholder="(555) 555-5555"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ornek@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adres</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Mahalle, Sokak, No"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="district">İlçe</Label>
                    <Input
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="Örn: Kadıköy"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">İl</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Örn: İstanbul"
                    />
                  </div>
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
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
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
                  <Link href={routes.customers.view(params.id)}>
                    İptal
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Options */}
            <Card>
              <CardHeader>
                <CardTitle>Seçenekler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isSupplier"
                    name="isSupplier"
                    checked={formData.isSupplier}
                    onChange={handleChange}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isSupplier" className="cursor-pointer">
                    Tedarikçi olarak işaretle
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
