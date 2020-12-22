variable "dockertoken" {
  type = string
  sensitive = true
}

variable "location" {
  default = "UK South"
}
variable "tfmanaged" {
  default = true
}
variable "environment" {
  default = "production"
}
