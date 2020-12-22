resource "tls_private_key" "feedibus-ssh" {
  algorithm = "RSA"
  rsa_bits = 4096
}
