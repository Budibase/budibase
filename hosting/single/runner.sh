redis-server --requirepass $REDIS_PASSWORD &
/opt/clouseau/bin/clouseau &
/minio/minio server /minio &
/docker-entrypoint.sh /opt/couchdb/bin/couchdb &
/etc/init.d/nginx restart
pushd app
pm2 start --name app "yarn run:docker"
popd
pushd worker
pm2 start --name worker "yarn run:docker"
popd
sleep 10
URL=http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@localhost:5984
curl -X PUT ${URL}/_users
curl -X PUT ${URL}/_replicator
sleep infinity