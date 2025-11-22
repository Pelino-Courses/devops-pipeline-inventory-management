# Automated Ansible Deployment Script
# This script installs all necessary tools and deploys the application to Azure VM

param(
    [switch]$SkipPythonCheck = $false
)

$ErrorActionPreference = "Stop"

Write-Host "=== Automated Ansible Deployment ===" -ForegroundColor Green
Write-Host ""

# Load Terraform outputs
Write-Host "[1/7] Loading Azure configuration..." -ForegroundColor Cyan
$terraformOutputs = Get-Content "terraform-outputs.json" | ConvertFrom-Json

$VM_IP = $terraformOutputs.vm_public_ip.value
$ACR_NAME = $terraformOutputs.acr_name.value
$ACR_LOGIN_SERVER = $terraformOutputs.acr_login_server.value
$ACR_PASSWORD = $terraformOutputs.acr_admin_password.value

Write-Host "  VM IP: $VM_IP" -ForegroundColor White
Write-Host "  ACR: $ACR_LOGIN_SERVER" -ForegroundColor White

# Check Python installation
Write-Host "`n[2/7] Checking Python installation..." -ForegroundColor Cyan
try {
    $pythonVersion = python --version 2>&1
    Write-Host "  Found: $pythonVersion" -ForegroundColor Green
}
catch {
    Write-Host "  Python not found. Installing Python..." -ForegroundColor Yellow
    
    # Download Python installer
    $pythonInstaller = "$env:TEMP\python-installer.exe"
    $pythonUrl = "https://www.python.org/ftp/python/3.11.7/python-3.11.7-amd64.exe"
    
    Write-Host "  Downloading Python 3.11.7..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $pythonUrl -OutFile $pythonInstaller
    
    Write-Host "  Installing Python (this may take a few minutes)..." -ForegroundColor Yellow
    Start-Process -FilePath $pythonInstaller -ArgumentList "/quiet", "InstallAllUsers=1", "PrependPath=1", "Include_test=0" -Wait
    
    # Refresh environment variables
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    
    Write-Host "  Python installed successfully!" -ForegroundColor Green
}

# Upgrade pip
Write-Host "`n[3/7] Upgrading pip..." -ForegroundColor Cyan
python -m pip install --upgrade pip --quiet
Write-Host "  pip upgraded successfully" -ForegroundColor Green

# Install Ansible
Write-Host "`n[4/7] Installing Ansible and dependencies..." -ForegroundColor Cyan
pip install ansible --quiet
pip install ansible-core --quiet
Write-Host "  Ansible installed successfully" -ForegroundColor Green

# Verify Ansible installation
$ansibleVersion = ansible --version | Select-Object -First 1
Write-Host "  $ansibleVersion" -ForegroundColor White

# Set environment variables for Ansible
Write-Host "`n[5/7] Configuring environment variables..." -ForegroundColor Cyan

# Fix locale encoding for Ansible
$env:PYTHONIOENCODING = "utf-8"
$env:PYTHONUTF8 = "1"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8

$env:ACR_NAME = $ACR_NAME
$env:ACR_LOGIN_SERVER = $ACR_LOGIN_SERVER
$env:ACR_PASSWORD = $ACR_PASSWORD
$env:DB_USER = "devops"
$env:DB_PASSWORD = "devops123"
$env:DB_NAME = "devops_app"
$env:IMAGE_TAG = "latest"
$env:ANSIBLE_HOST_KEY_CHECKING = "False"

Write-Host "  Environment variables configured" -ForegroundColor Green
Write-Host "  UTF-8 encoding configured" -ForegroundColor Green

# Check SSH connectivity
Write-Host "`n[6/7] Testing SSH connectivity to VM..." -ForegroundColor Cyan
try {
    $sshTest = ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 azureuser@$VM_IP "echo 'Connection successful'" 2>&1
    if ($sshTest -match "Connection successful") {
        Write-Host "  SSH connection successful!" -ForegroundColor Green
    }
    else {
        Write-Host "  Warning: SSH connection test inconclusive" -ForegroundColor Yellow
        Write-Host "  Output: $sshTest" -ForegroundColor Gray
    }
}
catch {
    Write-Host "  Warning: Could not verify SSH connection" -ForegroundColor Yellow
    Write-Host "  Error: $_" -ForegroundColor Gray
    Write-Host "  Continuing anyway..." -ForegroundColor Yellow
}

# Run Ansible playbook
Write-Host "`n[7/7] Running Ansible deployment..." -ForegroundColor Cyan
Write-Host "  This may take several minutes..." -ForegroundColor Yellow
Write-Host ""

Push-Location ansible

try {
    # First, test connectivity
    Write-Host "  Testing Ansible connectivity..." -ForegroundColor White
    ansible all -i inventory/hosts -m ping
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n  Running deployment playbook..." -ForegroundColor White
        ansible-playbook -i inventory/hosts playbooks/setup-server.yml -v
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n=== Deployment Completed Successfully ===" -ForegroundColor Green
            Write-Host "`nYour application is now accessible at:" -ForegroundColor Yellow
            Write-Host "  Frontend:      http://$VM_IP" -ForegroundColor White
            Write-Host "  Backend API:   http://${VM_IP}:3000" -ForegroundColor White
            Write-Host "  Health Check:  http://${VM_IP}:3000/health" -ForegroundColor White
            Write-Host "`nNote: It may take 1-2 minutes for all services to be fully ready." -ForegroundColor Gray
        }
        else {
            Write-Host "`n=== Deployment Failed ===" -ForegroundColor Red
            Write-Host "Please check the error messages above for details." -ForegroundColor Yellow
            exit 1
        }
    }
    else {
        Write-Host "`n=== Connectivity Test Failed ===" -ForegroundColor Red
        Write-Host "Could not connect to the VM. Please check:" -ForegroundColor Yellow
        Write-Host "  1. VM is running" -ForegroundColor White
        Write-Host "  2. SSH key is configured (~/.ssh/id_rsa)" -ForegroundColor White
        Write-Host "  3. Network connectivity to $VM_IP" -ForegroundColor White
        exit 1
    }
}
finally {
    Pop-Location
}
