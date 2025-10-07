"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  Save, 
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  UserCheck
} from "lucide-react"
import Link from "next/link"
import { routes } from "@/lib/routes"

interface Category {
  id: string
  name: string
  type: string
}

export default function NewCustomerPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
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
    isSupplier: false
  })

  // Load categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories")
        if (res.ok) {
          const data = await res.json()
          setCategories(data.filter((c: Category) => c.type === 'customer'))
        }
      } catch (err) {
        console.error("Failed to load categories:", err)
      }
    }
    loadCategories()
  }, [])

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
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        const customer = await res.json()
        router.push(routes.customers.view(customer.id))
      } else {
        const errorData = await res.json()
        setError(errorData.error || "Müşteri oluşturulurken bir hata oluştu.")
      }
    } catch (err: any) {
      setError(err.message || "Bağlantı hatası oluştu.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={routes.customers.list()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Yeni Müşteri</h1>
            <p className="text-gray-600">Yeni müşteri kaydı oluşturun</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={submitting}>
          <Save className="w-4 h-4 mr-2" />
          {submitting ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Temel Bilgiler
            </CardTitle>
            <CardDescription>
              Müşterinin temel iletişim bilgileri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Ad Soyad / Şirket Adı *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Örn: Ahmet Yılmaz veya ABC Şirketi"
                />
              </div>
              <div>
                <Label htmlFor="type">Müşteri Tipi *</Label>
                <Select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="individual">Bireysel</option>
                  <option value="corporate">Kurumsal</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Telefon *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="0555 123 45 67"
                />
              </div>
              <div>
                <Label htmlFor="phone2">Telefon 2</Label>
                <Input
                  id="phone2"
                  name="phone2"
                  value={formData.phone2}
                  onChange={handleChange}
                  placeholder="0555 987 65 43"
                />
              </div>
            </div>

            <div>
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
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Adres Bilgileri
            </CardTitle>
            <CardDescription>
              Müşterinin adres bilgileri (opsiyonel)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Adres</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Mahalle, sokak, bina no"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="district">İlçe</Label>
                <Input
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Örn: Kadıköy"
                />
              </div>
              <div>
                <Label htmlFor="city">Şehir</Label>
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

        {/* Category and Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Kategori ve Ayarlar
            </CardTitle>
            <CardDescription>
              Müşteri kategorisi ve özel ayarlar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="categoryId">Kategori</Label>
              <Select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
              >
                <option value="">Kategori Seçiniz</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isSupplier"
                name="isSupplier"
                checked={formData.isSupplier}
                onChange={handleChange}
                className="rounded"
              />
              <Label htmlFor="isSupplier">Bu müşteri aynı zamanda tedarikçi</Label>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}