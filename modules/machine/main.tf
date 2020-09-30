resource "azurerm_virtual_machine" "feedibus-production-vm" {
  location = var.location
  name = "feedibus-production-vm"
  network_interface_ids = [var.network-interface-id]
  resource_group_name = var.resource-group-name
  vm_size = "Standard_B1ls"
  storage_os_disk {
    create_option = "FromImage"
    name = "default"
  }
}