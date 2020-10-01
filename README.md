# Feedibus Packer Pipeline

## v0.1
* Die Packer Pipeline provisioniert ein AMI (Azure Machine Image) mit grundlegender Konfiguration
* Die Konfiguration umfasst u.A.:
    * Firewall
    * crontab Einträge
    * Docker
    * Docker-Compose
    * Docker-Compose File zum automatisierten Deployment
    * Initialisierungsskripte