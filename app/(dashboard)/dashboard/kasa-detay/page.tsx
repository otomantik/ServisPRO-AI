"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyTR, formatDateTR, paymentMethodLabels } from "@/lib/summary";
import { Plus, TrendingUp, TrendingDown, DollarSign, Filter } from "lucide-react";
import Link from "next/link";
import { routes } from "@/lib/routes";

export default function CashPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [stats, setStats] = useState({ balance: 0, income: 0, expense: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/cash");
        if (res.ok) {
          const data = await res.json();
          setEntries(data.entries || []);
          setStats(data.stats || { balance: 0, income: 0, expense: 0 });
        }
      } catch (error) {
        console.error("Failed to load cash data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kasa Hareketleri</h1>
          <p className="text-gray-600 mt-1">Nakit ve banka hareketleri</p>
        </div>
        <Link href={routes.cashNew()}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Hareket
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bakiye</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrencyTR(stats.balance)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrencyTR(stats.income)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Gider</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrencyTR(stats.expense)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Entries List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Son Hareketler</CardTitle>
              <CardDescription>{entries.length} hareket</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtrele
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {entries.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Henüz hareket bulunmamaktadır.</p>
            ) : (
              entries.map((entry) => (
                <Link
                  key={entry.id}
                  href={routes.cashView(entry.id)}
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{entry.cashNote?.summary || entry.note || "Hareket"}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {formatDateTR(new Date(entry.date))}
                        {entry.refType && (
                          <Badge variant="outline" className="ml-2">
                            {entry.refType}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${
                        entry.debit.isCashLike ? "text-green-600" : "text-red-600"
                      }`}>
                        {entry.debit.isCashLike ? "+" : "-"}{formatCurrencyTR(entry.amount)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

