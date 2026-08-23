$toolPath = Join-Path $PSScriptRoot 'verify-local-build.ps1'

if (-not (Test-Path -LiteralPath $toolPath -PathType Leaf)) {
    throw "Expected local-build verifier at $toolPath"
}

$report = & $toolPath | ConvertFrom-Json

if ($report.appId -ne '4078200') {
    throw "Expected app ID 4078200, got '$($report.appId)'"
}

if ([string]::IsNullOrWhiteSpace($report.buildId)) {
    throw 'Expected a non-empty installed build ID'
}

if ($report.prestigeNameCount -lt 90) {
    throw "Expected at least 90 Prestige names, got $($report.prestigeNameCount)"
}

if ($report.effects.keyMaster -notmatch '40.*80.*120.*160') {
    throw 'Expected the installed Key Master effect to expose four current ranks'
}

if ($report.copiedGameFiles -ne $false) {
    throw 'The verifier must not copy game files'
}
