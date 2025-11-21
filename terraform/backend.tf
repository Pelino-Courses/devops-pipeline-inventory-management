terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  cloud {
    organization = "devops-lab-2025"

    workspaces {
      name = "devops-pipeline-infrastructure"
    }
  }
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }

  # DO NOT PUT CREDENTIALS HERE
  # Terraform Cloud will inject:
  # ARM_CLIENT_ID
  # ARM_CLIENT_SECRET
  # ARM_TENANT_ID
  # ARM_SUBSCRIPTION_ID
}
