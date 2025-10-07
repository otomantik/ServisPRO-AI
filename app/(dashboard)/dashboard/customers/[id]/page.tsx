import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  ArrowLeft, 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  DollarSign,
  Wrench,
  User,
  Building
} from "lucide-react"
import Link from "next/link"
import { routes } from "@/lib/routes"
import { prisma } from "@/lib/prisma"
import { formatDate, formatCurrency } from "@/lib/utils"

async function getCustomer(id: string) {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      category: true,
      services: {
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          technician: true
        }
      }
    },
  })

  if (!customer) return null

  // Calculate stats
  const totalSpent = customer.services.reduce((sum, s) => sum + Number(s.totalCost), 0)
  const completedServices = customer.services.filter(s => s.status === 'completed').length
  const activeServices = customer.services.filter(s => s.status !== 'completed' && s.status !== 'cancelled').length

  return { customer, stats: { totalSpent, completedServices, activeServices } }
}

export default async function CustomerViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getCustomer(id)

  if (!data) {
    notFound()
  }

  const { customer, stats } = data
  const TypeIcon = customer.type === 'corporate' ? Building : User

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={routes.customers.list()}>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <TypeIcon className="w-8 h-8 text-gray-600" />
              {customer.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Müşteri Detayları
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={routes.customers.edit(customer.id)}>
            <Edit className="w-4 h-4 mr-2" />
            Düzenle
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Harcama</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalSpent)}
            </div>
            <p className="text-xs text-gray-600 mt-1">{customer.services.length} servis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tamamlanan</CardTitle>
            <Wrench className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.completedServices}
            </div>
            <p className="text-xs text-gray-600 mt-1">Başarıyla tamamlandı</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Servisler</CardTitle>
            <Wrench className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.activeServices}
            </div>
            <p className="text-xs text-gray-600 mt-1">Devam eden</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>İletişim Bilgileri</CardTitle>
              <CardDescription>Müşteri iletişim detayları</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {customer.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Telefon</p>
                    <p className="font-medium">{customer.phone}</p>
                  </div>
                </div>
              )}
              {customer.phone2 && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Telefon 2</p>
                    <p className="font-medium">{customer.phone2}</p>
                  </div>
                </div>
              )}
              {customer.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">E-posta</p>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                </div>
              )}
              {(customer.address || customer.city || customer.district) && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Adres</p>
                    <p className="font-medium">
                      {customer.address}
                      {customer.district && `, ${customer.district}`}
                      {customer.city && `, ${customer.city}`}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Services */}
          <Card>
            <CardHeader>
              <CardTitle>Son Servisler</CardTitle>
              <CardDescription>
                Bu müşteriye ait son servis kayıtları
              </CardDescription>
            </CardHeader>
            <CardContent>
              {customer.services.length > 0 ? (
                <div className="relative overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Servis No</TableHead>
                        <TableHead>Cihaz</TableHead>
                        <TableHead>Teknisyen</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead>Tarih</TableHead>
                        <TableHead className="text-right">Tutar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customer.services.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell className="font-medium">
                            <Link 
                              href={routes.services.view(service.id)}
                              className="text-blue-600 hover:underline"
                            >
                              {service.serviceNo}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {service.deviceBrand} {service.deviceType}
                          </TableCell>
                          <TableCell>{service.technician?.name || "-"}</TableCell>
                          <TableCell>
                            <Badge variant={
                              service.status === 'completed' ? 'success' :
                              service.status === 'cancelled' ? 'destructive' : 'default'
                            }>
                              {service.status === 'completed' ? 'Tamamlandı' :
                               service.status === 'cancelled' ? 'İptal' : 'Devam Ediyor'}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(service.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(Number(service.totalCost))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Henüz servis kaydı bulunmuyor
                </div>
              )}
              {customer.services.length > 0 && (
                <div className="mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`${routes.services.list()}?customer=${customer.id}`}>
                      Tüm Servisleri Görüntüle
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Detaylar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Tür</p>
                <p className="font-medium flex items-center gap-2 mt-1">
                  <TypeIcon className="w-4 h-4" />
                  {customer.type === 'corporate' ? 'Kurumsal' : 'Bireysel'}
                </p>
              </div>
              {customer.category && (
                <div>
                  <p className="text-sm text-gray-600">Kategori</p>
                  <Badge variant="outline" className="mt-1">
                    {customer.category.name}
                  </Badge>
                </div>
              )}
              {customer.type === 'corporate' && customer.taxNo && (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Vergi No</p>
                    <p className="font-medium mt-1">{customer.taxNo}</p>
                  </div>
                  {customer.taxOffice && (
                    <div>
                      <p className="text-sm text-gray-600">Vergi Dairesi</p>
                      <p className="font-medium mt-1">{customer.taxOffice}</p>
                    </div>
                  )}
                </>
              )}
              <div>
                <p className="text-sm text-gray-600">Kayıt Tarihi</p>
                <p className="font-medium flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(customer.createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hızlı İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`${routes.services.new()}?customer=${customer.id}`}>
                  <Wrench className="w-4 h-4 mr-2" />
                  Yeni Servis Oluştur
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={routes.customers.edit(customer.id)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Bilgileri Düzenle
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
