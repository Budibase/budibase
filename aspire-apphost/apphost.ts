import { createBuilder, refExpr } from './.modules/aspire.js';

const builder = await createBuilder();
const generatedSecret = {
    minLength: 24,
    lower: true,
    upper: true,
    numeric: true,
    special: false,
    minUpper: 2,
    minNumeric: 2,
};
const generatedIdentifier = {
    minLength: 12,
    lower: true,
    upper: true,
    numeric: true,
    special: false,
    minUpper: 1,
    minNumeric: 1,
};

async function getHostAndPort(endpointPromise: Promise<{ host: { get(): Promise<string> }, port: { get(): Promise<number> } }>)
{
    const endpoint = await endpointPromise;
    const host = await endpoint.host.get();
    const port = await endpoint.port.get();
    return `${host}:${port}`;
}

const apiEncryptionKey = await builder.addParameterWithGeneratedValue('api-encryption-key', generatedSecret, { secret: true, persist: true });
const encryptionKey = await builder.addParameterWithGeneratedValue('encryption-key', generatedSecret, { secret: true, persist: true });
const jwtSecret = await builder.addParameterWithGeneratedValue('jwt-secret', generatedSecret, { secret: true, persist: true });
const minioAccessKey = await builder.addParameterWithGeneratedValue('minio-access-key', generatedIdentifier, { secret: true, persist: true });
const minioSecretKey = await builder.addParameterWithGeneratedValue('minio-secret-key', generatedSecret, { secret: true, persist: true });
const couchDbUser = await builder.addParameterWithValue('couch-db-user', 'budibase');
const couchDbPassword = await builder.addParameterWithGeneratedValue('couch-db-password', generatedSecret, { secret: true, persist: true });
const redisPassword = await builder.addParameterWithGeneratedValue('redis-password', generatedSecret, { secret: true, persist: true });
const internalApiKey = await builder.addParameterWithGeneratedValue('internal-api-key', generatedSecret, { secret: true, persist: true });
const litellmMasterKey = await builder.addParameterWithGeneratedValue('litellm-master-key', generatedSecret, { secret: true, persist: true });
const litellmSaltKey = await builder.addParameterWithGeneratedValue('litellm-salt-key', generatedSecret, { secret: true, persist: true });
const litellmDbUser = await builder.addParameterWithValue('litellm-db-user', 'llmproxy');
const litellmDbName = await builder.addParameterWithValue('litellm-db-name', 'litellm');
const litellmDbPassword = await builder.addParameterWithGeneratedValue('litellm-db-password', generatedSecret, { secret: true, persist: true });
const adminEmail = await builder.addParameterWithValue('bb-admin-user-email', 'local@budibase.com');
const adminPassword = await builder.addParameterWithGeneratedValue('bb-admin-user-password', generatedSecret, { secret: true, persist: true });

const litellmDb = await builder.addContainer('litellm-db', 'postgres:16');
await litellmDb.withContainerNetworkAlias('litellm-db');
await litellmDb.withEnvironment('POSTGRES_DB', litellmDbName);
await litellmDb.withEnvironment('POSTGRES_USER', litellmDbUser);
await litellmDb.withEnvironment('POSTGRES_PASSWORD', litellmDbPassword);
await litellmDb.withBindMount('./data/litellm-db', '/var/lib/postgresql/data');
await litellmDb.withEndpoint({ port: 5432, targetPort: 5432, name: 'postgres' });

const litellm = await builder.addContainer('litellm-service', 'ghcr.io/berriai/litellm:main-v1.81.14-stable');
await litellm.withContainerNetworkAlias('litellm-service');
await litellm.withBindMount('../hosting/litellm_config.yaml', '/app/config.yaml');
await litellm.withEnvironment('STORE_MODEL_IN_DB', 'True');
await litellm.withEnvironment('LITELLM_REASONING_AUTO_SUMMARY', 'true');
await litellm.withEnvironment('LITELLM_MASTER_KEY', litellmMasterKey);
await litellm.withEnvironment('LITELLM_SALT_KEY', litellmSaltKey);
await litellm.withEnvironment('DATABASE_URL', refExpr`postgresql://${litellmDbUser}:${litellmDbPassword}@litellm-db:5432/${litellmDbName}`);
await litellm.withArgs(['--config', '/app/config.yaml']);
await litellm.withHttpEndpoint({ port: 4000, targetPort: 4000 });
await litellm.waitFor(litellmDb);

