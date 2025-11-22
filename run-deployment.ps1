# Quick Ansible Deployment Script
# Simplified version that runs Ansible directly

$ErrorActionPreference = "Stop"

Write-Host "=== Quick Ansible Deployment ===" -ForegroundColor Green
Write-Host ""

# Load Terraform outputs
$terraformOutputs = Get-Content "terraform-outputs.json" | ConvertFrom-Json
$ACR_NAME = $terraformOutputs.acr_name.value
$ACR_LOGIN_SERVER = $terraformOutputs.acr_login_server.value
$ACR_PASSWORD = $terraformOutputs.acr_admin_password.value

# Set UTF-8 encoding
$env:PYTHONIOENCODING = "utf-8"
$env:PYTHONUTF8 = "1"
chcp 65001 > $null

# Set environment variables
$env:ACR_NAME = $ACR_NAME
$env:ACR_LOGIN_SERVER = $ACR_LOGIN_SERVER
$env:ACR_PASSWORD = $ACR_PASSWORD
$env:DB_USER = "devops"
$env:DB_PASSWORD = "devops123"
$env:DB_NAME = "devops_app"
$env:IMAGE_TAG = "latest"
$env:ANSIBLE_HOST_KEY_CHECKING = "False"

Write-Host "Environment configured" -ForegroundColor Green
Write-Host ""

# Change to ansible directory
Push-Location ansible

try {
    Write-Host "Testing Ansible connectivity..." -ForegroundColor Cyan
    ansible all -i inventory/hosts -m ping
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nRunning deployment playbook..." -ForegroundColor Cyan
        Write-Host "This may take several minutes...`n" -ForegroundColor Yellow
        
        ansible-playbook -i inventory/hosts playbooks/setup-server.yml -v
        
        if ($LASTEXITCODE -eq 0) {
            $VM_IP = $terraformOutputs.vm_public_ip.value
            Write-Host "`n=== Deployment Completed Successfully ===" -ForegroundColor Green
            Write-Host "`nApplication URLs:" -ForegroundColor Yellow
            Write-Host "  Frontend:      http://$VM_IP" -ForegroundColor White
            Write-Host "  Backend API:   http://${VM_IP}:3000" -ForegroundColor White
            Write-Host "  Health Check:  http://${VM_IP}:3000/health" -ForegroundColor White
        } else {
            Write-Host "`n=== Deployment Failed ===" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "`n=== Connectivity Test Failed ===" -ForegroundColor Red
        Write-Host "Please ensure:" -ForegroundColor Yellow
        Write-Host "  1. VM is running" -ForegroundColor White
        Write-Host "  2. SSH key is configured (~/.ssh/id_rsa)" -ForegroundColor White
        exit 1
    }
} finally {
    Pop-Location
}
