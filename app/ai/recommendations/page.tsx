"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, AlertCircle, Clock } from "lucide-react";

export default function RecommendationsPage() {
  const recommendations = [
    {
      id: "1",
      kind: "cost_save",
      title: "Kart Komisyon Tasarrufu",
      detail: "Son 30 günde ₺1,250 kart komisyonu ödediniz. Sık ödeme yapan müşterilere EFT önerisi ile ₺450 tasarruf sağlayabilirsiniz.",
      estValue: 450,
      confidence: 0.85,
    },
    {
      id: "2",
      kind: "collection",
      title: "7 Gün İçinde Vadesi Dolacak Faturalar",
      detail: "5 fatura 7 gün içinde vadesi dolacak. Toplam ₺12,450. Erken ödeme için %2 indirim uygulayabilirsiniz.",
      estValue: 12450,
      confidence: 0.92,
    },
    {
      id: "3",
      kind: "upsell",
      title: "Yıllık Bakım Paketi Fırsatı",
      detail: "Premium müşterilerinize yıllık bakım paketi önerisi yaparak ₺8,500 ek gelir elde edebilirsiniz.",
      estValue: 8500,
      confidence: 0.78,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Öneriler</h1>
        <p className="text-gray-600 mt-1">İş geliştirme ve optimizasyon önerileri</p>
      </div>

      <div className="grid gap-4">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="hover:shadow-lg transition">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-yellow-500 mt-1" />
                  <div>
                    <CardTitle>{rec.title}</CardTitle>
                    <CardDescription className="mt-2">{rec.detail}</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary">
                  {Math.round(rec.confidence * 100)}% güven
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-lg font-semibold text-green-600">
                    ₺{rec.estValue.toLocaleString("tr-TR")}
                  </span>
                  <span className="text-sm text-gray-600">potansiyel kazanç</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Clock className="w-4 h-4 mr-2" />
                    Daha Sonra Hatırlat
                  </Button>
                  <Button size="sm">
                    Uygula
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="font-medium text-blue-900">AI Öneriler Hakkında</p>
              <p className="text-sm text-blue-700 mt-1">
                Bu öneriler geçmiş verileriniz analiz edilerek oluşturulmuştur. Her öneri, güven skoru ve tahmini etki ile birlikte sunulmaktadır.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

