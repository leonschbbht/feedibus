resource "azurerm_linux_virtual_machine" "feedibus-production-virtual" {
  depends_on = ["module.modules.module.general.azurerm_key_vault.feedibus-secrets"]
  admin_username = "feedibus-admin"
  location = var.location
  name = "feedibus-production"
  network_interface_ids = [var.network-interface-id]
  resource_group_name = var.resource-group-name
  size = "Standard_B1ls"

  admin_ssh_key {
    public_key = tls_private_key.feedibus-ssh.public_key_openssh
    username = "feedibus-admin"
  }

  os_disk {
    caching = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }
  source_image_id = data.azurerm_image.feedibus-production-baseimage-data.id
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
  resource_group_name = "packer-provision"
}

resource "tls_private_key" "feedibus-ssh" {
  algorithm = "RSA"
  rsa_bits = 4096
}

resource "null_resource" "init-script-execution" {
  depends_on = [azurerm_linux_virtual_machine.feedibus-production-virtual]
  connection {
    type = "ssh"
    host = azurerm_linux_virtual_machine.feedibus-production-virtual.public_ip_address
    private_key = tls_private_key.feedibus-ssh.private_key_pem
    user = "feedibus-admin"
  }
  provisioner "remote-exec" {
    inline = [
      "sudo chmod a+rwx /init.sh",
      "sudo ./init.sh"
    ]
  }
}