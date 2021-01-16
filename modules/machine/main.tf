
resource "azurerm_linux_virtual_machine" "feedibus-production-virtual" {
  admin_username        = "feedibus-admin"
  location              = var.location
  name                  = "feedibus-production"
  network_interface_ids = [var.network-interface-id]
  resource_group_name   = var.resource-group-name
  size                  = "Standard_B1s"

  admin_ssh_key {
    public_key = var.public_key_openssh
    username   = "feedibus-admin"
  }

  os_disk {
    caching              = "ReadWrite"
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
    location    = var.location
    environment = var.environment
  }
}

data "azurerm_image" "feedibus-production-baseimage-data" {
  name                = "feedibus-production-baseimage"
  resource_group_name = "packer-provision"
}



resource "null_resource" "init-script-execution" {
  depends_on = [
    azurerm_linux_virtual_machine.feedibus-production-virtual,
  null_resource.format-script-execution]
  connection {
    type        = "ssh"
    host        = azurerm_linux_virtual_machine.feedibus-production-virtual.public_ip_address
    private_key = var.tls-private-key-pem
    user        = "feedibus-admin"
  }
  provisioner "remote-exec" {
    inline = [
      "sudo chmod a+rwx /init.sh",
      "sudo /init.sh ${var.dockertoken}"
    ]
  }
}

resource "null_resource" "format-script-execution" {
  depends_on = [azurerm_linux_virtual_machine.feedibus-production-virtual, azurerm_virtual_machine_data_disk_attachment.feedibus-production-persistence-drive-attachment]
  connection {
    type        = "ssh"
    host        = azurerm_linux_virtual_machine.feedibus-production-virtual.public_ip_address
    private_key = var.tls-private-key-pem
    user        = "feedibus-admin"
  }
  provisioner "remote-exec" {
    inline = [
      "sudo chmod a+rwx /format.sh",
      "sudo /format.sh"
    ]
  }
}

// External drive for data persistence
resource "azurerm_managed_disk" "feedibus-production-persistence-drive" {
  create_option        = "Empty"
  location             = var.location
  name                 = "disk2"
  resource_group_name  = var.resource-group-name
  storage_account_type = "Standard_LRS"
  disk_size_gb         = 15
}

resource "azurerm_virtual_machine_data_disk_attachment" "feedibus-production-persistence-drive-attachment" {
  caching            = "ReadWrite"
  lun                = "10"
  managed_disk_id    = azurerm_managed_disk.feedibus-production-persistence-drive.id
  virtual_machine_id = azurerm_linux_virtual_machine.feedibus-production-virtual.id
}
