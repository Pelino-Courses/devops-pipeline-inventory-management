# GitHub Secrets Setup Script
# This script displays all the values you need to configure as GitHub Secrets

$ErrorActionPreference = "Stop"

Write-Host "`n=== GitHub Secrets Configuration ===" -ForegroundColor Green
Write-Host "Copy these values to GitHub Settings → Secrets and variables → Actions`n" -ForegroundColor Yellow

# Load Terraform outputs
if (Test-Path "terraform-outputs.json") {
    $outputs = Get-Content "terraform-outputs.json" | ConvertFrom-Json
    
    Write-Host "Azure VM Configuration:" -ForegroundColor Cyan
    Write-Host "  VM_IP = $($outputs.vm_public_ip.value)" -ForegroundColor White
    Write-Host "  VM_PUBLIC_IP = $($outputs.vm_public_ip.value)" -ForegroundColor White
    
    Write-Host "`nAzure Container Registry:" -ForegroundColor Cyan
    Write-Host "  ACR_NAME = $($outputs.acr_name.value)" -ForegroundColor White
    Write-Host "  ACR_USERNAME = $($outputs.acr_admin_username.value)" -ForegroundColor White
    Write-Host "  ACR_LOGIN_SERVER = $($outputs.acr_login_server.value)" -ForegroundColor White
    Write-Host "  ACR_PASSWORD = $($outputs.acr_admin_password.value)" -ForegroundColor White
}
else {
    Write-Host "Warning: terraform-outputs.json not found!" -ForegroundColor Red
}

Write-Host "`nDatabase Configuration:" -ForegroundColor Cyan
Write-Host "  DB_USER = devops" -ForegroundColor White
Write-Host "  DB_PASSWORD = devops123" -ForegroundColor White
Write-Host "  DB_NAME = devops_app" -ForegroundColor White

Write-Host "`nSSH Configuration:" -ForegroundColor Cyan
Write-Host "  SSH_PRIVATE_KEY = (content of ~/.ssh/id_rsa)" -ForegroundColor White

if (Test-Path "~/.ssh/id_rsa") {
    Write-Host "`n  To copy SSH key, run:" -ForegroundColor Yellow
    Write-Host "    Get-Content ~/.ssh/id_rsa -Raw | Set-Clipboard" -ForegroundColor Gray
    Write-Host "  Then paste in GitHub Secrets" -ForegroundColor Gray
}
else {
    Write-Host "  Warning: SSH key not found at ~/.ssh/id_rsa" -ForegroundColor Red
}

Write-Host "`nAzure Service Principal (Optional - for ACR login):" -ForegroundColor Cyan
Write-Host "  ARM_CLIENT_ID = (your service principal client ID)" -ForegroundColor White
Write-Host "  ARM_CLIENT_SECRET = (your service principal client secret)" -ForegroundColor White
Write-Host "  ARM_TENANT_ID = (your Azure tenant ID)" -ForegroundColor White

Write-Host "`n=== Next Steps ===" -ForegroundColor Green
Write-Host "1. Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions" -ForegroundColor White
Write-Host "2. Click 'New repository secret' for each value above" -ForegroundColor White
Write-Host "3. After adding secrets, push code to trigger deployment" -ForegroundColor White
Write-Host "4. Monitor deployment at: https://github.com/YOUR_USERNAME/YOUR_REPO/actions`n" -ForegroundColor White
