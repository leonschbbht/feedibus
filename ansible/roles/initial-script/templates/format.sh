#!/bin/bash

echo "Dieses Skript wird die externe Festplatte formatieren oder einhängen"

function createMountPoint {
  VOLUME="/dev/sdb"
  DEVICE_INFO=`file -Ls $VOLUME`
  MOUNTPATH="/mnt/extension"

  if [ "$DEVICE_INFO" == "$VOLUME: data" ]; then
    echo "Formatiere Laufwerk $VOLUME"
    mkfs -t xfs $VOLUME
    echo "$VOLUME /mnt/extension xfs noatime 0 0" >> /etc/fstab
    docker volume create --name database --opt type=none --opt device=/mnt/extension/database --opt o=bind
  fi

  mkdir -p $MOUNTPATH
  mount $VOLUME $MOUNTPATH
}

createMountPoint
