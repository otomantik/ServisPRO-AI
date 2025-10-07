"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Users,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { routes } from "@/lib/routes"
import { formatDate, formatCurrency } from "@/lib/utils"

function getCustomerTypeIcon(type: string) {
  return type === 'corporate' ? Building : User
}

function getCustomerTypeLabel(type: string) {
  return type === 'corporate' ? 'Kurumsal' : 'Bireysel'
}

function getCustomerTypeColor(type: string) {
  return type === 'corporate' 
    ? 'bg-blue-100 text-blue-800 border-blue-200' 
    : 'bg-green-100 text-green-800 border-green-200'
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await fetch('/api/customers?limit=100')
        if (res.ok) {
          const data = await res.json()
          setCustomers(data.customers || data)
        }
      } catch (error) {
        console.error('Failed to load customers:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCustomers()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Müşteriler</h1>
          <p className="text-gray-600 mt-1">
            Müşteri bilgilerini yönetin ve takip edin
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Dışa Aktar
          </Button>
          <Button size="sm" asChild>
            <Link href={routes.customers.new()}>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Müşteri
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Müşteri</p>
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bireysel</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter(c => c.type === 'individual').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Kurumsal</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter(c => c.type === 'corporate').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Müşteri adı, telefon veya e-posta ara..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtrele
              </Button>
              <Button variant="outline" size="sm">
                Sırala
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Müşteri Listesi</span>
            <Badge variant="outline">
              {customers.length} müşteri
            </Badge>
          </CardTitle>
          <CardDescription>
            Tüm müşteri kayıtları
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Henüz müşteri kaydı yok
              </h3>
              <p className="text-gray-600 mb-6">
                İlk müşterinizi eklemek için aşağıdaki butona tıklayın
              </p>
              <Button asChild>
                <Link href={routes.customers.new()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Müşteri Ekle
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Müşteri</TableHead>
                    <TableHead>İletişim</TableHead>
                    <TableHead>Adres</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Toplam Harcama</TableHead>
                    <TableHead>Kayıt Tarihi</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => {
                  const TypeIcon = getCustomerTypeIcon(customer.type)
                  const services = customer.services || []
                  const totalSpent = services.reduce((sum: number, service: any) => sum + (service.totalCost || 0), 0)
                  const completedServices = services.filter((s: any) => s.status === 'completed').length
                  
                  return (
                    <TableRow key={customer.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <TypeIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {customer.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {completedServices} servis tamamlandı
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            {customer.phone}
                          </div>
                          {customer.email && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="w-4 h-4 mr-2" />
                              {customer.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p>{customer.address}</p>
                            <p className="text-xs text-gray-500">
                              {customer.district} / {customer.city}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`${getCustomerTypeColor(customer.type)} border`}
                        >
                          <TypeIcon className="w-3 h-3 mr-1" />
                          {getCustomerTypeLabel(customer.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {customer.category?.name || 'Kategori Yok'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(totalSpent)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(customer.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={routes.customers.view(customer.id)}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={routes.customers.edit(customer.id)}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {customers.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            <span className="font-medium">1-{customers.length}</span> arası, toplam{" "}
            <span className="font-medium">{customers.length}</span> müşteri
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Önceki
            </Button>
            <Button variant="outline" size="sm">
              Sonraki
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}