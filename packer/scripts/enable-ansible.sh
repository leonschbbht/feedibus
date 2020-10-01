#!/bin/bash -eux

sudo apt -y update && sudo apt-get -y upgrade
sudo apt -y install software-properties-common
sudo apt-add-repository ppa:ansible/ansible

sudo apt -y update
sudo apt -y install python3 ansible
