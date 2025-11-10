# PowerShell script to move files from fhevm-hardhat-template to root directory

$sourcePath = "fhevm-hardhat-template"
$destinationPath = "."

Write-Host "Starting file move operation from $sourcePath to $destinationPath"

# Get all items in source directory (excluding node_modules for performance)
Get-ChildItem -Path $sourcePath | ForEach-Object {
    $sourceItem = $_.FullName
    $destinationItem = Join-Path -Path $destinationPath -ChildPath $_.Name

    # Skip node_modules to save time and avoid conflicts
    if ($_.Name -eq "node_modules") {
        Write-Host "Skipping node_modules directory..."
        return
    }

    Write-Host "Moving $($_.Name)..."

    if (Test-Path $destinationItem) {
        Write-Host "  Removing existing $($_.Name)..."
        Remove-Item -Path $destinationItem -Recurse -Force
    }

    Move-Item -Path $sourceItem -Destination $destinationPath -Force
}

# Remove the now-empty fhevm-hardhat-template directory
if (Test-Path $sourcePath) {
    Write-Host "Removing empty $sourcePath directory..."
    Remove-Item -Path $sourcePath -Recurse -Force
}

Write-Host "File move operation completed!"
Write-Host "All files have been moved to the root directory."
