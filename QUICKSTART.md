# Quick Start: Ansible CI/CD Deployment

## 📋 What You Have Now

✅ Ansible playbooks configured for automated deployment  
✅ GitHub Actions workflow ready (`.github/workflows/deploy.yml`)  
✅ All configuration files created  
✅ Setup script to display GitHub Secrets values  

## 🚀 Next Steps (5 minutes)

### Step 1: Get Your GitHub Secrets Values

Run this command:
```powershell
.\setup-github-secrets.ps1
```

This will display all the values you need.

### Step 2: Configure GitHub Secrets

1. **Go to your GitHub repository settings:**
   ```
   https://github.com/Pelino-Courses/devops-pipeline-inventory-management/settings/secrets/actions
   ```

2. **Click "New repository secret"** and add each of these:

   | Secret Name | Where to Get Value |
   |------------|-------------------|
   | `VM_IP` | From setup script output |
   | `VM_PUBLIC_IP` | From setup script output |
   | `ACR_NAME` | From setup script output |
   | `ACR_USERNAME` | From setup script output |
   | `ACR_LOGIN_SERVER` | From setup script output |
   | `ACR_PASSWORD` | From setup script output |
   | `DB_USER` | `devops` |
   | `DB_PASSWORD` | `devops123` |
   | `DB_NAME` | `devops_app` |
   | `SSH_PRIVATE_KEY` | See below ⬇️ |

3. **For SSH_PRIVATE_KEY:**
   ```powershell
   # Copy your SSH key to clipboard
   Get-Content ~/.ssh/id_rsa -Raw | Set-Clipboard
   ```
   Then paste into GitHub Secret.

### Step 3: Test Automated Deployment

1. **Make a small change** (e.g., edit README.md):
   ```bash
   echo "# Testing automated deployment" >> README.md
   ```

2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Test: Ansible automated deployment"
   git push origin main
   ```

3. **Watch the magic happen:**
   - Go to: https://github.com/Pelino-Courses/devops-pipeline-inventory-management/actions
   - Click on the latest workflow run
   - Watch Ansible deploy your changes automatically!

### Step 4: Verify Deployment

After the workflow completes:
- **Frontend**: http://4.221.153.23
- **Backend**: http://4.221.153.23:3000
- **Health**: http://4.221.153.23:3000/health

## 🎯 How It Works

```
You push code → GitHub Actions triggers → Ansible runs in Linux → 
Deploys to Azure VM → Application updates automatically
```

## 💡 Example: Change Button Color

1. Edit a frontend file
2. Commit and push
3. GitHub Actions automatically deploys
4. See your changes live in ~2-3 minutes!

## 🔧 Troubleshooting

**Workflow fails?**
- Check all GitHub Secrets are configured
- Verify SSH key is correct (no extra spaces/newlines)
- Ensure VM is running

**Need help?**
- Check the full walkthrough in `walkthrough.md`
- Review `docs/GITHUB_SECRETS.md` for detailed instructions

---

**Ready?** Start with Step 1 above! 🚀
