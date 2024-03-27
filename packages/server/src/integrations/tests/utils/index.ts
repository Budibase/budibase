jest.unmock("pg")

import { Datasource, SourceName } from "@budibase/types"
import * as postgres from "./postgres"
import * as mongodb from "./mongodb"
import * as mysql from "./mysql"
import * as mssql from "./mssql"
import * as mariadb from "./mariadb"

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
