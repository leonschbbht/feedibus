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
  access_policy {
    object_id = data.azurerm_client_config.current-config.object_id
    tenant_id = data.azurerm_client_config.current-config.tenant_id
    key_permissions = [
    "create",
    "get",
    "decrypt",
    "delete",
    "encrypt",
    "import",
    "list",
    "purge",
    "recover",
    "restore",
    "sign",
    "update",
    "verify",
    ]
    secret_permissions = [
    "set",
    "get",
    "delete",
    "create",
    "list",
    "purge",
    "recover",
    "regeneratekey",
    "update"
    ]
  }
  tags = {
    environment = var.environment
    tfmanaged = var.tfmanaged
  }
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