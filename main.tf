terraform {
  backend "azurerm" {
    resource_group_name = "terraform-remote"
    storage_account_name = "tfstorefeedibus001"
    container_name = "tfrmcontainer"
    key = "terraform.tfstate"
  }
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
    }
  }
}

provider "azurerm" {
  features {}
}

module "modules" {
  source = "./modules"
  location = var.location
  tfmanaged = var.tfmanaged
  environment = var.environment
  dockertoken = var.dockertoken
}
