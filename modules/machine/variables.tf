variable "location" {}
variable "resource-group-name" {}
variable "network-interface-id" {}
variable "environment" {}
variable "image-storage-account-id" {}
variable "subnet-id" {}
variable "security-group-id" {}
variable "network-interface-name" {}
variable "dockertoken" {
  sensitive = true
}
variable "tls-private-key-pem" {
  sensitive = true
}
variable "public_key_openssh" {
  type = string
  sensitive = true
}
