# Test script for checking all 'new' pages
Write-Host "`n=== CREATE FUNCTIONS TEST ===" -ForegroundColor Cyan
Write-Host "Testing all 'new' page functionalities...`n" -ForegroundColor White

$baseUrl = "http://localhost:5000"

Write-Host "[1] Checking if 'new' pages load..." -ForegroundColor Yellow
$newPages = @(
    "/dashboard/services/new",
    "/dashboard/customers/new",
    "/dashboard/staff/new",
    "/dashboard/stock/new",
    "/dashboard/cash/new",
    "/dashboard/maintenance/new",
    "/dashboard/kasa/new",
    "/dashboard/alacaklar/new"
)

$pageLoadOk = 0
$pageLoadFail = 0

foreach ($page in $newPages) {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl$page" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✓ $page" -ForegroundColor Green
            $pageLoadOk++
        }
    } catch {
        Write-Host "  ✗ $page [FAILED]" -ForegroundColor Red
        $pageLoadFail++
    }
}

Write-Host "`n=== SUMMARY ===" -ForegroundColor Cyan
Write-Host "Page Load Tests:" -ForegroundColor White
Write-Host "  Total: $($newPages.Count)" -ForegroundColor White
Write-Host "  Passed: $pageLoadOk" -ForegroundColor Green
Write-Host "  Failed: $pageLoadFail" -ForegroundColor $(if ($pageLoadFail -gt 0) { 'Red' } else { 'Green' })

if ($pageLoadFail -eq 0) {
    Write-Host "`n✓ All 'new' pages are loading successfully!" -ForegroundColor Green
    Write-Host "Users can access all create forms." -ForegroundColor Green
} else {
    Write-Host "`n✗ Some pages are not loading properly." -ForegroundColor Red
    Write-Host "Please check the failed pages." -ForegroundColor Red
}

Write-Host "`nNote: Form submissions should be tested manually in the browser." -ForegroundColor Gray

