import "./images"
import { Datasource, SourceName } from "@budibase/types"
import * as postgres from "./postgres"
import * as mongodb from "./mongodb"
import * as mysql from "./mysql"
import * as mssql from "./mssql"
import * as mariadb from "./mariadb"
import * as oracle from "./oracle"
import * as elasticsearch from "./elasticsearch"
import * as dynamodb from "./dynamodb"
import { testContainerUtils } from "@budibase/backend-core/tests"
import { Knex } from "knex"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"

export type DatasourceProvider = () => Promise<Datasource | undefined>

export const { startContainer } = testContainerUtils

export enum DatabaseName {
  POSTGRES = "postgres",
  POSTGRES_LEGACY = "postgres_legacy",
  MONGODB = "mongodb",
  MYSQL = "mysql",
  SQL_SERVER = "mssql",
  MARIADB = "mariadb",
  ORACLE = "oracle",
  SQS = "sqs",
  ELASTICSEARCH = "elasticsearch",
  DYNAMODB = "dynamodb",
}

const DATASOURCE_PLUS = [
  DatabaseName.POSTGRES,
  DatabaseName.POSTGRES_LEGACY,
  DatabaseName.MYSQL,
  DatabaseName.SQL_SERVER,
  DatabaseName.MARIADB,
  DatabaseName.ORACLE,
  DatabaseName.SQS,
]

const providers: Record<DatabaseName, DatasourceProvider> = {
  // datasource_plus entries
  [DatabaseName.POSTGRES]: postgres.getDatasource,
  [DatabaseName.POSTGRES_LEGACY]: postgres.getLegacyDatasource,
  [DatabaseName.MYSQL]: mysql.getDatasource,
  [DatabaseName.SQL_SERVER]: mssql.getDatasource,
  [DatabaseName.MARIADB]: mariadb.getDatasource,
  [DatabaseName.ORACLE]: oracle.getDatasource,
  [DatabaseName.SQS]: async () => undefined,

  // rest
  [DatabaseName.ELASTICSEARCH]: elasticsearch.getDatasource,
  [DatabaseName.MONGODB]: mongodb.getDatasource,
  [DatabaseName.DYNAMODB]: dynamodb.getDatasource,
}

export interface DatasourceDescribeReturnPromise {
  rawDatasource: Datasource | undefined
  datasource: Datasource | undefined
  client: Knex | undefined
}

export interface DatasourceDescribeReturn {
  name: DatabaseName
  config: TestConfiguration
  dsProvider: () => Promise<DatasourceDescribeReturnPromise>
  isInternal: boolean
  isExternal: boolean
  isSql: boolean
  isMySQL: boolean
  isPostgres: boolean
  isMongodb: boolean
  isMSSQL: boolean
  isOracle: boolean
}

async function createDatasources(
  config: TestConfiguration,
  name: DatabaseName
): Promise<DatasourceDescribeReturnPromise> {
  await config.init()

  const rawDatasource = await getDatasource(name)

  let datasource: Datasource | undefined
  if (rawDatasource) {
    datasource = await config.api.datasource.create(rawDatasource)
  }

  let client: Knex | undefined
  if (rawDatasource) {
    try {
      client = await knexClient(rawDatasource)
    } catch (e) {
      // ignore
    }
  }

  return {
    rawDatasource,
    datasource,
    client,
  }
}

// Jest doesn't allow test files to exist with no tests in them. When we run
// these tests in CI, we break them out by data source, and there are a bunch of
// test files that only run for a subset of data sources, and for the rest of
// them they will be empty test files. Defining a dummy test makes it so that
// Jest doesn't error in this situation.
function createDummyTest() {
  describe("no tests", () => {
    it("no tests", () => {
      // no tests
    })
  })
}

interface OnlyOpts {
  only: DatabaseName[]
}

interface PlusOpts {
  plus: true
  exclude?: DatabaseName[]
}

export type DatasourceDescribeOpts = OnlyOpts | PlusOpts

// If you ever want to rename this function, be mindful that you will also need
// to modify src/tests/filters/index.js to make sure that we're correctly
// filtering datasource/non-datasource tests in CI.
export function datasourceDescribe(opts: DatasourceDescribeOpts) {
  // tests that call this need a lot longer timeouts
  jest.setTimeout(120000)

  if (process.env.DATASOURCE === "none") {
    createDummyTest()
  }

  let databases: DatabaseName[] = []
  if ("only" in opts) {
    databases = opts.only
  } else if ("plus" in opts) {
    databases = Object.values(DatabaseName)
      .filter(db => DATASOURCE_PLUS.includes(db))
      .filter(db => !opts.exclude?.includes(db))
  } else {
    throw new Error("invalid options")
  }

  if (process.env.DATASOURCE) {
    databases = databases.filter(db => db === process.env.DATASOURCE)
  }

  if (databases.length === 0) {
    createDummyTest()
  }

  const config = new TestConfiguration()
  return databases.map(dbName => ({
    dbName,
    config,
    dsProvider: () => createDatasources(config, dbName),
    isInternal: dbName === DatabaseName.SQS,
    isExternal: dbName !== DatabaseName.SQS,
    isSql: [
      DatabaseName.MARIADB,
      DatabaseName.MYSQL,
      DatabaseName.POSTGRES,
      DatabaseName.SQL_SERVER,
      DatabaseName.ORACLE,
    ].includes(dbName),
    isMySQL: dbName === DatabaseName.MYSQL,
    isPostgres:
      dbName === DatabaseName.POSTGRES ||
      dbName === DatabaseName.POSTGRES_LEGACY,
    // check if any of the legacy tags
    isLegacy: dbName === DatabaseName.POSTGRES_LEGACY,
    isMongodb: dbName === DatabaseName.MONGODB,
    isMSSQL: dbName === DatabaseName.SQL_SERVER,
    isOracle: dbName === DatabaseName.ORACLE,
    isMariaDB: dbName === DatabaseName.MARIADB,
    isElasticsearch: dbName === DatabaseName.ELASTICSEARCH,
  }))
}

function getDatasource(
  sourceName: DatabaseName
): Promise<Datasource | undefined> {
  return providers[sourceName]()
}

export async function knexClient(ds: Datasource, opts?: Knex.Config) {
  switch (ds.source) {
    case SourceName.POSTGRES: {
      return postgres.knexClient(ds, opts)
    }
    case SourceName.MYSQL: {
      return mysql.knexClient(ds, opts)
    }
    case SourceName.SQL_SERVER: {
      return mssql.knexClient(ds, opts)
    }
    case SourceName.ORACLE: {
      return oracle.knexClient(ds, opts)
    }
    default: {
      throw new Error(`Unsupported source: ${ds.source}`)
    }
  }
}
