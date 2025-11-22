# GitHub Secrets Configuration for Ansible Deployment

To enable automated deployment with Ansible via GitHub Actions, you need to configure the following secrets in your GitHub repository.

## How to Add Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret below

## Required Secrets

### Azure VM Configuration
- **`VM_IP`**: `4.221.153.23`
- **`SSH_PRIVATE_KEY`**: Your SSH private key content (from `~/.ssh/id_rsa`)
  - To get this on Windows: `cat ~/.ssh/id_rsa` or `Get-Content ~\.ssh\id_rsa -Raw`

### Azure Container Registry
- **`ACR_NAME`**: `devopspipelinedevacr4vokg`
- **`ACR_LOGIN_SERVER`**: `devopspipelinedevacr4vokg.azurecr.io`
- **`ACR_PASSWORD`**: `zbuTFzB4pbvVviDg/TDgXbwQy2Kqpji/d0fyc64xk3+ACRBgqOlz`

### Database Configuration
- **`DB_USER`**: `devops`
- **`DB_PASSWORD`**: `devops123`
- **`DB_NAME`**: `devops_app`

### Azure Service Principal (Optional - for ACR login)
- **`ARM_CLIENT_ID`**: Your Azure service principal client ID
- **`ARM_CLIENT_SECRET`**: Your Azure service principal client secret
- **`ARM_TENANT_ID`**: Your Azure tenant ID

## Quick Setup Script

Run this PowerShell command to display all values:

```powershell
$outputs = Get-Content "terraform-outputs.json" | ConvertFrom-Json

Write-Host "`n=== GitHub Secrets Configuration ===" -ForegroundColor Green
Write-Host "`nVM_IP: $($outputs.vm_public_ip.value)"
Write-Host "ACR_NAME: $($outputs.acr_name.value)"
Write-Host "ACR_LOGIN_SERVER: $($outputs.acr_login_server.value)"
Write-Host "ACR_PASSWORD: $($outputs.acr_admin_password.value)"
Write-Host "DB_USER: devops"
Write-Host "DB_PASSWORD: devops123"
Write-Host "DB_NAME: devops_app"
Write-Host "`nSSH_PRIVATE_KEY: (copy from ~/.ssh/id_rsa)"
```

## Testing the Workflow

After configuring secrets:

1. Make a change to your code (e.g., change a button color)
2. Commit and push to `main` or `develop` branch
3. Go to **Actions** tab in GitHub
4. Watch the "Deploy to Azure VM with Ansible" workflow run
5. Your changes will automatically deploy to the Azure VM!

## Workflow Triggers

The deployment runs automatically when:
- Code is pushed to `main` or `develop` branches
- Changes are made to: `backend/**`, `frontend/**`, `ansible/**`, or `docker-compose.yml`
- Manually triggered via "Run workflow" button in GitHub Actions
