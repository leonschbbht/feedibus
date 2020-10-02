output "public-ip-id" {
  value = azurerm_public_ip.feedibus-public-ip.id
}
output "public-ssh-key" {
  value = tls_private_key.feedibus-ssh.public_key_openssh
}