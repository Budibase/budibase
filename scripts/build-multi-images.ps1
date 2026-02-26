# Build 3 Budibase images from source (apps, worker, proxy) for use with Podman/Docker.
# Database (budibase/database:2.0.0) is pulled from Docker Hub at compose time.
#
# Usage:
#   .\scripts\build-multi-images.ps1              # full build (monorepo + images)
#   .\scripts\build-multi-images.ps1 -SkipBuild   # images only (monorepo already built)
#   .\scripts\build-multi-images.ps1 -UseDocker    # use Docker instead of Podman
#
# Then run 6 containers (use the same engine you built with, e.g. podman compose or docker compose):
#   <engine> compose -f hosting/docker-compose.yaml -f hosting/docker-compose.local-images.yaml --env-file hosting/.env up -d

param([switch]$UseDocker, [switch]$SkipBuild)

$ErrorActionPreference = "Stop"
$repoRoot = Join-Path $PSScriptRoot ".."
Set-Location $repoRoot

$tag = "local"
$version = "0.0.0+local"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Budibase multi-image build" -ForegroundColor Cyan
Write-Host " apps:$tag  worker:$tag  proxy:$tag (built locally)" -ForegroundColor Cyan
Write-Host " database:2.0.0 (from Docker Hub)" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# ---------------------------------------------------------------
# Step 1: Monorepo build (TypeScript -> dist/)
# ---------------------------------------------------------------
if (-not $SkipBuild) {
    $env:DISABLE_V8_COMPILE_CACHE = "1"
    $env:NODE_OPTIONS = "--max-old-space-size=4096"
    Write-Host "[1/4] Running monorepo build (server, worker and deps)..." -ForegroundColor Yellow
    if (Get-Command yarn -ErrorAction SilentlyContinue) {
        yarn lerna run build --stream --concurrency 1 --scope @budibase/server --scope @budibase/worker
    } else {
        npx lerna run build --stream --concurrency 1 --scope @budibase/server --scope @budibase/worker
    }
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Monorepo build failed."
        exit 1
    }
} else {
    Write-Host "[1/4] Skipping monorepo build (-SkipBuild)." -ForegroundColor Gray
}

# ---------------------------------------------------------------
# Detect container engine (Podman preferred, Docker fallback)
# ---------------------------------------------------------------
$engine = "podman"
if ($UseDocker) {
    if (Get-Command docker -ErrorAction SilentlyContinue) {
        $engine = "docker"
        Write-Host "Using docker (-UseDocker)." -ForegroundColor Gray
    } else {
        Write-Error "Docker not found in PATH."
        exit 1
    }
} elseif (-not (Get-Command podman -ErrorAction SilentlyContinue)) {
    if (Get-Command docker -ErrorAction SilentlyContinue) {
        $engine = "docker"
        Write-Host "Podman not in PATH; falling back to docker." -ForegroundColor Gray
    } else {
        Write-Error "Neither podman nor docker found in PATH."
        exit 1
    }
}
Write-Host "Container engine: $engine" -ForegroundColor Gray
Write-Host ""

# ---------------------------------------------------------------
# Step 2-4: Build images (context = repo root for apps/worker)
# ---------------------------------------------------------------
Write-Host "[2/4] Building budibase/apps:$tag ..." -ForegroundColor Yellow
& $engine build --build-arg BUDIBASE_VERSION=$version -t "budibase/apps:$tag" -f packages/server/Dockerfile.multi .
if ($LASTEXITCODE -ne 0) { Write-Error "Failed to build budibase/apps"; exit 1 }

Write-Host "[3/4] Building budibase/worker:$tag ..." -ForegroundColor Yellow
& $engine build --build-arg BUDIBASE_VERSION=$version -t "budibase/worker:$tag" -f packages/worker/Dockerfile.multi .
if ($LASTEXITCODE -ne 0) { Write-Error "Failed to build budibase/worker"; exit 1 }

Write-Host "[4/4] Building budibase/proxy:$tag ..." -ForegroundColor Yellow
& $engine build -t "budibase/proxy:$tag" -f hosting/proxy/Dockerfile hosting/proxy
if ($LASTEXITCODE -ne 0) { Write-Error "Failed to build budibase/proxy"; exit 1 }

# ---------------------------------------------------------------
# Done
# ---------------------------------------------------------------
Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host " Done. 3 images built:" -ForegroundColor Green
Write-Host "   budibase/apps:$tag" -ForegroundColor Gray
Write-Host "   budibase/worker:$tag" -ForegroundColor Gray
Write-Host "   budibase/proxy:$tag" -ForegroundColor Gray
Write-Host " Database: budibase/database:2.0.0 (pulled at compose time)" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Run 6 containers:" -ForegroundColor Cyan
Write-Host "  $engine compose -f hosting/docker-compose.yaml -f hosting/docker-compose.local-images.yaml --env-file hosting/.env up -d" -ForegroundColor White
Write-Host ""
Write-Host "Open: http://localhost:10000" -ForegroundColor Cyan
Write-Host ""
