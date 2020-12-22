module "general" {
  source = "./general"
  location = var.location
  tfmanaged = var.tfmanaged
  environment = var.environment
  public-ssh-key = module.secrets.public-ssh-key
  private-ssh-key = module.secrets.private-ssh-key
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
  tls-private-key-pem = module.secrets.tls-private-key-pem
  public_key_openssh = module.secrets.public_key_openssh
  dockertoken = var.dockertoken
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
  feedibus-production-vm-id = module.machine.feedibus-production-vm-id
  location = var.location
}

module "secrets" {
  source = "./secrets"
}
