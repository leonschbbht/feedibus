provider "azurerm" {
  features {}
}

terraform {
  backend "azurerm" {
    resource_group_name = "terraform-remote"
    storage_account_name = "tfstorefeedibus001"
    container_name = "tfrmcontainer"
    key = "terraform.tfstate"
  }
}

module "modules" {
  source = "./modules"
  location = var.location
  tfmanaged = var.tfmanaged
  environment = var.environment
}