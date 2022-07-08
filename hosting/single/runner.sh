redis-server --requirepass $REDIS_PASSWORD &
/opt/clouseau/bin/clouseau &
/minio/minio server /data/minio &
/docker-entrypoint.sh /opt/couchdb/bin/couchdb &
/etc/init.d/nginx restart
if [[ ! -z "${CUSTOM_DOMAIN}" ]]; then
    # Add monthly cron job to renew certbot certificate
    echo -n "* * 2 * * root exec /app/letsencrypt/certificate-renew.sh ${CUSTOM_DOMAIN}" >> /etc/cron.d/certificate-renew
    chmod +x /etc/cron.d/certificate-renew
    # Request the certbot certificate
    /app/letsencrypt/certificate-request.sh ${CUSTOM_DOMAIN}
fi

/etc/init.d/nginx restart
pushd app
pm2 start --name app "yarn run:docker"
popd
pushd worker
pm2 start --name worker "yarn run:docker"
popd
sleep 10
curl -X PUT ${COUCH_DB_URL}/_users
curl -X PUT ${COUCH_DB_URL}/_replicator
sleep infinity
