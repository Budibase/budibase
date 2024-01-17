#!/usr/bin/env bash
healthy=true

if [ -f "/data/.env" ]; then
  export $(cat /data/.env | xargs)
elif [ -f "/home/.env" ]; then
  export $(cat /home/.env | xargs)
else
  echo "No .env file found"
  healthy=false
fi

if [[ $(curl -Lfk -s -w "%{http_code}\n" http://localhost/ -o /dev/null) -ne 200 ]]; then
  echo 'ERROR: Budibase is not running';
  healthy=false
fi

if [[ $(curl -s -w "%{http_code}\n" http://localhost:4001/health -o /dev/null) -ne 200 ]]; then
    echo 'ERROR: Budibase backend is not running';
    healthy=false
fi

if [[ $(curl -s -w "%{http_code}\n" http://localhost:4002/health -o /dev/null) -ne 200 ]]; then
    echo 'ERROR: Budibase worker is not running';
    healthy=false
fi

if [[ $(curl -s -w "%{http_code}\n" http://localhost:5984/_up -o /dev/null) -ne 200 ]]; then
    echo 'ERROR: CouchDB is not running';
    healthy=false
fi
if [[ $(redis-cli -a $REDIS_PASSWORD --no-auth-warning  ping) != 'PONG' ]]; then
    echo 'ERROR: Redis is down';
    healthy=false
fi
# mino, clouseau, 
nginx -t -q
NGINX_STATUS=$?

if [[ $NGINX_STATUS -gt 0 ]]; then
    echo 'ERROR: Nginx config problem';
    healthy=false
fi

if [ $healthy == true ]; then
  exit 0
else
  exit 1
fi
