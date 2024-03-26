jest.unmock("pg")

import { Datasource } from "@budibase/types"
import { postgres } from "./postgres"
import { mongodb } from "./mongodb"
import { mysql } from "./mysql"
import { mssql } from "./mssql"
import { mariadb } from "./mariadb"

export type DatasourceProvider = () => Promise<Datasource>

export enum DatabaseName {
  POSTGRES = "postgres",
  MONGODB = "mongodb",
  MYSQL = "mysql",
  SQL_SERVER = "mssql",
  MARIADB = "mariadb",
}

const providers: Record<DatabaseName, DatasourceProvider> = {
  [DatabaseName.POSTGRES]: postgres,
  [DatabaseName.MONGODB]: mongodb,
  [DatabaseName.MYSQL]: mysql,
  [DatabaseName.SQL_SERVER]: mssql,
  [DatabaseName.MARIADB]: mariadb,
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

export const databaseTestProviders = {
  postgres,
  mongodb,
  mysql,
  mssql,
  mariadb,
}
