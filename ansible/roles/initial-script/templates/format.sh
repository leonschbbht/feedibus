#!/bin/bash

echo "Dieses Skript wird die externe Festplatte formatieren oder einhängen"

echo "Anzahl der Parameter: " $#

VOLUMESIZE=

if [ $# -ne 1 ];
  then
    echo "Größe des Volumes muss übergeben werden!"
    exit -1
  else
    VOLUMESIZE=$1
fi

function createMountPoint {

  VOLUME="/dev/$(lsblk | grep "${VOLUMESIZE}G" | cut -c1-3)"
  echo $1
  DEVICE_INFO=`file -Ls $VOLUME`
  MOUNTPATH="/persistence"

  if [ "$DEVICE_INFO" == "$VOLUME: data" ]; then
    echo "Formatiere Laufwerk $VOLUME"
    mkfs -t xfs $VOLUME

    mount $VOLUME $MOUNTPATH
  fi

  service docker start
  docker volume create --name database --opt type=none --opt device=$MOUNTPATH/database --opt o=bind
  service docker stop
  mkdir -p $MOUNTPATH
  umount $MOUNTPATH > /dev/null 2>&1 || /bin/true
  mount $VOLUME $MOUNTPATH
  echo $VOLUME erfolgreich auf $MOUNTPATH eingehangen!
}

echo "$VOLUME $MOUNTPATH xfs noatime 0 0" >> /etc/fstab
createMountPoint
service docker start
