param(
  [string]$Url = "http://localhost:8181/v3/api-docs",
  [string]$OutFile = "src/app/api/openapi.json"
)

$ErrorActionPreference = "Stop"

$targetDir = Split-Path -Path $OutFile -Parent
if (-not (Test-Path -Path $targetDir)) {
  New-Item -Path $targetDir -ItemType Directory | Out-Null
}

$response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 20
if ($response.StatusCode -lt 200 -or $response.StatusCode -ge 300) {
  throw "OpenAPI konnte nicht geladen werden. HTTP-Status: $($response.StatusCode)"
}

Set-Content -Path $OutFile -Value $response.Content -Encoding UTF8
Write-Output "OpenAPI gespeichert: $OutFile"
