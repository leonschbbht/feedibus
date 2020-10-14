output "public-ip-id" {
  value = azurerm_public_ip.feedibus-public-ip.id
}
output "public-ssh-key" {
  value = tls_private_key.feedibus-ssh.public_key_openssh
}

output "private-ssh-key" {
  value = tls_private_key.feedibus-ssh.private_key_pem
}

output "feedibus-production-vm-id" {
  value = azurerm_linux_virtual_machine.feedibus-production-virtual.id
}