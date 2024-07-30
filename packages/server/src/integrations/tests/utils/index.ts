import "./images"
import { Datasource, SourceName } from "@budibase/types"
import * as postgres from "./postgres"
import * as mongodb from "./mongodb"
import * as mysql from "./mysql"
import * as mssql from "./mssql"
import * as mariadb from "./mariadb"
import { GenericContainer, StartedTestContainer } from "testcontainers"
import { testContainerUtils } from "@budibase/backend-core/tests"
import cloneDeep from "lodash/cloneDeep"

export type DatasourceProvider = () => Promise<Datasource>

export enum DatabaseName {
  POSTGRES = "postgres",
  MONGODB = "mongodb",
  MYSQL = "mysql",
  SQL_SERVER = "mssql",
  MARIADB = "mariadb",
}

const providers: Record<DatabaseName, DatasourceProvider> = {
  [DatabaseName.POSTGRES]: postgres.getDatasource,
  [DatabaseName.MONGODB]: mongodb.getDatasource,
  [DatabaseName.MYSQL]: mysql.getDatasource,
  [DatabaseName.SQL_SERVER]: mssql.getDatasource,
  [DatabaseName.MARIADB]: mariadb.getDatasource,
}

export function getDatasourceProviders(
  ...sourceNames: DatabaseName[]
): Promise<Datasource>[] {
  return sourceNames.map(sourceName => providers[sourceName]())
}

export function getDatasourceProvider(
  sourceName: DatabaseName
): DatasourceProvider {
  return providers[sourceName]
}

export function getDatasource(sourceName: DatabaseName): Promise<Datasource> {
  return providers[sourceName]()
}

export async function getDatasources(
  ...sourceNames: DatabaseName[]
): Promise<Datasource[]> {
  return Promise.all(sourceNames.map(sourceName => providers[sourceName]()))
}

export async function knexClient(ds: Datasource) {
  switch (ds.source) {
    case SourceName.POSTGRES: {
      return postgres.knexClient(ds)
    }
    case SourceName.MYSQL: {
      return mysql.knexClient(ds)
    }
    case SourceName.SQL_SERVER: {
      return mssql.knexClient(ds)
    }
    default: {
      throw new Error(`Unsupported source: ${ds.source}`)
    }
  }
}

export async function startContainer(container: GenericContainer) {
  const imageName = (container as any).imageName.string as string
  let key: string = imageName
  if (imageName.includes("@sha256")) {
    key = imageName.split("@")[0]
  }
  key = key.replaceAll("/", "-").replaceAll(":", "-")

  container = container
    .withReuse()
    .withLabels({ "com.budibase": "true" })
    .withName(`${key}_testcontainer`)

  let startedContainer: StartedTestContainer | undefined = undefined
  let lastError = undefined
  for (let i = 0; i < 10; i++) {
    try {
      // container.start() is not an idempotent operation, calling `start`
      // modifies the internal state of a GenericContainer instance such that
      // the hash it uses to determine reuse changes. We need to clone the
      // container before calling start to ensure that we're using the same
      // reuse hash every time.
      const containerCopy = cloneDeep(container)
      startedContainer = await containerCopy.start()
      lastError = undefined
      break
    } catch (e: any) {
      lastError = e
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  if (!startedContainer) {
    if (lastError) {
      throw lastError
    }
    throw new Error(`failed to start container: ${imageName}`)
  }

  const info = testContainerUtils.getContainerById(startedContainer.getId())
  if (!info) {
    throw new Error("Container not found")
  }

  // Some Docker runtimes, when you expose a port, will bind it to both
  // 127.0.0.1 and ::1, so ipv4 and ipv6. The port spaces of ipv4 and ipv6
  // addresses are not shared, and testcontainers will sometimes give you back
  // the ipv6 port. There's no way to know that this has happened, and if you
  // try to then connect to `localhost:port` you may attempt to bind to the v4
  // address which could be unbound or even an entirely different container. For
  // that reason, we don't use testcontainers' `getExposedPort` function,
  // preferring instead our own method that guaranteed v4 ports.
  return testContainerUtils.getExposedV4Ports(info)
}
