# Build Budibase single image for Podman.
# Script name: build-single-image-podman.ps1 (also referred to as build-budibase-single.ps1).
# Runs app build inside a Node 22 container, then builds the image with Podman.
# Requires: Podman (start it first: podman machine start, or start Podman Desktop).
# No need for Node 22 or Yarn on the host.

$ErrorActionPreference = "Stop"
$repoRoot = Join-Path $PSScriptRoot ".."
Set-Location $repoRoot

# Check Podman is running
$null = podman info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Podman is not running or not in PATH." -ForegroundColor Red
    Write-Host "Start Podman first: run 'podman machine start', or start Podman Desktop." -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 1
}

# Build inside a container volume (no host node_modules) to avoid EIO unlink on Windows binaries
$volName = "budibase_build_vol"
$tarFile = "budibase_repo.tar"
$repoPath = (Get-Location).Path
# Host path for volume mount. Container needs to read the tarball from /host.
# Windows: try Linux-style path first (/mnt/c/...). If mount fails, set $hostPathForMount = $repoPath.Replace('\','/') and re-run.
if ($repoPath -match "^([A-Za-z]):\\.*") {
    $drive = $Matches[1].ToLower()
    $hostPathForMount = "/mnt/$drive/" + ($repoPath -replace "^[A-Za-z]:\\", "" -replace "\\", "/")
} else {
    $hostPathForMount = $repoPath -replace "\\", "/"
}

Write-Host "Creating tarball (excluding node_modules, .git)..." -ForegroundColor Cyan
& tar --exclude=node_modules --exclude=.git --exclude=packages/server/node_modules --exclude=packages/worker/node_modules --exclude=.yarn --exclude="$tarFile" -cf $tarFile .
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to create tarball. Is 'tar' in PATH? (Windows 10+ or Git for Windows)"
    exit 1
}

Write-Host "Extracting in container and building server and worker apps (this may take several minutes)..." -ForegroundColor Cyan
podman run --rm `
    -v "${hostPathForMount}:/host:ro" `
    -v "${volName}:/app:rw" `
    -w /app `
    -e YARN_IGNORE_ENGINES=1 `
    -e DISABLE_V8_COMPILE_CACHE=1 `
    -e NODE_OPTIONS="--max-old-space-size=4096" `
    -e NODE_TLS_REJECT_UNAUTHORIZED=0 `
    -e npm_config_fetch_retries=5 `
    -e npm_config_fetch_timeout=300000 `
    -e npm_config_fetch_retry_mintimeout=20000 `
    -e npm_config_fetch_retry_maxtimeout=120000 `
    node:22-slim `
    bash -c "tar xf /host/$tarFile -C /app && apt-get update -qq && apt-get install -y -qq git python3 make g++ > /dev/null && npm install -g yarn --force && yarn install --ignore-engines --network-timeout 300000 && yarn build --scope @budibase/server --scope @budibase/worker --include-dependencies"

if ($LASTEXITCODE -ne 0) {
    Write-Error "App build failed. Fix errors above and re-run."
    exit 1
}

# Copy build artifacts from volume back to host
Write-Host "Copying build artifacts to host..." -ForegroundColor Cyan
$cpContainer = "budibase_cp_$([Guid]::NewGuid().ToString('N').Substring(0,8))"
podman run --name $cpContainer -v "${volName}:/app:ro" -d node:22-slim sleep 120 | Out-Null
podman cp "${cpContainer}:/app/packages/server/dist" (Join-Path $repoRoot "packages\server")
podman cp "${cpContainer}:/app/packages/server/client" (Join-Path $repoRoot "packages\server")
podman cp "${cpContainer}:/app/packages/server/builder" (Join-Path $repoRoot "packages\server")
podman cp "${cpContainer}:/app/packages/worker/dist" (Join-Path $repoRoot "packages\worker")
podman rm -f $cpContainer | Out-Null
podman volume rm $volName | Out-Null
Remove-Item -Force (Join-Path $repoRoot $tarFile) -ErrorAction SilentlyContinue

# Verify built artifacts were copied (needed for single image and /embed)
$clientJs = Join-Path $repoRoot "packages\server\client\budibase-client.js"
$builderIndex = Join-Path $repoRoot "packages\server\builder\index.html"
$ok = $true
if (-not (Test-Path $clientJs)) {
    Write-Host "WARNING: packages\server\client\budibase-client.js was not copied. @budibase/client build may have failed. Check container build output above." -ForegroundColor Yellow
    $ok = $false
}
if (-not (Test-Path $builderIndex)) {
    Write-Host "WARNING: packages\server\builder\index.html was not copied. @budibase/builder build may have failed. Check container build output above." -ForegroundColor Yellow
    $ok = $false
}
if ($ok) {
    Write-Host "Build artifacts copied (server/dist, server/client, server/builder, worker/dist)." -ForegroundColor Green
}

$version = (Get-Content (Join-Path $repoRoot "lerna.json") | ConvertFrom-Json).version
Write-Host "Building image budibase:latest with Podman (version $version)..."
podman build `
    -f hosting/single/Dockerfile `
    -t budibase:latest `
    --no-cache `
    --build-arg BUDIBASE_VERSION=$version `
    --build-arg TARGETBUILD=single `
    .

if ($LASTEXITCODE -ne 0) {
    Write-Error "Image build failed. Fix errors above and re-run."
    exit 1
}

Write-Host "Done. Run with: podman run -d -p 80:80 -p 443:443 -v budibase_data:/data --name budibase budibase:latest"
