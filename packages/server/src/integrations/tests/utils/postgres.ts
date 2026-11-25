import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait } from "testcontainers"
import { generator, testContainerUtils } from "@budibase/backend-core/tests"
import { startContainer } from "."
import knex, { Knex } from "knex"
import { POSTGRES_IMAGE, POSTGRES_LEGACY_IMAGE } from "./images"

let ports: Promise<testContainerUtils.Port[]>

// The TLS certificate names this host only. It resolves to loopback (RFC
// 6761), and it can't be "localhost": a client connecting to an IP without a
// server name has the certificate checked against "localhost".
export const TLS_HOSTNAME = "db.localhost"
const TLS_DIR = "/tls"

// Creates a CA and a server certificate the first time the container starts,
// then starts Postgres with TLS on. Plain connections still work.
const TLS_ENTRYPOINT = [
  "set -e",
  `if [ ! -f ${TLS_DIR}/server.crt ]; then`,
  `mkdir -p ${TLS_DIR} && cd ${TLS_DIR}`,
  `printf '[req]\\ndistinguished_name=dn\\nx509_extensions=ca\\nprompt=no\\n[dn]\\nCN=Budibase Test CA\\n[ca]\\nbasicConstraints=critical,CA:true\\nkeyUsage=critical,keyCertSign,cRLSign\\n' > ca.cnf`,
  `printf 'subjectAltName=DNS:${TLS_HOSTNAME}\\nextendedKeyUsage=serverAuth\\n' > server.ext`,
  "openssl req -x509 -newkey rsa:2048 -nodes -days 3650 -config ca.cnf -keyout ca.key -out ca.crt",
  `openssl req -newkey rsa:2048 -nodes -subj /CN=${TLS_HOSTNAME} -keyout server.key -out server.csr`,
  "openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -days 3650 -extfile server.ext -out server.crt",
  // Postgres refuses a key file that its own user does not own.
  "chown postgres ca.crt server.crt server.key && chmod 600 server.key",
  "cd /",
  "fi",
  `exec docker-entrypoint.sh postgres -c ssl=on -c ssl_cert_file=${TLS_DIR}/server.crt -c ssl_key_file=${TLS_DIR}/server.key`,
].join("\n")

async function datasourceWithImage({
  image,
  tls,
}: {
  image: string
  tls: boolean
}): Promise<Datasource> {
  if (!ports) {
    let container = new GenericContainer(image)
      .withExposedPorts(5432)
      .withEnvironment({ POSTGRES_PASSWORD: "password" })
      .withWaitStrategy(
        // Legacy Postgres images can be slow to initialize on CI/arm64
        // Increase startup timeout to reduce flakiness
        Wait.forSuccessfulCommand(
          "pg_isready -h localhost -p 5432"
        ).withStartupTimeout(20000)
      )
    if (tls) {
      container = container
        .withEntrypoint(["sh", "-c"])
        .withCommand([TLS_ENTRYPOINT])
    }
    ports = startContainer(container)
  }

  const port = (await ports).find(x => x.container === 5432)?.host
  if (!port) {
    throw new Error("Postgres port not found")
  }

  const datasource: Datasource = {
    type: "datasource_plus",
    source: SourceName.POSTGRES,
    plus: true,
    config: {
      host: "127.0.0.1",
      port,
      database: "postgres",
      user: "postgres",
      password: "password",
      schema: "public",
      ssl: false,
      rejectUnauthorized: false,
      ca: false,
    },
  }

  const database = generator.guid().replaceAll("-", "")
  const client = await knexClient(datasource)
  await client.raw(`CREATE DATABASE "${database}"`)
  datasource.config!.database = database

  return datasource
}

export async function getDatasource(): Promise<Datasource> {
  return datasourceWithImage({ image: POSTGRES_IMAGE, tls: true })
}

export async function getLegacyDatasource(): Promise<Datasource> {
  return datasourceWithImage({ image: POSTGRES_LEGACY_IMAGE, tls: false })
}

export async function getTlsCa(datasource: Datasource): Promise<string> {
  const client = await knexClient(datasource)
  try {
    const { rows } = await client.raw(
      `SELECT pg_read_file('${TLS_DIR}/ca.crt') AS ca`
    )
    return rows[0].ca
  } finally {
    await client.destroy()
  }
}

export async function knexClient(
  ds: Datasource,
  opts?: Knex.Config
): Promise<Knex> {
  if (!ds.config) {
    throw new Error("Datasource config is missing")
  }
  if (ds.source !== SourceName.POSTGRES) {
    throw new Error("Datasource source is not Postgres")
  }

  return knex({
    client: "pg",
    connection: ds.config,
    ...opts,
  })
}
