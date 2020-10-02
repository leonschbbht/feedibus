output "resource-group-name" {
  value = azurerm_resource_group.feedibus-production.name
}

output "ressource-group-location" {
  value = azurerm_resource_group.feedibus-production.location
}

output "image-storage-account-id" {
  value = azurerm_storage_account.ami-storage-account.id
}