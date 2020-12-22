variable "location" {}
variable "tfmanaged" {}
variable "environment" {}
variable "public-ssh-key" {
  sensitive = true
}
variable "private-ssh-key" {
  sensitive = true
}
