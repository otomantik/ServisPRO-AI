"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Download, Eye, CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";
import { routes } from "@/lib/routes";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch("/api/services?limit=20");
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch (error) {
        console.error("Failed to load services:", error);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      completed: { 
        label: "Tamamlandı", 
        color: "bg-green-100 text-green-800",
        icon: CheckCircle
      },
      in_progress: { 
        label: "Devam Ediyor", 
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock
      },
      pending: { 
        label: "Bekliyor", 
        color: "bg-gray-100 text-gray-800",
        icon: AlertCircle
      },
      cancelled: { 
        label: "İptal", 
        color: "bg-red-100 text-red-800",
        icon: XCircle
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Servisler</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Tüm servis kayıtlarını yönetin ve takip edin
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Excel İndir
          </Button>
          <Link href={routes.services.new()}>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Servis
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Servis Listesi ({services.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Henüz servis kaydı bulunmamaktadır.</p>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[100px]">Servis No</TableHead>
                    <TableHead className="min-w-[150px]">Müşteri</TableHead>
                    <TableHead className="min-w-[150px] hidden sm:table-cell">Cihaz</TableHead>
                    <TableHead className="min-w-[120px]">Durum</TableHead>
                    <TableHead className="min-w-[100px]">Tutar</TableHead>
                    <TableHead className="min-w-[100px] hidden md:table-cell">Tarih</TableHead>
                    <TableHead className="text-right min-w-[80px]">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {services.map((service) => {
                  const statusInfo = getStatusBadge(service.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <TableRow key={service.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/dashboard/services/${service.id}`}>
                      <TableCell className="font-medium text-xs sm:text-sm text-gray-900">{service.serviceNo}</TableCell>
                      <TableCell className="min-w-0">
                        <div>
                          <div className="font-medium text-xs sm:text-sm text-gray-900 truncate">{service.customer?.name || "—"}</div>
                          <div className="text-xs text-gray-600 sm:hidden truncate">{service.deviceBrand}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell min-w-0">
                        <div>
                          <div className="font-medium text-xs sm:text-sm text-gray-900 truncate">{service.deviceBrand || "—"}</div>
                          <div className="text-xs text-gray-600 truncate">{service.deviceType || "—"}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusInfo.color} text-xs whitespace-nowrap`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          <span className="hidden sm:inline">{statusInfo.label}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-xs sm:text-sm whitespace-nowrap break-all">
                        {formatCurrency(service.totalCost)}
                      </TableCell>
                      <TableCell className="text-xs text-gray-600 hidden md:table-cell">
                        {formatDate(new Date(service.receivedDate))}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-xs text-gray-400">Detay</span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