const minio = await builder.addContainer('minio-service', 'minio/minio:latest');
await minio.withContainerNetworkAlias('minio-service');
await minio.withEnvironment('MINIO_ACCESS_KEY', minioAccessKey);
await minio.withEnvironment('MINIO_SECRET_KEY', minioSecretKey);
await minio.withEnvironment('MINIO_BROWSER', 'off');
await minio.withArgs(['server', '/data', '--console-address', ':9001']);
await minio.withBindMount('./data/minio', '/data');
await minio.withHttpEndpoint({ port: 4004, targetPort: 9000 });

const minioUrl = await minio.getEndpoint('http');

const couchDb = await builder.addContainer('couchdb-service', 'budibase/database:2.1.0');
await couchDb.withContainerNetworkAlias('couchdb-service');
await couchDb.withEnvironment('COUCHDB_PASSWORD', couchDbPassword);
await couchDb.withEnvironment('COUCHDB_USER', couchDbUser);
await couchDb.withEnvironment('TARGETBUILD', 'docker-compose');
await couchDb.withEnvironment('DATA_DIR', '/data');
await couchDb.withBindMount('./data/couchdb', '/data');
await couchDb.withEndpoint({ port: 4005, targetPort: 5984, name: 'couchdb' });
await couchDb.withEndpoint({ port: 4006, targetPort: 4984, name: 'sqs' });

const redis = await builder.addContainer('redis-service', 'redis:latest');
await redis.withContainerNetworkAlias('redis-service');
await redis.withEnvironment('REDIS_PASSWORD', redisPassword);
await redis.withArgs(['sh', '-c', 'exec redis-server --requirepass "$REDIS_PASSWORD"']);
await redis.withBindMount('./data/redis', '/data');
await redis.withEndpoint({ port: 6379, targetPort: 6379, name: 'redis' });
const litellmUrl = await litellm.getEndpoint('http');

const stringTemplates = await builder.addExecutable(
    'string-templates-dev',
    'corepack',
    '../packages/string-templates',
    ['yarn', 'dev'],
);

const client = await builder.addExecutable(
    'client-dev',
    'corepack',
    '../packages/client',
    ['yarn', 'dev'],
);
await client.waitFor(stringTemplates);

const builderDev = await builder.addExecutable(
    'builder-dev',
    'corepack',
    '../packages/builder',
    ['yarn', 'dev:vite', '--', '--port', '3100'],
);
await builderDev.waitFor(stringTemplates);
await builderDev.withHttpEndpoint({ port: 3100, name: 'builder', isProxied: false });

const worker = await builder.addExecutable(
    'worker-service',
    'corepack',
    '../packages/worker',
    ['yarn', 'dev'],
);
await worker.withEnvironment('SELF_HOSTED', '1');
await worker.withEnvironment('WORKER_PORT', '4002');
await worker.withEnvironment('PORT', '4002');
await worker.withEnvironment('CLUSTER_PORT', '10000');
await worker.withEnvironment('JWT_SECRET', jwtSecret);
await worker.withEnvironment('ENCRYPTION_KEY', encryptionKey);
await worker.withEnvironment('API_ENCRYPTION_KEY', apiEncryptionKey);
await worker.withEnvironment('INTERNAL_API_KEY', internalApiKey);
await worker.withEnvironment('MINIO_ACCESS_KEY', minioAccessKey);
await worker.withEnvironment('MINIO_SECRET_KEY', minioSecretKey);
await worker.withEnvironment('MINIO_URL', minioUrl);
await worker.withEnvironment('REDIS_PASSWORD', redisPassword);
await worker.withEnvironment('COUCH_DB_USERNAME', couchDbUser);
await worker.withEnvironment('COUCH_DB_USER', couchDbUser);
await worker.withEnvironment('COUCH_DB_PASSWORD', couchDbPassword);
await worker.withEnvironment('DISABLE_ACCOUNT_PORTAL', '1');
await worker.withEnvironment('LITELLM_URL', litellmUrl);
await worker.withEnvironment('LITELLM_MASTER_KEY', litellmMasterKey);
await worker.withEnvironmentCallback(async (ctx) => {
    const redisHostAndPort = await getHostAndPort(redis.getEndpoint('redis'));
    const couchDbHostAndPort = await getHostAndPort(couchDb.getEndpoint('couchdb'));
    await ctx.environmentVariables.set('REDIS_URL', redisHostAndPort);
    await ctx.environmentVariables.set('COUCH_DB_URL', refExpr`http://${couchDbUser}:${couchDbPassword}@${couchDbHostAndPort}`);
});
await worker.withHttpEndpoint({ port: 4002, isProxied: false });
await worker.waitFor(redis);
await worker.waitFor(minio);
await worker.waitFor(couchDb);
await worker.waitFor(litellm);

