import "./images"
import { Datasource, SourceName } from "@budibase/types"
import * as postgres from "./postgres"
import * as mongodb from "./mongodb"
import * as mysql from "./mysql"
import * as mssql from "./mssql"
import * as mariadb from "./mariadb"
import * as oracle from "./oracle"
import { GenericContainer, StartedTestContainer } from "testcontainers"
import { testContainerUtils } from "@budibase/backend-core/tests"
import cloneDeep from "lodash/cloneDeep"
import { Knex } from "knex"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { create } from "lodash"

export type DatasourceProvider = () => Promise<Datasource | undefined>

export enum DatabaseName {
  POSTGRES = "postgres",
  MONGODB = "mongodb",
  MYSQL = "mysql",
  SQL_SERVER = "mssql",
  MARIADB = "mariadb",
  ORACLE = "oracle",
  SQS = "sqs",
}

const providers: Record<DatabaseName, DatasourceProvider> = {
  [DatabaseName.POSTGRES]: postgres.getDatasource,
  [DatabaseName.MONGODB]: mongodb.getDatasource,
  [DatabaseName.MYSQL]: mysql.getDatasource,
  [DatabaseName.SQL_SERVER]: mssql.getDatasource,
  [DatabaseName.MARIADB]: mariadb.getDatasource,
  [DatabaseName.ORACLE]: oracle.getDatasource,
  [DatabaseName.SQS]: async () => undefined,
}

export interface DatasourceDescribeOpts {
  name: string
  only?: DatabaseName[]
  exclude?: DatabaseName[]
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

export function datasourceDescribe(
  opts: DatasourceDescribeOpts,
  cb: (args: DatasourceDescribeReturn) => void
) {
  if (process.env.DATASOURCE === "none") {
    createDummyTest()
    return
  }

  const { name, only, exclude } = opts

  if (only && exclude) {
    throw new Error("you can only supply one of 'only' or 'exclude'")
  }

  let databases = Object.values(DatabaseName)
  if (only) {
    databases = only
  } else if (exclude) {
    databases = databases.filter(db => !exclude.includes(db))
  }

  if (process.env.DATASOURCE) {
    databases = databases.filter(db => db === process.env.DATASOURCE)
  }

  if (databases.length === 0) {
    createDummyTest()
    return
  }

  describe.each(databases)(name, name => {
    const config = new TestConfiguration()

    afterAll(() => {
      config.end()
    })

    cb({
      name,
      config,
      dsProvider: () => createDatasources(config, name),
      isInternal: name === DatabaseName.SQS,
      isExternal: name !== DatabaseName.SQS,
      isSql: [
        DatabaseName.MARIADB,
        DatabaseName.MYSQL,
        DatabaseName.POSTGRES,
        DatabaseName.SQL_SERVER,
        DatabaseName.ORACLE,
      ].includes(name),
      isMySQL: name === DatabaseName.MYSQL,
      isPostgres: name === DatabaseName.POSTGRES,
      isMongodb: name === DatabaseName.MONGODB,
      isMSSQL: name === DatabaseName.SQL_SERVER,
      isOracle: name === DatabaseName.ORACLE,
    })
  })
}

function getDatasource(
  sourceName: DatabaseName
): Promise<Datasource | undefined> {
  return providers[sourceName]()
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
