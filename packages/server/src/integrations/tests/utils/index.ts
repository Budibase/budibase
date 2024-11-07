import "./images"
import { Datasource, SourceName } from "@budibase/types"
import * as postgres from "./postgres"
import * as mongodb from "./mongodb"
import * as mysql from "./mysql"
import * as mssql from "./mssql"
import * as mariadb from "./mariadb"
import * as oracle from "./oracle"
import { testContainerUtils } from "@budibase/backend-core/tests"

export type DatasourceProvider = () => Promise<Datasource>

export const { startContainer } = testContainerUtils

export enum DatabaseName {
  POSTGRES = "postgres",
  MONGODB = "mongodb",
  MYSQL = "mysql",
  SQL_SERVER = "mssql",
  MARIADB = "mariadb",
  ORACLE = "oracle",
}

const providers: Record<DatabaseName, DatasourceProvider> = {
  [DatabaseName.POSTGRES]: postgres.getDatasource,
  [DatabaseName.MONGODB]: mongodb.getDatasource,
  [DatabaseName.MYSQL]: mysql.getDatasource,
  [DatabaseName.SQL_SERVER]: mssql.getDatasource,
  [DatabaseName.MARIADB]: mariadb.getDatasource,
  [DatabaseName.ORACLE]: oracle.getDatasource,
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
    case SourceName.ORACLE: {
      return oracle.knexClient(ds)
    }
    default: {
      throw new Error(`Unsupported source: ${ds.source}`)
    }
  }
}
