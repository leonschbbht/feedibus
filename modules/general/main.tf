resource "azurerm_resource_group" "feedibus-production" {
  location = var.location
  name = "feedibus-production-set"

  tags = {
    tfmanaged = var.tfmanaged
    environment = var.environment
  }
}

resource "azurerm_storage_account" "ami-storage-account" {
  account_replication_type = "LRS"
  account_tier = "Standard"
  location = var.location
  name = "amistoragefeedibus"
  resource_group_name = azurerm_resource_group.feedibus-production.name

  tags = {
    environment = var.environment
    tfmangaged = var.tfmanaged
    location = var.location
  }
}

data "azurerm_client_config" "current-config" {}

resource "azurerm_key_vault" "feedibus-secrets" {
  location = var.location
  name = "feedibus-secrets"
  resource_group_name = azurerm_resource_group.feedibus-production.name
  sku_name = "premium"
  tenant_id = data.azurerm_client_config.current-config.tenant_id
  soft_delete_enabled = true

  tags = {
    environment = var.environment
    tfmanaged = var.tfmanaged
  }
}

resource "azurerm_key_vault_access_policy" "user-access" {
  key_vault_id = azurerm_key_vault.feedibus-secrets.id
  object_id = "5b27d3de-1950-4e5f-80c8-e1bab1124eed"
  tenant_id = "a9256992-1ff2-44b5-8d87-23bf464c95cc"
  key_permissions = ["create", "get", "decrypt", "delete", "encrypt", "import", "list", "purge", "recover", "restore", "sign", "update", "verify"]
  secret_permissions = ["backup", "delete", "get", "list", "purge", "recover", "restore", "set"]
}

resource "azurerm_key_vault_access_policy" "app-access" {
  key_vault_id = azurerm_key_vault.feedibus-secrets.id
  object_id = data.azurerm_client_config.current-config.object_id
  tenant_id = data.azurerm_client_config.current-config.tenant_id
  key_permissions = ["create", "get", "decrypt", "delete", "encrypt", "import", "list", "purge", "recover", "restore", "sign", "update", "verify"]
  secret_permissions = ["backup", "delete", "get", "list", "purge", "recover", "restore", "set"]
}

resource "azurerm_key_vault_secret" "public-ssh-key" {
  key_vault_id = azurerm_key_vault.feedibus-secrets.id
  name = "public-ssh-key-secret"
  value = var.public-ssh-key
}

resource "azurerm_key_vault_secret" "private-ssh-key" {
  key_vault_id = azurerm_key_vault.feedibus-secrets.id
  name = "private-ssh-key-secret"
  value = var.private-ssh-key
}