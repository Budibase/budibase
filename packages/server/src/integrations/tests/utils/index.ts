jest.unmock("pg")

import { Datasource } from "@budibase/types"
import * as postgres from "./postgres"
import * as mongodb from "./mongodb"
import * as mysql from "./mysql"
import * as minio from "./minio"
import * as mssql from "./mssql"
import * as mariadb from "./mariadb"
import { StartedTestContainer } from "testcontainers"

jest.setTimeout(30000)

export interface DatabaseProvider {
  start(): Promise<StartedTestContainer>
  stop(): Promise<void>
  datasource(): Promise<Datasource>
}

export const objectStoreTestProviders = { minio }
export const databaseTestProviders = {
  postgres,
  mongodb,
  mysql,
  mssql,
  mariadb,
}
