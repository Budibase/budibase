import { Datasource, SourceName } from "@budibase/types"
import * as postgres from "./postgres"
import * as mongodb from "./mongodb"
import * as mysql from "./mysql"
import * as mssql from "./mssql"
import * as mariadb from "./mariadb"
import { GenericContainer } from "testcontainers"
import { testContainerUtils } from "@budibase/backend-core/tests"

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

export async function rawQuery(ds: Datasource, sql: string): Promise<any> {
  switch (ds.source) {
    case SourceName.POSTGRES: {
      return postgres.rawQuery(ds, sql)
    }
    case SourceName.MYSQL: {
      return mysql.rawQuery(ds, sql)
    }
    case SourceName.SQL_SERVER: {
      return mssql.rawQuery(ds, sql)
    }
    default: {
      throw new Error(`Unsupported source: ${ds.source}`)
    }
  }
}

export async function startContainer(container: GenericContainer) {
  container = container.withReuse().withLabels({ "com.budibase": "true" })

  const startedContainer = await container.start()

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
