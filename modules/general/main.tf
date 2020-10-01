resource "azurerm_resource_group" "feedibus-production" {
  location = var.location
  name = "feedibus-production"

  tags = {
    tfmanaged = var.tfmanaged
    environment = var.environment
  }
}

resource "azurerm_storage_account" "ami-storage-account" {
  account_replication_type = "LRS"
  account_tier = "Standard"
  location = var.location
  name = "ami-storage-account-feedibus-001001"
  resource_group_name = azurerm_resource_group.feedibus-production

  tags = {
    environment = var.environment
    tfmangaged = var.tfmanaged
    location = var.location
  }
}

resource "azurerm_storage_container" "ami-storage-container" {
  name = "feedibus-production-ami-storage"
  storage_account_name = azurerm_storage_account.ami-storage-account.name
}