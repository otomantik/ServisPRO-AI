"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Edit, 
  Trash2,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  DollarSign,
  Loader2,
  FileText
} from "lucide-react"
import Link from "next/link"
import { routes } from "@/lib/routes"
import { formatCurrencyTR, formatDateTimeTR } from "@/lib/summary"

interface EntryDetails {
  id: string
  date: string
  amount: number
  summary: string
  type: 'income' | 'expense'
  method: 'cash' | 'card' | 'transfer'
  debitAccount: string
  creditAccount: string
  note?: string
  refType?: string
  refId?: string
  createdAt: string
}

export default function KasaEntryViewPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  // In client components, params is actually sync despite the type
  const params = paramsPromise as unknown as { id: string };
  const router = useRouter()
  const [entry, setEntry] = useState<EntryDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadEntry()
  }, [params.id])

  const loadEntry = async () => {
    try {
      const res = await fetch(`/api/kasa/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setEntry(data)
      } else {
        router.push(routes.kasa.list())
      }
    } catch (error) {
      console.error('Failed to load entry:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bu kaydı silmek istediğinizden emin misiniz?')) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/kasa/${params.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        router.push(routes.kasa.list())
      } else {
        alert('Silme işlemi başarısız')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Bağlantı hatası')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Kayıt bulunamadı</p>
        <Button asChild variant="outline">
          <Link href={routes.kasa.list()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Listeye Dön
          </Link>
        </Button>
      </div>
    )
  }

  const TypeIcon = entry.type === 'income' ? TrendingUp : TrendingDown

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={routes.kasa.list()}>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <TypeIcon className={`w-8 h-8 ${
                entry.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`} />
              {entry.summary}
            </h1>
            <p className="text-gray-600 mt-1">
              Kasa Hareketi Detayları
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={routes.kasa.edit(entry.id)}>
              <Edit className="w-4 h-4 mr-2" />
              Düzenle
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Sil
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Amount Card */}
          <Card className={`relative overflow-hidden ${
            entry.type === 'income' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
          }`}>
            <CardHeader>
              <CardTitle className={entry.type === 'income' ? 'text-green-900' : 'text-red-900'}>
                İşlem Tutarı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-5xl font-bold ${
                entry.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {entry.type === 'expense' ? '-' : '+'}{formatCurrencyTR(entry.amount)}
              </div>
              <p className="text-sm text-gray-700 mt-2">
                {entry.type === 'income' ? 'Gelir (Tahsilat)' : 'Gider (Ödeme)'}
              </p>
            </CardContent>
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-16 translate-x-16 opacity-20 ${
              entry.type === 'income' ? 'bg-green-300' : 'bg-red-300'
            }`}></div>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>İşlem Detayları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tarih</p>
                  <p className="font-medium flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4" />
                    {formatDateTimeTR(entry.date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ödeme Yöntemi</p>
                  <p className="font-medium flex items-center gap-2 mt-1">
                    <CreditCard className="w-4 h-4" />
                    {entry.method === 'cash' ? 'Nakit' :
                     entry.method === 'card' ? 'Kredi/Banka Kartı' : 'Havale/EFT'}
                  </p>
                </div>
              </div>

              {entry.note && (
                <div>
                  <p className="text-sm text-gray-600">Notlar</p>
                  <p className="font-medium mt-1">{entry.note}</p>
                </div>
              )}

              {entry.refType && (
                <div>
                  <p className="text-sm text-gray-600">Referans</p>
                  <p className="font-medium mt-1">
                    {entry.refType} {entry.refId && `#${entry.refId}`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Accounting Details */}
          <Card>
            <CardHeader>
              <CardTitle>Muhasebe Detayları</CardTitle>
              <CardDescription>
                Çift taraflı kayıt sistemi detayları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Borç (Debit)</p>
                  <p className="font-medium text-gray-900">{entry.debitAccount}</p>
                </div>
                <div className="flex justify-center">
                  <div className="w-px h-8 bg-gray-300"></div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Alacak (Credit)</p>
                  <p className="font-medium text-gray-900">{entry.creditAccount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hızlı İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={routes.kasa.edit(entry.id)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Düzenle
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Fiş Oluştur (PDF)
              </Button>
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Sil
              </Button>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Kayıt Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-gray-600">Kayıt ID</p>
                <p className="font-mono text-xs text-gray-900 mt-1">{entry.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Oluşturulma</p>
                <p className="font-medium text-gray-900 mt-1">
                  {formatDateTimeTR(entry.createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

