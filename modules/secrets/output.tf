output "tls-private-key-pem" {
  value = tls_private_key.feedibus-ssh.private_key_pem
  sensitive = true
}

output "public-ssh-key" {
  value = tls_private_key.feedibus-ssh.public_key_openssh
  sensitive = true
}

output "private-ssh-key" {
  value = tls_private_key.feedibus-ssh.private_key_pem
  sensitive = true
}

output "public_key_openssh" {
  value = tls_private_key.feedibus-ssh.public_key_openssh
  sensitive = true
}
