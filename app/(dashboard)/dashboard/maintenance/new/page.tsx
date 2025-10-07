"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, Save } from "lucide-react"
import Link from "next/link"
import { routes } from "@/lib/routes"

export default function NewMaintenancePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    deviceName: "",
    deviceBrand: "",
    deviceModel: "",
    serialNo: "",
    customerName: "",
    customerPhone: "",
    maintenanceInterval: "30",
    lastMaintenanceDate: "",
    nextMaintenanceDate: "",
    notes: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // API call will be implemented later
      console.log("Form data:", formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert("Bakım kaydı başarıyla oluşturuldu!")
      router.push(routes.maintenance.list())
    } catch (error) {
      console.error("Error:", error)
      alert("Bir hata oluştu!")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={routes.maintenance.list()}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Yeni Bakım Kaydı</h1>
          <p className="text-gray-600 mt-1">
            Periyodik bakım için yeni cihaz kaydı oluşturun
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Device Information */}
            <Card>
              <CardHeader>
                <CardTitle>Cihaz Bilgileri</CardTitle>
                <CardDescription>
                  Bakımı yapılacak cihazın detay bilgilerini girin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deviceName">Cihaz Adı *</Label>
                    <Input
                      id="deviceName"
                      name="deviceName"
                      value={formData.deviceName}
                      onChange={handleChange}
                      placeholder="Örn: Klima"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deviceBrand">Marka *</Label>
                    <Input
                      id="deviceBrand"
                      name="deviceBrand"
                      value={formData.deviceBrand}
                      onChange={handleChange}
                      placeholder="Örn: Arçelik"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deviceModel">Model</Label>
                    <Input
                      id="deviceModel"
                      name="deviceModel"
                      value={formData.deviceModel}
                      onChange={handleChange}
                      placeholder="Örn: A-123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serialNo">Seri No</Label>
                    <Input
                      id="serialNo"
                      name="serialNo"
                      value={formData.serialNo}
                      onChange={handleChange}
                      placeholder="Örn: 123456789"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Müşteri Bilgileri</CardTitle>
                <CardDescription>
                  Cihaz sahibinin iletişim bilgileri
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Müşteri Adı *</Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="Ad Soyad"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Telefon *</Label>
                    <Input
                      id="customerPhone"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      placeholder="(555) 555-5555"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Bakım Planı</CardTitle>
                <CardDescription>
                  Bakım periyodu ve tarihleri
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="maintenanceInterval">Bakım Aralığı (Gün) *</Label>
                  <Input
                    id="maintenanceInterval"
                    name="maintenanceInterval"
                    type="number"
                    value={formData.maintenanceInterval}
                    onChange={handleChange}
                    placeholder="30"
                    required
                  />
                  <p className="text-sm text-gray-600">
                    Her kaç günde bir bakım yapılacağını belirtin
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastMaintenanceDate">Son Bakım Tarihi</Label>
                    <Input
                      id="lastMaintenanceDate"
                      name="lastMaintenanceDate"
                      type="date"
                      value={formData.lastMaintenanceDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nextMaintenanceDate">Sonraki Bakım Tarihi</Label>
                    <Input
                      id="nextMaintenanceDate"
                      name="nextMaintenanceDate"
                      type="date"
                      value={formData.nextMaintenanceDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notlar</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Bakım ile ilgili özel notlar..."
                    rows={4}
                  />
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
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Kaydediliyor..." : "Kaydet"}
                </Button>
                <Button type="button" variant="outline" className="w-full" asChild>
                  <Link href={routes.maintenance.list()}>
                    İptal
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Bilgi</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start">
                    <Calendar className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Sistem, bakım zamanı yaklaştığında otomatik hatırlatma gönderir</span>
                  </li>
                  <li className="flex items-start">
                    <Calendar className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Bakım geçmişi ve raporları takip edebilirsiniz</span>
                  </li>
                  <li className="flex items-start">
                    <Calendar className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Müşteri bilgileri güvenli şekilde saklanır</span>
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

