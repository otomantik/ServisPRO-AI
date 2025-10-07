"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Search, Filter } from "lucide-react"
import Link from "next/link"
import { routes } from "@/lib/routes"

export default function MaintenancePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Periyodik Bakım</h1>
          <p className="text-gray-600 mt-1">
            Düzenli bakım kayıtlarını yönetin ve takip edin
          </p>
        </div>
        <Button asChild>
          <Link href={routes.maintenance.new()}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Bakım Kaydı
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Müşteri adı, cihaz modeli veya seri no ile arayın..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtrele
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Cihaz</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">0</div>
            <p className="text-xs text-gray-600 mt-1">Kayıtlı cihaz</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bu Ay Bakım</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">0</div>
            <p className="text-xs text-gray-600 mt-1">Yapılan bakım</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen Bakım</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">0</div>
            <p className="text-xs text-gray-600 mt-1">Yaklaşan tarih</p>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance List */}
      <Card>
        <CardHeader>
          <CardTitle>Periyodik Bakım Kayıtları</CardTitle>
          <CardDescription>
            Tüm cihazların bakım geçmişi ve planları
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Henüz bakım kaydı yok
            </h3>
            <p className="text-gray-600 mb-6">
              İlk bakım kaydınızı oluşturmak için aşağıdaki butona tıklayın
            </p>
            <Button asChild>
              <Link href={routes.maintenance.new()}>
                <Plus className="w-4 h-4 mr-2" />
                Yeni Bakım Kaydı Oluştur
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-2">
            Periyodik Bakım Nedir?
          </h4>
          <p className="text-blue-800 text-sm">
            Periyodik bakım, cihazların düzenli aralıklarla kontrol edilmesi ve bakımının yapılmasını sağlar. 
            Bu sayede cihazların ömrü uzar ve olası arızalar önlenir. Sistem, bakım zamanı yaklaştığında 
            otomatik hatırlatmalar gönderir.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

