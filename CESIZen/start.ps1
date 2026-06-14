# ─── CESIZen – Script de démarrage ───────────────────────────────────────────
# Lance MySQL (via XAMPP), le backend Express et le frontend Vite.
# Utilisation : clic droit → "Exécuter avec PowerShell"
# ─────────────────────────────────────────────────────────────────────────────

$root    = $PSScriptRoot
$xampp   = "C:\xampp"
$mysql   = "$xampp\mysql\bin\mysqld.exe"
$mycli   = "$xampp\mysql\bin\mysql.exe"
$backend = "$root\backend"
$frontend= "$root\frontend"

Write-Host ""
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "    CESIZen – Demarrage       " -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# ── 1. MySQL ──────────────────────────────────────────────────────────────────
$mysqlRunning = $false
try {
    & $mycli -u root -e "SELECT 1;" 2>$null | Out-Null
    $mysqlRunning = $?
} catch {}

if ($mysqlRunning) {
    Write-Host "[MySQL]   Deja en cours d'execution." -ForegroundColor Green
} else {
    Write-Host "[MySQL]   Demarrage..." -ForegroundColor Yellow
    Start-Process -FilePath $mysql `
        -ArgumentList "--defaults-file=`"$xampp\mysql\bin\my.ini`"" `
        -WindowStyle Hidden
    Start-Sleep -Seconds 3
    Write-Host "[MySQL]   Demarre." -ForegroundColor Green
}

# ── 2. Backend (Express – port 3001) ─────────────────────────────────────────
Write-Host "[Backend] Demarrage (port 3001)..." -ForegroundColor Yellow
$backendJob = Start-Process -FilePath "powershell.exe" `
    -ArgumentList "-NoExit", "-Command", "cd '$backend'; npm run dev" `
    -PassThru
Write-Host "[Backend] PID $($backendJob.Id)" -ForegroundColor Green
Start-Sleep -Seconds 2

# ── 3. Frontend (Vite – port 5173) ───────────────────────────────────────────
Write-Host "[Vite]    Demarrage (port 5173)..." -ForegroundColor Yellow
$frontendJob = Start-Process -FilePath "powershell.exe" `
    -ArgumentList "-NoExit", "-Command", "cd '$frontend'; npm run dev" `
    -PassThru
Write-Host "[Vite]    PID $($frontendJob.Id)" -ForegroundColor Green
Start-Sleep -Seconds 3

# ── Ouvre le navigateur ───────────────────────────────────────────────────────
Write-Host ""
Write-Host "Ouverture du navigateur..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "==============================" -ForegroundColor Green
Write-Host "  Application disponible sur  " -ForegroundColor Green
Write-Host "  http://localhost:5173        " -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host ""
Write-Host "Comptes de demo :" -ForegroundColor White
Write-Host "  Admin : admin@cesizen.fr / Admin@cesizen1" -ForegroundColor Gray
Write-Host "  User  : user@cesizen.fr  / User@cesizen1" -ForegroundColor Gray
Write-Host ""
Write-Host "Pour fermer : Ctrl+C dans chaque fenetre + Stop-Process -Name node -Force" -ForegroundColor DarkGray
Write-Host ""
Read-Host "Appuie sur Entree pour fermer cette fenetre"
