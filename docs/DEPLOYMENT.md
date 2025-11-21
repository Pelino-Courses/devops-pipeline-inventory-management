# Deployment Guide

This document provides detailed instructions for deploying the DevOps Pipeline Project.

## Prerequisites

Before starting the deployment, ensure you have the following:

1.  **Azure Subscription**: An active Azure subscription with permissions to create resources (Resource Groups, VMs, VNets, ACR).
2.  **Terraform Cloud Account**: An account on Terraform Cloud (app.terraform.io) with an organization and workspace created.
3.  **GitHub Repository**: Access to this repository with admin permissions to configure secrets.
4.  **Azure CLI**: Installed and authenticated (`az login`).

## 1. Infrastructure Setup (Terraform)

### Terraform Cloud Configuration

1.  Log in to Terraform Cloud.
2.  Create a new workspace named `devops-pipeline-infrastructure` (or update `terraform/main.tf` to match your workspace name).
3.  Go to the **Variables** section of your workspace.
4.  Add the following **Environment Variables** (mark as sensitive where appropriate):
    *   `ARM_CLIENT_ID`: Your Azure Service Principal Client ID.
    *   `ARM_CLIENT_SECRET`: Your Azure Service Principal Client Secret.
    *   `ARM_SUBSCRIPTION_ID`: Your Azure Subscription ID.
    *   `ARM_TENANT_ID`: Your Azure Tenant ID.
5.  Add the following **Terraform Variables**:
    *   `project_name`: `devopspipeline` (or your preferred name).
    *   `environment`: `dev` (or `prod`).
    *   `location`: `southafricanorth` (or your preferred region).
    *   `admin_username`: `azureuser`.
    *   `ssh_public_key`: Your SSH public key (e.g., content of `~/.ssh/id_rsa.pub`).
    *   `client_secret`: Your Azure Service Principal Client Secret (same as `ARM_CLIENT_SECRET`).

### Initial Provisioning

You can trigger the initial provisioning manually or via the CI/CD pipeline.

**Manual Trigger:**
1.  Navigate to the `terraform` directory.
2.  Run `terraform init`.
3.  Run `terraform plan`.
4.  Run `terraform apply`.

**CI/CD Trigger:**
Push changes to the `terraform/` directory on the `main` branch. The `Terraform Infrastructure` workflow will run.

## 2. Configuration Management (Ansible)

Ansible is used to configure the provisioned VM and deploy the application.

### GitHub Secrets Configuration

Go to your GitHub repository **Settings > Secrets and variables > Actions** and add the following repository secrets:

*   `TF_API_TOKEN`: Your Terraform Cloud User API Token.
*   `ACR_NAME`: The name of your Azure Container Registry (output from Terraform).
*   `ACR_LOGIN_SERVER`: The login server for ACR (e.g., `myacr.azurecr.io`).
*   `ACR_USERNAME`: The admin username for ACR.
*   `ACR_PASSWORD`: The admin password for ACR.
*   `VM_PUBLIC_IP`: The public IP address of the Azure VM (output from Terraform).
*   `SSH_PRIVATE_KEY`: The private SSH key corresponding to the public key used in Terraform.
*   `ARM_CLIENT_ID`: Azure Service Principal Client ID.
*   `ARM_CLIENT_SECRET`: Azure Service Principal Client Secret.
*   `ARM_TENANT_ID`: Azure Tenant ID.
*   `DB_USER`: Database username (e.g., `postgres`).
*   `DB_PASSWORD`: Database password.
*   `DB_NAME`: Database name (e.g., `devopsdb`).

## 3. Application Deployment (CI/CD)

The application deployment is fully automated via the `CD Pipeline` workflow.

1.  **Trigger**: Push changes to the `main` branch.
2.  **Build**: The pipeline builds Docker images for the Frontend and Backend.
3.  **Push**: Images are pushed to the Azure Container Registry.
4.  **Deploy**: Ansible connects to the Azure VM:
    *   Installs Docker and Docker Compose.
    *   Configures security (UFW, Fail2ban).
    *   Pulls the new images from ACR.
    *   Updates the `docker-compose.yml` and `.env` files.
    *   Restarts the application containers.
5.  **Verify**: The pipeline performs smoke tests to ensure the application is running.

## 4. Verification

After deployment, you can verify the application:

*   **Frontend**: Visit `http://<VM_PUBLIC_IP>` in your browser.
*   **Backend Health**: Visit `http://<VM_PUBLIC_IP>:3000/health`.
*   **System Status**: SSH into the VM and run `system-status.sh`.

## Troubleshooting

*   **SSH Connection Refused**: Check if the Network Security Group (NSG) allows inbound traffic on port 22. Verify your SSH private key matches the public key on the VM.
*   **Docker Pull Failed**: Ensure the VM has the correct permissions to pull from ACR (Managed Identity or Service Principal). Check `ansible/roles/app-deploy/tasks/main.yml` for login steps.
*   **Database Connection Failed**: Check the `.env` file on the server (`/opt/devops-app/.env`) and ensure the database credentials are correct.
