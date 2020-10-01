#!/bin/bash -eux

sudo apt -y remove --purge ansible
sudo apt-add-repository --remove ppa:ansible/ansible

sudo apt -y autoremove
sudo apt -y update
