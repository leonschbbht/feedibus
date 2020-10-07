resource "azurerm_linux_virtual_machine_scale_set" "feedibus-production-virtual" {
  admin_username = "feedibus-admin"
  instances = 1
  location = var.location
  name = "feedibus-production"
  resource_group_name = var.resource-group-name
  sku = "Standard_B1ls"
  upgrade_mode = "Automatic"
  network_interface {
    name = "feedibus-production-scale-set-network-interface"
    ip_configuration {
      name = "feedibus-production-ip-config"
      subnet_id = var.subnet-id
      public_ip_address {
        name = "feedibus-production-scale-set-public-ip"
      }
    }
  }
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

resource "azurerm_monitor_autoscale_setting" "feedibus-autoscale-policy" {
  location = var.location
  name = "feedibus-autoscale-policy"
  resource_group_name = var.resource-group-name
  target_resource_id = azurerm_linux_virtual_machine_scale_set.feedibus-production-virtual.id
  profile {
    name = "DefaultScaleProfile"
    capacity {
      default = 1
      maximum = 10
      minimum = 1
    }
    rule {
      metric_trigger {
        metric_name = "Percentage CPU"
        metric_resource_id = azurerm_linux_virtual_machine_scale_set.feedibus-production-virtual.id
        operator = "GreaterThan"
        statistic = "Average"
        threshold = 80
        time_aggregation = "Average"
        time_grain = "PT1M"
        time_window = "PT10M"
      }
      scale_action {
        cooldown = "PT1M"
        direction = "Increase"
        type = "ChangeCount"
        value = 1
      }
    }
    rule {
      metric_trigger {
        metric_name = "Percentage CPU"
        metric_resource_id = azurerm_linux_virtual_machine_scale_set.feedibus-production-virtual.id
        operator = "LessThan"
        statistic = "Average"
        threshold = 30
        time_aggregation = "Average"
        time_grain = "PT1M"
        time_window = "PT5M"
      }
      scale_action {
        cooldown = "PT1M"
        direction = "Decrease"
        type = "ChangeCount"
        value = 1
      }
    }
  }
  notification {
    email {
      send_to_subscription_administrator = true
      send_to_subscription_co_administrator = true
      custom_emails = ["j.huemmelink@gmail.com"]
    }
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
  resource_group_name = "packer-provision"
}

resource "tls_private_key" "feedibus-ssh" {
  algorithm = "RSA"
  rsa_bits = 4096
}

resource "null_resource" "init-script-execution" {
  depends_on = [azurerm_linux_virtual_machine_scale_set.feedibus-production-virtual]
  connection {
    type = "ssh"
    host = azurerm_public_ip.feedibus-public-ip.ip_address
    private_key = tls_private_key.feedibus-ssh.private_key_pem
    user = "feedibus-admin"
  }
  provisioner "remote-exec" {
    inline = [
      "sudo chmod a+rwx /init.sh",
      "sudo /init.sh"
    ]
  }
}