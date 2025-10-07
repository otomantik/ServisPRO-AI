"use client";

import { routes } from "@/lib/routes";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function DiagnosticsPage() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<Record<string, { status: string; time: number }>>({});

  const allRoutes = {
    "Dashboard": routes.dashboard(),
    "Customers": routes.customers.list(),
    "Customer New": routes.customers.new(),
    "Services": routes.services.list(),
    "Service New": routes.services.new(),
    "Cash": routes.cash(),
    "Cash New": routes.cashNew(),
    "Invoices": routes.invoices(),
    "Invoice New": routes.invoiceNew(),
    "AR": routes.ar(),
    "Recommendations": routes.recommendations(),
    "Analytics": routes.analytics(),
    "Health": routes.health(),
  };

  const testRoutes = async () => {
    setTesting(true);
    setResults({});
    const newResults: Record<string, { status: string; time: number }> = {};

    for (const [name, route] of Object.entries(allRoutes)) {
      const start = Date.now();
      try {
        const response = await fetch(route, { method: "GET" });
        const time = Date.now() - start;
        newResults[name] = {
          status: response.ok ? "ok" : `error (${response.status})`,
          time,
        };
      } catch (err: any) {
        const time = Date.now() - start;
        newResults[name] = {
          status: `error (${err.message})`,
          time,
        };
      }
      setResults({ ...newResults });
    }

    setTesting(false);
  };

  const okCount = Object.values(results).filter((r) => r.status === "ok").length;
  const totalCount = Object.keys(allRoutes).length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Diagnostics</h1>
        <p className="text-gray-600 mt-1">Route availability and performance testing</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Route Tests</CardTitle>
          <CardDescription>
            {Object.keys(results).length > 0 && (
              <span>
                {okCount}/{totalCount} routes responding ({Math.round((okCount / totalCount) * 100)}%)
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={testRoutes} disabled={testing} className="mb-4">
            {testing ? "Testing..." : "Run Tests"}
          </Button>

          <div className="space-y-2">
            {Object.entries(allRoutes).map(([name, route]) => {
              const result = results[name];
              const status = result?.status || "pending";
              const isOk = status === "ok";
              const isPending = !result;

              return (
                <div
                  key={name}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {isOk ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : isPending ? (
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <div className="font-medium">{name}</div>
                      <div className="text-sm text-gray-500">{route}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {result && (
                      <>
                        <Badge variant={isOk ? "default" : "destructive"}>{status}</Badge>
                        <span className="text-sm text-gray-500">{result.time}ms</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
