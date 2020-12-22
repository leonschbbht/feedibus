output "public-ip-id" {
  value = azurerm_public_ip.feedibus-public-ip.id
}


output "feedibus-production-vm-id" {
  value = azurerm_linux_virtual_machine.feedibus-production-virtual.id
}
