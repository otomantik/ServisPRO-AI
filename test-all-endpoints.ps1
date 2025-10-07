# Tüm endpoint'leri test et
$baseUrl = "http://localhost:5000"

$endpoints = @(
    # Ana Sayfalar
    @{ Path = "/"; Name = "Ana Sayfa" },
    @{ Path = "/dashboard"; Name = "Dashboard" },
    
    # API Endpoints
    @{ Path = "/api/dashboard"; Name = "Dashboard API" },
    @{ Path = "/api/services"; Name = "Servisler API" },
    @{ Path = "/api/customers"; Name = "Müşteriler API" },
    @{ Path = "/api/stocks"; Name = "Stoklar API" },
    @{ Path = "/api/kasa"; Name = "Kasa API" },
    @{ Path = "/api/alacaklar"; Name = "Faturalar API" },
    @{ Path = "/api/invoices"; Name = "Invoices API" },
    @{ Path = "/api/ar"; Name = "AR API" },
    @{ Path = "/api/cash"; Name = "Cash API" },
    @{ Path = "/api/categories"; Name = "Kategoriler API" },
    @{ Path = "/api/staff"; Name = "Personel API" },
    
    # Dashboard Sayfaları
    @{ Path = "/dashboard/services"; Name = "Servisler Sayfası" },
    @{ Path = "/dashboard/customers"; Name = "Müşteriler Sayfası" },
    @{ Path = "/dashboard/kasa"; Name = "Kasa Sayfası" },
    @{ Path = "/dashboard/alacaklar"; Name = "Faturalar Sayfası" },
    @{ Path = "/dashboard/stock"; Name = "Stok Sayfası" },
    @{ Path = "/dashboard/staff"; Name = "Personel Sayfası" },
    @{ Path = "/dashboard/categories"; Name = "Kategoriler Sayfası" },
    @{ Path = "/dashboard/analytics"; Name = "Analitik Sayfası" },
    @{ Path = "/dashboard/maintenance"; Name = "Periyodik Bakım" },
    @{ Path = "/dashboard/settings"; Name = "Ayarlar" },
    
    # New Pages
    @{ Path = "/dashboard/services/new"; Name = "Yeni Servis" },
    @{ Path = "/dashboard/customers/new"; Name = "Yeni Müşteri" },
    @{ Path = "/dashboard/kasa/new"; Name = "Yeni Kasa Girişi" },
    @{ Path = "/dashboard/alacaklar/new"; Name = "Yeni Fatura" },
    @{ Path = "/dashboard/stock/new"; Name = "Yeni Stok" },
    @{ Path = "/dashboard/staff/new"; Name = "Yeni Personel" }
)

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "SİSTEM KONTROLÜ BAŞLIYOR" -ForegroundColor Cyan
Write-Host "==================================`n" -ForegroundColor Cyan

$successCount = 0
$failCount = 0
$results = @()

foreach ($endpoint in $endpoints) {
    $url = "$baseUrl$($endpoint.Path)"
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        $status = "✅ OK"
        $statusCode = $response.StatusCode
        $successCount++
        Write-Host "[$status] $($endpoint.Name) - $statusCode" -ForegroundColor Green
    } catch {
        $status = "❌ FAIL"
        $errorMsg = $_.Exception.Message
        if ($errorMsg -like "*404*") {
            $statusCode = "404 Not Found"
        } elseif ($errorMsg -like "*500*") {
            $statusCode = "500 Server Error"
        } else {
            $statusCode = "Error"
        }
        $failCount++
        Write-Host "[$status] $($endpoint.Name) - $statusCode" -ForegroundColor Red
    }
    
    $results += [PSCustomObject]@{
        Name = $endpoint.Name
        Path = $endpoint.Path
        Status = $status
        StatusCode = $statusCode
    }
    
    Start-Sleep -Milliseconds 200
}

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "ÖZET" -ForegroundColor Cyan
Write-Host "==================================`n" -ForegroundColor Cyan
Write-Host "Toplam Test: $($endpoints.Count)" -ForegroundColor White
Write-Host "Başarılı: $successCount" -ForegroundColor Green
Write-Host "Başarısız: $failCount" -ForegroundColor Red
Write-Host "Başarı Oranı: $([math]::Round(($successCount / $endpoints.Count) * 100, 2))%" -ForegroundColor Yellow

if ($failCount -gt 0) {
    Write-Host "`n==================================" -ForegroundColor Red
    Write-Host "BAŞARISIZ ENDPOINT'LER" -ForegroundColor Red
    Write-Host "==================================`n" -ForegroundColor Red
    
    $results | Where-Object { $_.Status -eq "❌ FAIL" } | ForEach-Object {
        Write-Host "• $($_.Name) : $($_.Path)" -ForegroundColor Red
    }
}

Write-Host "`n"

