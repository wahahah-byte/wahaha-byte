# Detects the current LAN IPv4 and updates apps/mobile/.env.local's
# EXPO_PUBLIC_API_URL accordingly. .env.local is used (not .env) because Expo
# loads it last in dev mode, so it wins over .env.production and other files —
# pointing it elsewhere would have no effect.
# Run with:   powershell -File .\scripts\set-api-url.ps1
# Optional flags:
#   -Port 5086       backend port (default 5086)
#   -Scheme http     http or https (default http)

param(
    [int]$Port = 5086,
    [ValidateSet("http","https")]
    [string]$Scheme = "http"
)

$ErrorActionPreference = "Stop"

# Pick the first non-APIPA IPv4 that was assigned via DHCP. Falls back to any
# Manual/Dhcp address if no DHCP one is found (e.g. ethernet with a static
# address). Skips 169.254.* (link-local) and 127.* (loopback).
function Get-PrimaryIPv4 {
    $candidates = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
        Where-Object {
            $_.IPAddress -notlike "169.254.*" -and
            $_.IPAddress -notlike "127.*" -and
            $_.PrefixOrigin -in @("Dhcp","Manual")
        } |
        Sort-Object -Property @{Expression = { if ($_.PrefixOrigin -eq "Dhcp") { 0 } else { 1 } }}
    if (-not $candidates) { return $null }
    return ($candidates | Select-Object -First 1).IPAddress
}

$ip = Get-PrimaryIPv4
if (-not $ip) {
    Write-Error "No usable IPv4 address found. Check your network connection."
    exit 1
}

$envPath = Join-Path $PSScriptRoot "..\apps\mobile\.env.local"
if (-not (Test-Path $envPath)) {
    # Create empty .env.local so Resolve-Path succeeds and write-back works on first run.
    New-Item -ItemType File -Path $envPath | Out-Null
}
$envPath = (Resolve-Path $envPath).Path
$newUrl = "$Scheme`://${ip}:${Port}"
$newLine = "EXPO_PUBLIC_API_URL=$newUrl"

$existing = if (Test-Path $envPath) { Get-Content $envPath -Raw } else { "" }
$lines = if ($existing) { $existing -split "(`r`n|`n)" } else { @() }

# Replace the EXPO_PUBLIC_API_URL line if present, otherwise append. Preserve
# any other lines (other env vars, comments) untouched.
$found = $false
$out = foreach ($line in $lines) {
    if ($line -match '^\s*EXPO_PUBLIC_API_URL\s*=') {
        $found = $true
        $newLine
    } else {
        $line
    }
}
if (-not $found) {
    if ($out -and $out[-1] -ne "") { $out += "" }
    $out += $newLine
}

# Write back as UTF-8 without BOM so Metro/Expo's env loader parses cleanly.
$content = ($out -join "`n").TrimEnd("`n") + "`n"
[System.IO.File]::WriteAllText($envPath, $content, [System.Text.UTF8Encoding]::new($false))

Write-Host "Updated $envPath"
Write-Host "  $newLine"
Write-Host ""
Write-Host "Restart Expo (press 'r' or stop + npm start) - env vars are baked at bundle time."
