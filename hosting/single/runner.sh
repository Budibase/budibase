redis-server --requirepass $REDIS_PASSWORD &
/opt/clouseau/bin/clouseau &
/minio/minio server /minio &
/docker-entrypoint.sh /opt/couchdb/bin/couchdb &
/etc/init.d/nginx restart
if [[ ! -z "${CUSTOM_DOMAIN}" ]]; then
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