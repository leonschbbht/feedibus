module "general" {
  source = "./general"
  location = var.location
  tfmanaged = var.tfmanaged
  environment = var.environment
  public-ssh-key = module.machine.public-ssh-key
  private-ssh-key = module.machine.private-ssh-key
}

module "machine" {
  source = "./machine"
  location = var.location
  network-interface-id = module.network.network-interface-id
  resource-group-name = module.general.resource-group-name
  environment = var.environment
  image-storage-account-id = module.general.image-storage-account-id
  subnet-id = module.network.subnet-id
  security-group-id = module.network.security-group-id
  network-interface-name = module.network.network-interface-name
}

module "network" {
  source = "./network"
  location = var.location
  tfmanaged = var.tfmanaged
  environment = var.environment
  resource-group-name = module.general.resource-group-name
  resource-group-location = module.general.ressource-group-location
  public-ip-id = module.machine.public-ip-id
}

module "metric" {
  source = "./metric"
  resource-group-name = module.general.resource-group-name
  location = var.location
}