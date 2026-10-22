import knex, { type Knex } from "knex"
import { GenericContainer, Wait, type WaitStrategy } from "testcontainers"
import { getContainerRuntimeClient } from "testcontainers/build/container-runtime"
import { AbstractWaitStrategy } from "testcontainers/build/wait-strategies/wait-strategy"

import { type Datasource, SourceName } from "@budibase/types"
import { generator, testContainerUtils } from "@budibase/backend-core/tests"
import { startContainer } from "."

let ports: Promise<testContainerUtils.Port[]>

const startupTimeoutMs = 90000
const startupAttempts = 3
export const testTimeoutMs = startupTimeoutMs * startupAttempts + 90000

// password needs to conform to Oracle standards
const password = "password"

class OracleWaitStrategy extends AbstractWaitStrategy {
  async waitUntilReady(
    ...[container, boundPorts, startTime]: Parameters<
      WaitStrategy["waitUntilReady"]
    >
  ) {
    const deadline = Date.now() + this.startupTimeoutMs
    // The PDB opens before startup finishes resetting SYSTEM's password.
    await Wait.forLogMessage("DATABASE IS READY TO USE!")
      .withStartupTimeout(this.startupTimeoutMs)
      .waitUntilReady(container, boundPorts, startTime)

    const command = `sqlplus -L -s /nolog <<'SQL'
WHENEVER OSERROR EXIT FAILURE
WHENEVER SQLERROR EXIT FAILURE
CONNECT SYSTEM/${password}@//127.0.0.1:1521/FREEPDB1
SELECT 1 FROM dual;
EXIT SUCCESS
SQL`
    const client = await getContainerRuntimeClient()
    let output = ""
    do {
      const result = await client.container.exec(container, [
        "/bin/sh",
        "-c",
        command,
      ])
      if (result.exitCode === 0) {
        return
      }
      output = result.output
      await new Promise(resolve => setTimeout(resolve, 1000))
    } while (Date.now() < deadline)

    throw new Error(`Oracle readiness check failed: ${output.trim()}`)
  }
}

export async function getDatasource(): Promise<Datasource> {
  if (!ports) {
    // couldn't build 19.3.0 for X64
    let image = "budibase/oracle-database:23.2-slim-faststart"
    if (process.arch.startsWith("arm")) {
      // there isn't an ARM compatible 23.2 build
      image = "budibase/oracle-database:19.3.0-ee-slim-faststart"
    }

    ports = startContainer(
      new GenericContainer(image)
        .withExposedPorts(1521)
        .withEnvironment({
          ORACLE_PASSWORD: password,
        })
        .withWaitStrategy(
          new OracleWaitStrategy().withStartupTimeout(startupTimeoutMs)
        ),
      { maxAttempts: startupAttempts }
    )
  }

  const port = (await ports).find(x => x.container === 1521)?.host
  if (!port) {
    throw new Error("Oracle port not found")
  }

  const host = "127.0.0.1"
  const user = "SYSTEM"

  const datasource: Datasource = {
    type: "datasource_plus",
    source: SourceName.ORACLE,
    plus: true,
    config: { host, port, user, password, database: "FREEPDB1" },
  }

  const newUser = "a" + generator.guid().replaceAll("-", "")
  const client = await knexClient(datasource)
  await client.raw(`CREATE USER ${newUser} IDENTIFIED BY password`)
  await client.raw(
    `GRANT CONNECT, RESOURCE, CREATE VIEW, CREATE SESSION TO ${newUser}`
  )
  await client.raw(`GRANT UNLIMITED TABLESPACE TO ${newUser}`)
  datasource.config!.user = newUser

  return datasource
}

export async function knexClient(ds: Datasource, opts?: Knex.Config) {
  if (!ds.config) {
    throw new Error("Datasource config is missing")
  }
  if (ds.source !== SourceName.ORACLE) {
    throw new Error("Datasource source is not Oracle")
  }

  const db = ds.config.database || "FREEPDB1"
  const connectString = `${ds.config.host}:${ds.config.port}/${db}`

  const c = knex({
    client: "oracledb",
    connection: {
      connectString,
      user: ds.config.user,
      password: ds.config.password,
    },
    ...opts,
  })

  return c
}
