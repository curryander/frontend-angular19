param(
  [string]$Url = "http://localhost:8181/v3/api-docs"
)

$ErrorActionPreference = "Stop"

$response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 20
Write-Output "HTTP-Status: $($response.StatusCode)"

$json = $response.Content | ConvertFrom-Json
Write-Output "OpenAPI-Version: $($json.openapi)"
Write-Output "Titel: $($json.info.title)"
Write-Output "Version: $($json.info.version)"
Write-Output "Endpoints:"
$json.paths.PSObject.Properties.Name | ForEach-Object { Write-Output "- $_" }
