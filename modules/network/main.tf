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
  }
}

resource "azurerm_network_security_group" "ssh-rule" {
  name                = "acceptanceTestSecurityGroup1"
  location            = var.resource-group-location
  resource_group_name = var.resource-group-name

  security_rule {
    name                       = "SSH"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Deny"
    protocol                   = "Tcp"
    source_port_range          = "22"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

resource "azurerm_network_security_group" "http-rule" {
  name                = "acceptanceTestSecurityGroup1"
  location            = var.resource-group-location
  resource_group_name = var.resource-group-name

  security_rule {
    name                       = "HTTP"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "80"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

resource "azurerm_network_security_group" "https-rule" {
  name                = "acceptanceTestSecurityGroup1"
  location            = var.resource-group-location
  resource_group_name = var.resource-group-name

  security_rule {
    name                       = "HTTP"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "443"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}