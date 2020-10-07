output "network-interface-id" {
  value = azurerm_network_interface.feedibus-interface.id
}
output "subnet-id" {
  value = azurerm_subnet.feedibus-subnet.id
}
output "security-group-id" {
  value = azurerm_network_security_group.feedibus-security-group.id
}

output "network-interface-name" {
  value = azurerm_network_interface.feedibus-interface.name
}