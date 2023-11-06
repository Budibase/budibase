#!/bin/bash
apt-get install -y gnupg
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor | tee /usr/share/keyrings/nodesource.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
apt-get update
echo "INSTALLING NODE $NODE_MAJOR"
apt-get install -y --no-install-recommends nodejs
npm install --global yarn pm2