# Security Practices

This document outlines the security measures implemented in the DevOps Pipeline Project, covering infrastructure, application, and pipeline security.

## DevSecOps Pipeline

We integrate security at every stage of the CI/CD pipeline ("Shift Left").

| Stage | Tool | Purpose |
|-------|------|---------|
| **Code** | TruffleHog | Scans for hardcoded secrets and credentials. |
| **Code** | CodeQL | Static Application Security Testing (SAST) for code vulnerabilities. |
| **Dependencies** | npm audit | Checks for vulnerabilities in Node.js dependencies. |
| **Infrastructure** | tfsec / Checkov | Scans Terraform code for misconfigurations. |
| **Infrastructure** | Ansible Lint | Checks Ansible playbooks for best practices. |
| **Build** | Trivy | Scans Docker images for OS and library vulnerabilities. |
| **Deploy** | OWASP ZAP | Dynamic Application Security Testing (DAST) against running app. |

## Infrastructure Security

### Azure Resources
*   **Network Security Groups (NSG)**: Implements a whitelist-only approach. Only essential ports (22, 80, 443) are open.
*   **Managed Identities**: Used where possible to avoid managing credentials.
*   **Azure Container Registry**: Private registry with authentication required for pulling images.

### Server Hardening (Ansible)
The `security` Ansible role implements the following:
*   **UFW Firewall**: Configured to deny incoming traffic by default and allow only specific ports.
*   **Fail2ban**: Protects against brute-force attacks on SSH.
*   **Auto-Updates**: Configured for automatic security updates.
*   **System Limits**: Configured `pam_limits` to prevent DoS via resource exhaustion.
*   **SSH Hardening**: Password authentication is disabled (SSH keys only).

## Application Security

*   **Containerization**: Applications run in isolated Docker containers.
*   **Non-Root Users**: Containers are configured to run as non-root users where possible.
*   **Environment Variables**: Sensitive configuration (DB passwords, API keys) is injected via environment variables, never hardcoded.

## Secrets Management

*   **GitHub Secrets**: All sensitive credentials (Azure Service Principal, SSH keys, DB passwords) are stored in GitHub Secrets.
*   **Terraform Sensitive Variables**: Terraform variables containing secrets are marked as `sensitive` to prevent them from being displayed in logs.
*   **Ansible Vault** (Optional): Can be used for encrypting sensitive Ansible variables.

## Monitoring and Incident Response

*   **System Monitoring**: `prometheus-node-exporter` and `sysstat` are installed for resource monitoring.
*   **Logging**: Docker logs are configured with rotation (`json-file` driver with max-size/max-file) to prevent disk exhaustion.
*   **Health Checks**: Automated health check endpoints (`/health`) are monitored.

## Compliance

*   **IaC Scanning**: Ensures infrastructure meets compliance standards (e.g., CIS benchmarks) before provisioning.
*   **Image Scanning**: Prevents deployment of containers with critical vulnerabilities.
