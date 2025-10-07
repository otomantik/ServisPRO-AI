Write-Host "`n=== SERVISPRO AI - PAGE CHECK ===" -ForegroundColor Cyan
Write-Host "Testing all major pages...`n" -ForegroundColor White

$baseUrl = "http://localhost:5000"
$pages = @(
    @{Name="Landing Page"; Url="/"},
    @{Name="Login"; Url="/login"},
    @{Name="Dashboard"; Url="/dashboard"},
    @{Name="Services"; Url="/dashboard/services"},
    @{Name="Customers"; Url="/dashboard/customers"},
    @{Name="Stock"; Url="/dashboard/stock"},
    @{Name="Kasa"; Url="/dashboard/kasa"},
    @{Name="Alacaklar"; Url="/dashboard/alacaklar"},
    @{Name="AR Page"; Url="/ar"},
    @{Name="Staff"; Url="/dashboard/staff"},
    @{Name="Analytics"; Url="/dashboard/analytics"}
)

$passCount = 0
$failCount = 0

foreach ($page in $pages) {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl$($page.Url)" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        $sizeKB = [math]::Round($response.Content.Length / 1024, 1)
        Write-Host "  ✓ $($page.Name.PadRight(20)) - OK ($sizeKB KB)" -ForegroundColor Green
        $passCount++
    } catch {
        Write-Host "  ✗ $($page.Name.PadRight(20)) - FAILED" -ForegroundColor Red
        $failCount++
    }
}

Write-Host "`n=== SUMMARY ===" -ForegroundColor Cyan
Write-Host "Total: $($pages.Count)" -ForegroundColor White
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor $(if ($failCount -gt 0) { 'Red' } else { 'Green' })

if ($failCount -eq 0) {
    Write-Host "`n✓ All pages are working!" -ForegroundColor Green
} else {
    Write-Host "`n✗ Some pages need attention." -ForegroundColor Red
}

