Write-Host "`n=== SYSTEM CHECK - TESTING ALL ROUTES ===" -ForegroundColor Cyan

$routes = @(
    @{path="/healthz"; name="Health Check"},
    @{path="/"; name="Landing"},
    @{path="/login"; name="Login"},
    @{path="/dashboard"; name="Dashboard"},
    @{path="/dashboard/customers"; name="Customers"},
    @{path="/dashboard/customers/new"; name="New Customer"},
    @{path="/dashboard/services"; name="Services"},
    @{path="/dashboard/services/new"; name="New Service"},
    @{path="/dashboard/staff"; name="Staff"},
    @{path="/dashboard/maintenance"; name="Maintenance"},
    @{path="/dashboard/analytics"; name="Analytics"},
    @{path="/dashboard/stock"; name="Stock"},
    @{path="/dashboard/kasa-detay"; name="Kasa Detay"},
    @{path="/invoices"; name="Invoices"},
    @{path="/dashboard/alacaklar-detay"; name="Alacaklar Detay"},
    @{path="/ai/recommendations"; name="AI Recommendations"},
    @{path="/dev/diagnostics"; name="Diagnostics"}
)

$ok = 0
$fail = 0
$failed = @()

foreach ($route in $routes) {
    try {
        Invoke-WebRequest -Uri "http://localhost:5000$($route.path)" -UseBasicParsing -TimeoutSec 8 -ErrorAction Stop | Out-Null
        Write-Host "  [OK]  $($route.name)" -ForegroundColor Green
        $ok++
    }
    catch {
        $status = "ERR"
        if ($_.Exception.Response) {
            $status = $_.Exception.Response.StatusCode.Value__
        }
        Write-Host "  [FAIL] $($route.name) [$status]" -ForegroundColor Red
        $fail++
        $failed += "$($route.name) → $($route.path) [$status]"
    }
}

Write-Host "`n=== SUMMARY ===" -ForegroundColor Cyan
Write-Host "Total: $($routes.Count) routes" -ForegroundColor White
Write-Host "OK: $ok" -ForegroundColor Green
Write-Host "FAIL: $fail" -ForegroundColor $(if ($fail -gt 0) { 'Red' } else { 'Green' })
Write-Host "Success Rate: $([math]::Round($ok/$routes.Count*100))%" -ForegroundColor $(if ($fail -eq 0) { 'Green' } elseif ($ok -gt ($routes.Count/2)) { 'Yellow' } else { 'Red' })

if ($fail -gt 0) {
    Write-Host "`n=== FAILED ROUTES ===" -ForegroundColor Red
    foreach ($f in $failed) {
        Write-Host "  • $f" -ForegroundColor Red
    }
}

Write-Host ""

