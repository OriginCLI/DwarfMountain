[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$GameExecutable,

    [Parameter(Mandatory = $true)]
    [string]$Disassembly,

    [Parameter(Mandatory = $true)]
    [string]$OutputPath
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Read-PeSections {
    param([System.IO.BinaryReader]$Reader)

    $stream = $Reader.BaseStream
    $stream.Position = 0x3c
    $peOffset = $Reader.ReadInt32()
    $stream.Position = $peOffset

    if ($Reader.ReadUInt32() -ne 0x00004550) {
        throw 'The input does not have a valid PE signature.'
    }

    [void]$Reader.ReadUInt16()
    $sectionCount = $Reader.ReadUInt16()
    [void]$Reader.ReadUInt32()
    [void]$Reader.ReadUInt32()
    [void]$Reader.ReadUInt32()
    $optionalHeaderSize = $Reader.ReadUInt16()
    [void]$Reader.ReadUInt16()
    $stream.Position += $optionalHeaderSize

    $sections = @()
    for ($index = 0; $index -lt $sectionCount; $index += 1) {
        $name = [Text.Encoding]::ASCII.GetString($Reader.ReadBytes(8)).TrimEnd([char]0)
        $virtualSize = $Reader.ReadUInt32()
        $virtualAddress = $Reader.ReadUInt32()
        $rawSize = $Reader.ReadUInt32()
        $rawOffset = $Reader.ReadUInt32()
        $stream.Position += 16

        $sections += [pscustomobject]@{
            Name = $name
            VirtualSize = [long]$virtualSize
            VirtualAddress = [long]$virtualAddress
            RawSize = [long]$rawSize
            RawOffset = [long]$rawOffset
        }
    }

    return $sections
}

function Convert-VaToFileOffset {
    param(
        [long]$VirtualAddress,
        [object[]]$Sections
    )

    $imageBase = 0x140000000L
    $rva = $VirtualAddress - $imageBase
    $section = $Sections | Where-Object {
        $size = [Math]::Max($_.VirtualSize, $_.RawSize)
        $rva -ge $_.VirtualAddress -and $rva -lt ($_.VirtualAddress + $size)
    } | Select-Object -First 1

    if ($null -eq $section) {
        throw ('Virtual address 0x{0:X} is outside the mapped PE sections.' -f $VirtualAddress)
    }

    $relativeOffset = $rva - $section.VirtualAddress
    if ($relativeOffset -ge $section.RawSize) {
        throw ('Virtual address 0x{0:X} points into uninitialized data.' -f $VirtualAddress)
    }

    return $section.RawOffset + $relativeOffset
}

function Read-NullTerminatedUtf8 {
    param(
        [System.IO.BinaryReader]$Reader,
        [long]$VirtualAddress,
        [object[]]$Sections
    )

    $Reader.BaseStream.Position = Convert-VaToFileOffset -VirtualAddress $VirtualAddress -Sections $Sections
    $bytes = [Collections.Generic.List[byte]]::new()
    while ($bytes.Count -lt 8192) {
        $value = $Reader.ReadByte()
        if ($value -eq 0) {
            return [Text.Encoding]::UTF8.GetString($bytes.ToArray())
        }
        $bytes.Add($value)
    }

    throw ('String at 0x{0:X} exceeds the safety limit.' -f $VirtualAddress)
}

function Read-FieldName {
    param(
        [System.IO.BinaryReader]$Reader,
        [long]$FieldIdAddress,
        [object[]]$Sections
    )

    # YYC stores each runtime field-id slot immediately after a pointer to the
    # field's null-terminated name. The slot itself is initialized to -1.
    $Reader.BaseStream.Position = Convert-VaToFileOffset -VirtualAddress ($FieldIdAddress - 8) -Sections $Sections
    $namePointer = $Reader.ReadInt64()
    return Read-NullTerminatedUtf8 -Reader $Reader -VirtualAddress $namePointer -Sections $Sections
}

function Convert-HexBitsToDouble {
    param([string]$HexValue)

    $bytes = [Convert]::FromHexString($HexValue.PadLeft(16, '0'))
    [Array]::Reverse($bytes)
    return [BitConverter]::ToDouble($bytes, 0)
}

$gamePath = (Resolve-Path -LiteralPath $GameExecutable).Path
$disassemblyPath = (Resolve-Path -LiteralPath $Disassembly).Path
$outputDirectory = Split-Path -Parent $OutputPath
if (-not (Test-Path -LiteralPath $outputDirectory -PathType Container)) {
    throw "Output directory does not exist: $outputDirectory"
}

$gameStream = [IO.File]::OpenRead($gamePath)
$reader = [IO.BinaryReader]::new($gameStream)
try {
    $sections = @(Read-PeSections -Reader $reader)

    # Field-id addresses observed in the node constructor family. Resolve the
    # addresses through the executable's own registration table instead of
    # assigning guessed labels.
    $fieldAddresses = @(
        0x141BCBE70L,
        0x141BD10F0L,
        0x141BD2340L,
        0x141B7F168L,
        0x141BD12F0L,
        0x141BD3D20L,
        0x141BE0540L,
        0x141B7FEE8L,
        0x141B7FC88L
    )

    $fieldByAddress = @{}
    foreach ($address in $fieldAddresses) {
        $fieldByAddress[('0x{0:X}' -f $address)] = Read-FieldName -Reader $reader -FieldIdAddress $address -Sections $sections
    }

    $disassemblyLines = & rg '^  0000000140(?:03[0-9A-F]{4}|(?:58|59)[0-9A-F]{4}):' $disassemblyPath
    if ($LASTEXITCODE -ne 0) {
        throw 'Could not locate the expected native Prestige ranges in the disassembly.'
    }

    # Global YYC RValue string slots are initialized by a tiny function with:
    #   lea rdx,[string]
    #   lea rcx,[global RValue]
    #   call YYSetString
    $stringByGlobal = @{}
    for ($index = 0; $index -lt $disassemblyLines.Count - 1; $index += 1) {
        $stringMatch = [regex]::Match($disassemblyLines[$index], 'lea\s+rdx,\[0*(14[0-9A-F]{7})h\]')
        $globalMatch = [regex]::Match($disassemblyLines[$index + 1], 'lea\s+rcx,\[0*(14[0-9A-F]{7})h\]')
        if ($stringMatch.Success -and $globalMatch.Success) {
            $stringAddress = [Convert]::ToInt64($stringMatch.Groups[1].Value, 16)
            $globalAddress = [Convert]::ToInt64($globalMatch.Groups[1].Value, 16)
            try {
                $stringByGlobal[('0x{0:X}' -f $globalAddress)] = Read-NullTerminatedUtf8 -Reader $reader -VirtualAddress $stringAddress -Sections $sections
            }
            catch {
                # The filtered range includes unrelated initializers. Only
                # mapped, null-terminated strings are relevant to this pass.
            }
        }
    }

    $functionStarts = [Collections.Generic.List[int]]::new()
    for ($index = 0; $index -lt $disassemblyLines.Count; $index += 1) {
        if ($disassemblyLines[$index] -match '^  0000000140([0-9A-F]{6}):.*mov\s+qword ptr \[rsp\+8\],rbx\s*$') {
            $functionStarts.Add($index)
        }
    }

    $nodes = [Collections.Generic.List[object]]::new()
    for ($functionIndex = 0; $functionIndex -lt $functionStarts.Count; $functionIndex += 1) {
        $from = $functionStarts[$functionIndex]
        $to = if ($functionIndex + 1 -lt $functionStarts.Count) { $functionStarts[$functionIndex + 1] - 1 } else { $disassemblyLines.Count - 1 }
        $block = $disassemblyLines[$from..$to]

        if (-not (($block -match '141BCBE70') -and ($block -match '141B7FC88'))) {
            continue
        }

        $registerValues = @{}
        $fieldValues = @{}
        $fieldGlobals = @{}
        $currentField = $null

        foreach ($line in $block) {
            foreach ($entry in $fieldByAddress.GetEnumerator()) {
                if ($line -match $entry.Key.Substring(2)) {
                    $currentField = $entry.Value
                    break
                }
            }

            if ($line -match '\bmov\s+(r(?:ax|bx|si|di|12|13|14|15)),([0-9A-F]+)h\s*$') {
                $registerValues[$matches[1]] = $matches[2]
            }
            elseif ($line -match '\bxor\s+(r(?:ax|bx|si|di|12|13|14|15))d,\1d\s*$') {
                $registerValues[$matches[1]] = '0'
            }

            if ($null -ne $currentField -and $line -match '\[0*(14[0-9A-F]{7})h\]') {
                $globalAddress = '0x' + $matches[1]
                if ($stringByGlobal.ContainsKey($globalAddress)) {
                    $fieldGlobals[$currentField] = $globalAddress
                    $fieldValues[$currentField] = $stringByGlobal[$globalAddress]
                }
            }

            if ($null -ne $currentField -and $line -match '\bmov\s+qword ptr \[(?:rsi|rbx)\],(r(?:ax|bx|si|di|12|13|14|15))\s*$') {
                $register = $matches[1]
                if ($registerValues.ContainsKey($register)) {
                    $fieldValues[$currentField] = Convert-HexBitsToDouble -HexValue $registerValues[$register]
                    $currentField = $null
                }
            }
        }

        $functionAddress = [regex]::Match($block[0], '0000000140([0-9A-F]{6})').Groups[1].Value
        foreach ($requiredField in @('name', 'loc_name', 'description', 'loc_description', 'tier', 'cost', 'purchases', 'maxPurchases')) {
            if (-not $fieldValues.ContainsKey($requiredField)) {
                throw "Missing field '$requiredField' while parsing constructor 0x140$functionAddress."
            }
        }

        $locName = [string]$fieldValues['loc_name']
        $locDescription = [string]$fieldValues['loc_description']
        $locIdMatch = [regex]::Match($locName, '^prestige\.(.+)\.name$')
        if (-not $locIdMatch.Success) {
            throw "Could not derive a Prestige id from $locName in function 0x140$functionAddress"
        }

        $id = $locIdMatch.Groups[1].Value
        if ($id -eq 'p_t6_cannons_infinite') {
            # The installed save schema and runtime references use the singular
            # id; only this localization key retains the plural spelling.
            $id = 'p_t6_cannon_infinite'
        }

        $spriteImmediate = $null
        $spriteFieldLine = ($block | Select-String '141B7F168' | Select-Object -First 1).LineNumber
        if ($null -ne $spriteFieldLine) {
            $spriteTail = $block[($spriteFieldLine - 1)..([Math]::Min($spriteFieldLine + 45, $block.Count - 1))]
            $resourceMatch = $spriteTail | Select-String 'mov\s+rax,100000100000([0-9A-F]+)h' | Select-Object -First 1
            if ($null -ne $resourceMatch) {
                $spriteImmediate = [Convert]::ToInt32($resourceMatch.Matches[0].Groups[1].Value, 16)
            }
        }

        $tier = [int][double]$fieldValues['tier']
        $ordinalInTier = @($nodes | Where-Object { $_.tier -eq $tier }).Count
        $nodes.Add([pscustomobject]@{
            id = $id
            name = [string]$fieldValues['name']
            localization = [ordered]@{
                name = $locName
                description = $locDescription
            }
            description = [string]$fieldValues['description']
            tier = $tier
            maxRank = [int][double]$fieldValues['maxPurchases']
            baseCost = [int][double]$fieldValues['cost']
            initialPurchases = [int][double]$fieldValues['purchases']
            position = [ordered]@{
                row = [Math]::Floor($ordinalInTier / 7)
                column = $ordinalInTier % 7
            }
            dependencies = @()
            spriteResourceIndex = $spriteImmediate
            native = [ordered]@{
                constructor = "0x140$functionAddress"
                fields = $fieldGlobals
            }
        })
    }

    if ($nodes.Count -ne 102) {
        throw "Expected 102 Prestige constructors, extracted $($nodes.Count)."
    }

    $tierRequirementValues = @($disassemblyLines | ForEach-Object {
        $addressMatch = [regex]::Match($_, '^  0000000140([0-9A-F]{6}):')
        if (-not $addressMatch.Success) {
            return
        }

        $address = [Convert]::ToInt32($addressMatch.Groups[1].Value, 16)
        if ($address -ge 0x5867B0 -and $address -lt 0x5869C0 -and $_ -match '\bmov\s+rax,([0-9A-F]{16})h\s*$') {
            Convert-HexBitsToDouble -HexValue $matches[1]
        }
    })
    if ($tierRequirementValues.Count -ne 5) {
        throw "Expected five native tier thresholds, extracted $($tierRequirementValues.Count)."
    }

    $tierUnlockSpent = [ordered]@{ '1' = 0 }
    for ($tierIndex = 0; $tierIndex -lt $tierRequirementValues.Count; $tierIndex += 1) {
        $tierUnlockSpent[[string]($tierIndex + 2)] = [int]$tierRequirementValues[$tierIndex]
    }

    $result = [ordered]@{
        formatVersion = 1
        source = [ordered]@{
            executable = $gamePath
            sha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $gamePath).Hash.ToLowerInvariant()
            disassembly = $disassemblyPath
        }
        extraction = [ordered]@{
            method = 'Static PE string/field-table resolution plus dumpbin disassembly parsing'
            nodeConstructorRange = 'gml_Script____struct___1844 through ___1945'
            gridRule = 'Seven columns; constructor order within each native tier'
        }
        fieldAddresses = $fieldByAddress
        tierUnlockSpent = $tierUnlockSpent
        tierCounts = @($nodes | Group-Object tier | Sort-Object { [int]$_.Name } | ForEach-Object {
            [ordered]@{ tier = [int]$_.Name; count = $_.Count }
        })
        nodes = $nodes
    }

    $result | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $OutputPath -Encoding utf8
    Write-Host "Extracted $($nodes.Count) read-only Prestige records to $OutputPath"
}
finally {
    $reader.Dispose()
    $gameStream.Dispose()
}
