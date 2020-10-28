#!/bin/bash

function configure_firewall {
  echo "Konfiguriere Firewall - Externer Zugriff"
  #Firewall Regeln zurücksetzen
  iptables -F

  #Bereits bestehende Verbindungen bleiben bestehen
  iptables -A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT

  #Regeln für Zugriff von außen (port 80, port 443)
  sudo iptables -A INPUT -p tcp -m tcp --dport 22 -j ACCEPT
  sudo iptables -A INPUT -p tcp -m tcp --dport 80 -j ACCEPT
  sudo iptables -A INPUT -p tcp -m tcp --dport 443 -j ACCEPT


  #Loopback erlauben
  iptables -A INPUT -s 127.0.0.1 -j ACCEPT

  #Alle nicht zutreffenden verbindung verweigern
  iptables -A INPUT -j DROP

  #Regeln für Forwarding
  iptables -A FORWARD -j DROP

  #Regeln für Output
  iptables -A OUTPUT -j ACCEPT

  #Sichern der festgelegten Regeln (package: iptables-persistent regelt wiederherstellung beim Neustart)
  iptables-save > /etc/iptables/rules.v4
}

function start_docker {
  echo "Starte Docker Umgebung"
  service docker start
  cd /opt
  docker-compose pull -q && docker-compose up -d
}

function install_certbot {
  echo "Installiere Certbot"
  certbot -n --nginx --redirect --agree-tos --email leon.schoenhoff@bbht.de -d feedibus.huemmelinkcloud.de
}

function docker_login {
  echo "Creating docker session"
  echo $1 | docker login docker.pkg.github.com -u leonschbbht --password-stdin
}

echo "Diese skript führt abschließende Schritte für die Vorbereitung der Cloudumgebung aus"

configure_firewall
service nexus start
install_certbot
docker_login
start_docker