const app = await builder.addExecutable(
    'app-service',
    'corepack',
    '../packages/server',
    ['yarn', 'exec', 'nodemon'],
);
await app.withEnvironment('SELF_HOSTED', '1');
await app.withEnvironment('APPS_PORT', '4001');
await app.withEnvironment('PORT', '4001');
await app.withEnvironment('JWT_SECRET', jwtSecret);
await app.withEnvironment('ENCRYPTION_KEY', encryptionKey);
await app.withEnvironment('API_ENCRYPTION_KEY', apiEncryptionKey);
await app.withEnvironment('INTERNAL_API_KEY', internalApiKey);
await app.withEnvironment('MINIO_ACCESS_KEY', minioAccessKey);
await app.withEnvironment('MINIO_SECRET_KEY', minioSecretKey);
await app.withEnvironment('MINIO_URL', minioUrl);
await app.withEnvironment('REDIS_PASSWORD', redisPassword);
await app.withEnvironment('COUCH_DB_USERNAME', couchDbUser);
await app.withEnvironment('COUCH_DB_USER', couchDbUser);
await app.withEnvironment('COUCH_DB_PASSWORD', couchDbPassword);
await app.withEnvironment('WORKER_URL', await worker.getEndpoint('http'));
await app.withEnvironment('BUDIBASE_ENVIRONMENT', 'PRODUCTION');
await app.withEnvironment('BB_ADMIN_USER_EMAIL', adminEmail);
await app.withEnvironment('BB_ADMIN_USER_PASSWORD', adminPassword);
await app.withEnvironment('LITELLM_URL', litellmUrl);
await app.withEnvironment('LITELLM_MASTER_KEY', litellmMasterKey);
await app.withEnvironmentCallback(async (ctx) => {
    const redisHostAndPort = await getHostAndPort(redis.getEndpoint('redis'));
    const couchDbHostAndPort = await getHostAndPort(couchDb.getEndpoint('couchdb'));
    await ctx.environmentVariables.set('REDIS_URL', redisHostAndPort);
    await ctx.environmentVariables.set('COUCH_DB_URL', refExpr`http://${couchDbUser}:${couchDbPassword}@${couchDbHostAndPort}`);
});
await app.withHttpEndpoint({ port: 4001, isProxied: false });
await app.waitFor(client);
await app.waitFor(worker);
await app.waitFor(redis);
await app.waitFor(minio);
await app.waitFor(couchDb);
await app.waitFor(litellm);

const proxy = await builder.addContainer('proxy-service', 'nginx:latest');
await proxy.withContainerNetworkAlias('proxy-service');
await proxy.withEnvironment('NGINX_ENVSUBST_OUTPUT_DIR', '/etc/nginx');
await proxy.withEnvironment('PROXY_ADDRESS', 'host.docker.internal');
await proxy.withBindMount('./nginx.dev.conf', '/etc/nginx/templates/nginx.conf.template');
await proxy.withBindMount('../hosting/proxy/error.html', '/usr/share/nginx/html/error.html');
await proxy.withHttpEndpoint({ port: 10000, targetPort: 10000 });
await proxy.withExternalHttpEndpoints();
await proxy.waitFor(builderDev);
await proxy.waitFor(app);
await proxy.waitFor(worker);
await proxy.waitFor(minio);
await proxy.waitFor(couchDb);

await worker.withEnvironment('APPS_URL', await app.getEndpoint('http'));
await worker.withEnvironment('PLATFORM_URL', await proxy.getEndpoint('http'));
await app.withEnvironment('PLATFORM_URL', await proxy.getEndpoint('http'));

await builder.build().run();
