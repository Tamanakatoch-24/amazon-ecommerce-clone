$csvPath = 'C:\Users\hp\Downloads\amazon-clone\amazon-clone\amazon-clone\client\src\data\kaggle_raw\home\sdf\marketing_sample_for_amazon_com-ecommerce__20200101_20200131__10k_data.csv'
$dest = 'C:\Users\hp\Downloads\amazon-clone\amazon-clone\amazon-clone\client\src\data\products.js'

$rows = Import-Csv -Path $csvPath

function Parse-Price([string]$s1, [string]$s2) {
    if (![string]::IsNullOrWhiteSpace($s1)) { $candidate = $s1 } else { $candidate = $s2 }
    if ([string]::IsNullOrWhiteSpace($candidate)) { return 999 }
    $clean = ($candidate -replace '[^0-9\.]', '')
    if ([string]::IsNullOrWhiteSpace($clean)) { return 999 }
    try {
        $n = [double]$clean
        if ($n -lt 1) { return 999 }
        return [int][math]::Round($n)
    }
    catch {
        return 999
    }
}

function Map-Category([string]$cat) {
    if ($null -eq $cat) { $cat = '' }
    $t = $cat.ToLower()
    if ($t -match 'mobile|smartphone|cell phone|iphone|android') { return 'mobile' }
    if ($t -match 'clothing|shoes|jewelry|costume|apparel|fashion|handbag|watch') { return 'fashion' }
    if ($t -match 'electronics|computer|camera|audio|headphone|tv|video game|software|gps') { return 'electronics' }
    return 'home'
}

function First-Image([string]$raw) {
    if ([string]::IsNullOrWhiteSpace($raw)) { return '' }
    $parts = $raw -split '\|'
    foreach ($p in $parts) {
        $v = $p.Trim()
        if ($v -match '^https?://') { return $v }
    }
    return ''
}

$mapped = @()
foreach ($r in $rows) {
    $name = [string]$r.'Product Name'
    if ([string]::IsNullOrWhiteSpace($name)) { continue }

    $category = Map-Category ([string]$r.'Category')
    $img = First-Image ([string]$r.'Image')
    if ([string]::IsNullOrWhiteSpace($img)) {
        $img = 'data:image/svg+xml,%3Csvg xmlns=''http://www.w3.org/2000/svg'' width=''300'' height=''300''%3E%3Crect fill=''%23eceff1'' width=''300'' height=''300''/%3E%3Ctext x=''50%25'' y=''50%25'' dominant-baseline=''middle'' text-anchor=''middle'' font-family=''Arial'' font-size=''16'' fill=''%23333''%3EImage unavailable%3C/text%3E%3C/svg%3E'
    }

    $price = Parse-Price ([string]$r.'Selling Price') ([string]$r.'List Price')
    $desc = [string]$r.'About Product'
    if ([string]::IsNullOrWhiteSpace($desc)) { $desc = [string]$r.'Product Description' }
    if ([string]::IsNullOrWhiteSpace($desc)) { $desc = 'Product details available.' }

    $mapped += [pscustomobject]@{
        name        = $name.Trim()
        price       = $price
        category    = $category
        description = $desc.Trim()
        images      = @($img)
    }
}

$mobile = $mapped | Where-Object { $_.category -eq 'mobile' } | Select-Object -First 2
$fashion = $mapped | Where-Object { $_.category -eq 'fashion' } | Select-Object -First 60
$electronics = $mapped | Where-Object { $_.category -eq 'electronics' } | Select-Object -First 60
$homeItems = $mapped | Where-Object { $_.category -eq 'home' } | Select-Object -First 118
$selected = @($mobile + $fashion + $electronics + $homeItems)

$i = 1
$final = @()
foreach ($p in $selected) {
    $final += [ordered]@{
        id          = $i
        name        = $p.name
        price       = [int]$p.price
        category    = $p.category
        description = $p.description
        images      = $p.images
    }
    $i++
}

$json = $final | ConvertTo-Json -Depth 6
Set-Content -Path $dest -Value ("export const products = " + $json + ";`r`n") -Encoding UTF8

"Imported total: $($final.Count)"
$final | Group-Object category | Select-Object Name, Count | Format-Table -AutoSize
