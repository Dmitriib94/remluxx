# Сборка единого CSS-бандла (убирает цепочку @import и лишние запросы)
$root = Split-Path -Parent $PSScriptRoot
$base = Join-Path $root "css"

$files = @(
  "base/reset.css", "base/variables.css", "base/typography.css", "base/layout.css",
  "components/button.css", "components/control-button.css", "components/shared-interactions.css", "components/slider.css", "components/icon.css",
  "sections/header.css", "sections/hero.css", "sections/process.css", "sections/pricing.css",
  "sections/services.css", "sections/portfolio.css", "sections/why-us.css", "sections/design.css",
  "sections/faq.css", "sections/about.css", "sections/contacts.css", "sections/footer.css"
)

$out = New-Object System.Text.StringBuilder
foreach ($f in $files) {
  $path = Join-Path $base $f
  if (-not (Test-Path $path)) { throw "Missing: $f" }
  [void]$out.AppendLine("/* === $f === */")
  [void]$out.AppendLine([IO.File]::ReadAllText($path))
  [void]$out.AppendLine("")
}

$dest = Join-Path $base "bundle.css"
[IO.File]::WriteAllText($dest, $out.ToString())
$kb = [math]::Round((Get-Item $dest).Length / 1KB, 1)
Write-Host "Written $dest ($kb KB)"
