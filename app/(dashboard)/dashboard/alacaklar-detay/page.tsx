"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrencyTR, formatDateTR } from "@/lib/summary";
import { DollarSign, Users, TrendingUp, AlertTriangle, CheckCircle, Clock, Plus, User, Calendar } from "lucide-react";
import Link from "next/link";

interface Invoice {
  id: string;
  invoiceNo: string;
  customerName: string;
  total: number;
  paid: number;
  balance: number;
  status: 'draft' | 'open' | 'paid' | 'overdue' | 'void';
  issueDate: string;
  dueDate?: string;
}

export default function ARPage() {
  const [stats, setStats] = useState({ total: 0, customerCount: 0 });
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Load stats
        const statsRes = await fetch("/api/ar");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Load invoices
        const invoicesRes = await fetch("/api/alacaklar");
        if (invoicesRes.ok) {
          const invoicesData = await invoicesRes.json();
          setInvoices(invoicesData.invoices || []);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-600">Ödendi</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Vadesi Geçmiş</Badge>;
      case 'open':
        return <Badge variant="default">Açık</Badge>;
      case 'draft':
        return <Badge variant="outline">Taslak</Badge>;
      case 'void':
        return <Badge variant="outline">İptal</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alacaklar</h1>
          <p className="text-gray-600 mt-1">Müşteri alacakları ve borçlar</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/alacaklar/new">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Fatura
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Alacak</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrencyTR(stats.total)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borçlu Müşteri</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customerCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tahsilat Oranı</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">87%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alacak Listesi</CardTitle>
          <CardDescription>
            {invoices.length === 0 ? 'Henüz fatura kaydı yok' : `Toplam ${invoices.length} fatura`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Henüz fatura kaydı yok
              </h3>
              <p className="text-gray-600 mb-6">
                İlk faturanızı oluşturmak için aşağıdaki butona tıklayın
              </p>
              <Button asChild>
                <Link href="/dashboard/alacaklar/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Fatura Oluştur
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {invoices.slice(0, 10).map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      invoice.status === 'paid' ? 'bg-green-100' :
                      invoice.status === 'overdue' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      {invoice.status === 'paid' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : invoice.status === 'overdue' ? (
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      ) : (
                        <Clock className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{invoice.invoiceNo}</h4>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {invoice.customerName}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDateTR(invoice.issueDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrencyTR(invoice.total)}
                    </p>
                    {invoice.balance > 0 && invoice.status !== 'paid' && (
                      <p className="text-sm text-red-600 mt-1">
                        Kalan: {formatCurrencyTR(invoice.balance)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {invoices.length > 10 && (
                <div className="text-center pt-4">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/alacaklar">
                      Tüm Faturaları Göster ({invoices.length})
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

