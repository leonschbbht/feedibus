resource "azurerm_virtual_machine" "feedibus-production-vm" {
  location = var.location
  name = "feedibus-production-vm"
  network_interface_ids = [var.network-interface-id]
  resource_group_name = var.resource-group-name
  delete_os_disk_on_termination = true
  vm_size = "Standard_B1ls"

  storage_image_reference {
    id = data.azurerm_image.feedibus-production-baseimage-data.id
  }
  storage_os_disk {
    create_option = "FromImage"
    name = "production-disk"
  }
  os_profile {
    computer_name  = "feedibus-production"
    admin_username = "feedibus-admin"
    admin_password = "Password1234!"
  }
  os_profile_linux_config {
    disable_password_authentication = false
  }

  tags = {
    location = var.location
    environment = var.environment
  }
}

resource "azurerm_public_ip" "feedibus-public-ip" {
  name                = "PublicIP-001"
  resource_group_name = var.resource-group-name
  location            = var.location
  allocation_method   = "Static"

  tags = {
    location = var.location
    environment = var.environment
  }
}

data "azurerm_image" "feedibus-production-baseimage-data" {
  name = "feedibus-production-baseimage"
  resource_group_name = var.resource-group-name
}