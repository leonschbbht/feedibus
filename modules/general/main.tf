resource "azurerm_resource_group" "feedibus-production" {
  location = var.location
  name = "feedibus-production"

  tags = {
    tfmanaged = var.tfmanaged
    environment = var.environment
  }
}


