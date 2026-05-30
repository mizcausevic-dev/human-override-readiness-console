$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$screenshots = Join-Path $root "screenshots"
New-Item -ItemType Directory -Force -Path $screenshots | Out-Null

Add-Type -AssemblyName System.Drawing

function New-ProofImage {
    param(
        [string]$Path,
        [string]$Title,
        [string]$Subtitle,
        [string[]]$Bullets
    )

    $bitmap = New-Object System.Drawing.Bitmap 1600, 1000
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.Clear([System.Drawing.Color]::FromArgb(7, 10, 15))

    $panelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(11, 18, 32))
    $greenBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(55, 255, 139))
    $blueBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 199, 255))
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(233, 243, 255))
    $mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(171, 186, 201))
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(42, 111, 88), 2)

    $graphics.FillRectangle($panelBrush, 48, 48, 1504, 904)
    $graphics.DrawRectangle($borderPen, 48, 48, 1504, 904)

    $eyebrowFont = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
    $titleFont = New-Object System.Drawing.Font("Georgia", 34, [System.Drawing.FontStyle]::Bold)
    $bodyFont = New-Object System.Drawing.Font("Segoe UI", 18)

    $graphics.DrawString("Human Override Readiness Console", $eyebrowFont, $greenBrush, 92, 92)
    $graphics.DrawString($Title, $titleFont, $textBrush, (New-Object System.Drawing.RectangleF -ArgumentList 92, 142, 1330, 120))
    $graphics.DrawString($Subtitle, $bodyFont, $mutedBrush, (New-Object System.Drawing.RectangleF -ArgumentList 92, 270, 1330, 80))

    $y = 390
    foreach ($bullet in $Bullets) {
        $graphics.DrawString("-", $bodyFont, $blueBrush, 108, $y)
        $graphics.DrawString($bullet, $bodyFont, $textBrush, (New-Object System.Drawing.RectangleF -ArgumentList 138, ($y + 2), 1260, 60))
        $y += 92
    }

    $graphics.DrawString("Synthetic proof render for README packaging.", $bodyFont, $mutedBrush, 92, 880)
    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

New-ProofImage -Path (Join-Path $screenshots "01-overview-proof.png") `
    -Title "Human override readiness, supervisor coverage, and intervention posture in one operator surface." `
    -Subtitle "Supervisor reachability, kill-switch drills, telemetry continuity, and takeover latency in one robotics control plane." `
    -Bullets @(
        "Supervisor coverage and drill freshness stay visible before incidents.",
        "Telemetry blind zones and stale handoff packets surface in one lane.",
        "Recruiter-facing robotics proof without exposing live fleet credentials."
    )

New-ProofImage -Path (Join-Path $screenshots "02-override-lane-proof.png") `
    -Title "Owner-mapped override lanes instead of raw autonomy exports." `
    -Subtitle "Each lane ties owner, focus, and next action together so intervention work is readable." `
    -Bullets @(
        "Field Robotics Ops owns supervisor recovery and route coverage.",
        "Safety Engineering owns kill-switch drill restoration.",
        "Platform and operations assurance teams can work from one surface."
    )

New-ProofImage -Path (Join-Path $screenshots "03-readiness-gaps-proof.png") `
    -Title "The readiness table stays specific: supervisor gaps, stale drills, blind telemetry, and weak handoff packets." `
    -Subtitle "The lane is grounded in override-readiness exports rather than generic robotics marketing copy." `
    -Bullets @(
        "High-severity readiness gaps sort first.",
        "Each row keeps owner, family, subject, and message visible.",
        "The system makes intervention cleanup auditable."
    )

New-ProofImage -Path (Join-Path $screenshots "04-operator-posture-proof.png") `
    -Title "Operator posture packets make go or pause decisions readable." `
    -Subtitle "Completeness, blocker, and launch-window pressure stay visible for every override remediation lane." `
    -Bullets @(
        "Supervisor recovery and drill repair stay separated cleanly.",
        "Telemetry continuity and operator certification remain visible before rollout.",
        "The system is shaped for real human-override proof."
    )
