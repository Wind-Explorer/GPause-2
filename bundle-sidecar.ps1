$extension = ".exe"

$sidecarName = "GPauseCore"

function Main {
  try {
    $projectPath = "..\$($sidecarName)\$($sidecarName)\$($sidecarName).csproj"
    $outputPath = "src-tauri\binaries\"

    $publishArgs = @(
      "publish",
      $projectPath,
      "-c", "Release",
      "-f", "net8.0",
      "-r", "win-x64",
      "--self-contained", "true",
      "-p:PublishSingleFile=true",
      "-p:DebugType=None",
      "-o", $outputPath
    )

    $output = & dotnet $publishArgs
    Write-Output $output
  }
  catch {
    Write-Error "Error: $_"
  }

  $rustInfo = & rustc -vV
  $targetTriple = ($rustInfo | Select-String -Pattern 'host: (\S+)' -AllMatches).Matches[0].Groups[1].Value

  if (-not $targetTriple) {
    Write-Error "Failed to determine platform target triple"
  }

  # Ensure paths are treated correctly
  $originalPath = "$($outputPath)$($sidecarName)$extension"
  $newPath = "$($outputPath)$($sidecarName)-$($targetTriple)$extension"

  # Use Move-Item instead of Rename-Item
  Move-Item -Path $originalPath -Destination $newPath -Force

}

Main
