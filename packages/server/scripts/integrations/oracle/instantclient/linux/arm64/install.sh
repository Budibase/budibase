#!/bin/bash 

# Must be root to continue
if [[ $(id -u) -ne 0 ]] ; then echo "Please run as root" ; exit 1 ; fi

# Allow for re-runs
rm -rf /opt/oracle

echo "Installing oracle instant client"

# copy and unzip package
mkdir -p /opt/oracle
cp scripts/integrations/oracle/instantclient/linux/arm64/basiclite-19.10.zip /opt/oracle
cd /opt/oracle
unzip -qq basiclite-19.10.zip -d .
rm *.zip
mv instantclient* instantclient

# update runtime link path
sh -c "echo /opt/oracle/instantclient > /etc/ld.so.conf.d/oracle-instantclient.conf"
ldconfig /etc/ld.so.conf.d

echo "Installation complete"
