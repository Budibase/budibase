jest.unmock("pg")

import { Datasource } from "@budibase/types"
import * as postgres from "./postgres"
import * as mongodb from "./mongodb"
import * as mysql from "./mysql"
import * as s3 from "./s3"
import { StartedTestContainer } from "testcontainers"

jest.setTimeout(30000)

export interface DatabaseProvider {
  start(): Promise<StartedTestContainer>
  stop(): Promise<void>
  datasource(): Promise<Datasource>
}

export const databaseTestProviders = { postgres, mongodb, mysql, s3 }
