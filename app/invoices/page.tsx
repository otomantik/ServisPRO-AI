"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyTR, formatDateTR, invoiceStatusLabels, getInvoiceStatusColor } from "@/lib/summary";
import { Plus, FileText } from "lucide-react";
import Link from "next/link";
import { routes } from "@/lib/routes";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvoices() {
      try {
        const res = await fetch("/api/invoices");
        if (res.ok) {
          const data = await res.json();
          setInvoices(data);
        }
      } catch (error) {
        console.error("Failed to load invoices:", error);
      } finally {
        setLoading(false);
      }
    }
    loadInvoices();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Faturalar</h1>
          <p className="text-gray-600 mt-1">{invoices.length} fatura</p>
        </div>
        <Link href={routes.invoiceNew()}>
          <Button><Plus className="w-4 h-4 mr-2" />Yeni Fatura</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {invoices.map((invoice) => (
          <Card key={invoice.id} className="hover:shadow-md transition">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-semibold text-lg">{invoice.invoiceNo}</div>
                      <div className="text-sm text-gray-600">{invoice.customer.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDateTR(new Date(invoice.issueDate))}
                        {invoice.dueDate && ` • Vade: ${formatDateTR(new Date(invoice.dueDate))}`}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{formatCurrencyTR(invoice.total)}</div>
                  <Badge
                    variant={invoice.status === "paid" ? "default" : invoice.status === "overdue" ? "destructive" : "secondary"}
                    className="mt-2"
                  >
                    {invoiceStatusLabels[invoice.status] || invoice.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

