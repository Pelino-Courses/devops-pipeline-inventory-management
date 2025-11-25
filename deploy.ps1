# Automated Deployment Script
# This script performs the same tasks as the Ansible playbooks via SSH

$VM_IP = "4.221.153.23"
$VM_USER = "azureuser"
$ACR_NAME = "devopspipelinedevacr4vokg"
$ACR_SERVER = "devopspipelinedevacr4vokg.azurecr.io"
# ACR_PASSWORD should be set as environment variable or retrieved from terraform outputs
$ACR_PASSWORD = $env:ACR_PASSWORD

Write-Host "=== Starting Automated Deployment ===" -ForegroundColor Green

# Step 1: Install Docker and Docker Compose
Write-Host "`n[1/6] Installing Docker and Docker Compose..." -ForegroundColor Cyan
ssh -o StrictHostKeyChecking=no ${VM_USER}@${VM_IP} @"
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo 'deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu focal stable' | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker azureuser
sudo curl -L 'https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-linux-x86_64' -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
"@

# Step 2: Configure Security (UFW)
Write-Host "`n[2/6] Configuring firewall..." -ForegroundColor Cyan
ssh ${VM_USER}@${VM_IP} @"
sudo apt-get install -y ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
echo 'y' | sudo ufw enable
"@

# Step 3: Clone repository
Write-Host "`n[3/6] Cloning repository..." -ForegroundColor Cyan
ssh ${VM_USER}@${VM_IP} @"
cd ~
if [ -d 'devops-pipeline-inventory-management' ]; then
    cd devops-pipeline-inventory-management
    git pull
else
    git clone https://github.com/Pelino-Courses/devops-pipeline-inventory-management.git
    cd devops-pipeline-inventory-management
fi
"@

# Step 4: Create environment file
Write-Host "`n[4/6] Creating environment configuration..." -ForegroundColor Cyan
ssh ${VM_USER}@${VM_IP} @"
cd ~/devops-pipeline-inventory-management
cat > .env << 'EOF'
DB_USER=devops
DB_PASSWORD=devops123
DB_NAME=devops_app
ACR_LOGIN_SERVER=${ACR_SERVER}
ACR_NAME=${ACR_NAME}
EOF
"@

# Step 5: Build and start containers
Write-Host "`n[5/6] Building and starting Docker containers..." -ForegroundColor Cyan
ssh ${VM_USER}@${VM_IP} @"
cd ~/devops-pipeline-inventory-management
docker-compose down
docker-compose up -d --build
"@

# Step 6: Verify deployment
Write-Host "`n[6/6] Verifying deployment..." -ForegroundColor Cyan
Start-Sleep -Seconds 10
ssh ${VM_USER}@${VM_IP} "docker ps"

Write-Host "`n=== Deployment Complete ===" -ForegroundColor Green
Write-Host "`nYour application should now be accessible at:" -ForegroundColor Yellow
Write-Host "  Frontend: http://${VM_IP}" -ForegroundColor White
Write-Host "  Backend:  http://${VM_IP}:3000" -ForegroundColor White
Write-Host "`nNote: It may take a few minutes for all containers to fully start." -ForegroundColor Yellow
