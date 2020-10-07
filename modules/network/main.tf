resource "azurerm_virtual_network" "feedibus-network" {
  address_space = ["10.0.0.0/16"]
  location = var.location
  name = "feedibus-network"
  resource_group_name = var.resource-group-name
}

resource "azurerm_subnet" "feedibus-subnet" {
  name = "local-network"
  resource_group_name = var.resource-group-name
  virtual_network_name = azurerm_virtual_network.feedibus-network.name
  address_prefixes = ["10.0.2.0/24"]
}

resource "azurerm_network_interface" "feedibus-interface" {
  location = var.resource-group-location
  name = "feedibus-network-interface"
  resource_group_name = var.resource-group-name
  ip_configuration {
    name = "ip-configuration"
    subnet_id = azurerm_subnet.feedibus-subnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id = var.public-ip-id
  }
}

resource "azurerm_network_security_group" "feedibus-security-group" {
  name                = "feedibus-security-group"
  location            = var.resource-group-location
  resource_group_name = var.resource-group-name

  security_rule {
    name                       = "SSH"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
  security_rule {
    name                       = "HTTP"
    priority                   = 120
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
  security_rule {
    name                       = "HTTPS"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

resource "azurerm_network_interface_security_group_association" "feedibus-security-group-association" {
  network_interface_id = azurerm_network_interface.feedibus-interface.id
  network_security_group_id = azurerm_network_security_group.feedibus-security-group.id
}