# Local TLS Redis

This setup starts a local Redis instance that requires:

- TLS (`rediss://`)
- ACL username
- ACL password

It is intended for reproducing Budibase Redis connection issues locally.

## 1. Generate local certs

```bash
chmod +x hosting/redis-tls/generate-certs.sh
./hosting/redis-tls/generate-certs.sh
```

## 2. Start Redis with Docker

```bash
docker compose -f hosting/docker-compose.redis-tls.yaml up -d
```

Optional custom credentials:

```bash
REDIS_TLS_USERNAME=aaa REDIS_TLS_PASSWORD=bbb REDIS_TLS_PORT=6381 docker compose -f hosting/docker-compose.redis-tls.yaml up -d
```

## 3. Point Budibase at it

Update your local `.env`:

```env
REDIS_URL=rediss://localhost:6381
REDIS_USERNAME=aaa
REDIS_PASSWORD=bbb
```

## 4. Quick connectivity test

Use the real Redis CLI inside the container:

```bash
docker exec -it budi-redis-tls-dev redis-cli --tls --cacert /certs/ca.crt -h localhost -p 6379 --user aaa -a bbb ping
```

Expected result:

```text
PONG
```

## 5. Stop it

```bash
docker compose -f hosting/docker-compose.redis-tls.yaml down -v
```
