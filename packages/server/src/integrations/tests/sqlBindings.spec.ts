const postgresQuery = jest.fn(async () => ({ rows: [] }))
const mysqlQuery = jest.fn(async () => [[], []])
const mssqlInput = jest.fn()
const mssqlQuery = jest.fn(async () => ({ recordset: [] }))
const oracleExecute = jest.fn(async () => ({ rows: [] }))
const snowflakeExecute = jest.fn()

jest.mock("pg", () => ({
  Client: jest.fn(() => ({
    connect: jest.fn(),
    query: postgresQuery,
    end: (callback: () => void) => callback(),
  })),
}))

jest.mock("mysql2/promise", () => ({
  __esModule: true,
  default: {
    createConnection: async () => ({ query: mysqlQuery, end: jest.fn() }),
  },
}))

jest.mock("mssql", () => ({
  __esModule: true,
  default: {
    ConnectionPool: jest.fn(() => ({
      connect: async () => ({
        request: () => ({ input: mssqlInput, query: mssqlQuery }),
      }),
    })),
  },
}))

jest.mock("oracledb", () => ({
  __esModule: true,
  default: {
    getConnection: async () => ({ execute: oracleExecute, close: jest.fn() }),
  },
}))

jest.mock("snowflake-sdk", () => ({
  __esModule: true,
  default: {
    createConnection: () => ({
      connect: (callback: () => void) => callback(),
      execute: snowflakeExecute,
      isUp: () => true,
    }),
  },
}))

jest.mock("../../sdk", () => ({
  __esModule: true,
  default: {
    queries: jest.requireActual("../../sdk/workspace/queries/queries"),
  },
}))

jest.mock("../../sdk/utils", () => ({
  getEnvironmentVariables: async () => ({}),
}))

import type { SqlDatasource } from "@budibase/types"
import { SourceName } from "@budibase/types"
import postgres from "../postgres"
import mysql from "../mysql"
import mssql from "../microsoftSqlServer"
import oracle from "../oracle"
import snowflake from "../snowflake"
import { interpolateSQL } from "../queries/sql"
import { enrichParameters } from "../../sdk/workspace/queries/queries"

interface ConnectorCase {
  source: SourceName
  create: () => SqlDatasource
  numericStrings: boolean
  assertBindings: (bindings: (string | number | null)[]) => void
}

const connectors: ConnectorCase[] = [
  {
    source: SourceName.POSTGRES,
    create: () =>
      new postgres.integration({
        host: "example.com",
        port: 5432,
        database: "database",
        user: "user",
        password: "password",
        schema: "public",
      }),
    numericStrings: true,
    assertBindings: bindings =>
      expect(postgresQuery).toHaveBeenLastCalledWith(
        "SELECT $1, $2, $3, $4, $5, $6, $7",
        bindings
      ),
  },
  {
    source: SourceName.MYSQL,
    create: () =>
      new mysql.integration({ database: "database", rejectUnauthorized: true }),
    numericStrings: false,
    assertBindings: bindings =>
      expect(mysqlQuery).toHaveBeenLastCalledWith(
        "SELECT ?, ?, ?, ?, ?, ?, ?",
        bindings
      ),
  },
  {
    source: SourceName.SQL_SERVER,
    create: () =>
      new mssql.integration({
        server: "example.com",
        port: 1433,
        database: "database",
        user: "user",
        password: "password",
        schema: "dbo",
      }),
    numericStrings: true,
    assertBindings: bindings => {
      expect(mssqlInput.mock.calls).toEqual(
        bindings.map((value, index) => [`p${index}`, value])
      )
      expect(mssqlQuery).toHaveBeenLastCalledWith(
        "SELECT @p0, @p1, @p2, @p3, @p4, @p5, @p6"
      )
    },
  },
  {
    source: SourceName.ORACLE,
    create: () =>
      new oracle.integration({
        host: "example.com",
        port: 1521,
        database: "database",
        user: "user",
        password: "password",
      }),
    numericStrings: true,
    assertBindings: bindings =>
      expect(oracleExecute).toHaveBeenLastCalledWith(
        "SELECT :1, :2, :3, :4, :5, :6, :7",
        bindings,
        expect.any(Object)
      ),
  },
  {
    source: SourceName.SNOWFLAKE,
    create: () =>
      new snowflake.integration({
        account: "account",
        username: "user",
        password: "password",
        privateKey: "",
        authenticator: "",
        warehouse: "warehouse",
        database: "database",
        schema: "public",
      }),
    numericStrings: true,
    assertBindings: bindings =>
      expect(snowflakeExecute).toHaveBeenLastCalledWith(
        expect.objectContaining({
          sqlText: "SELECT ?, ?, ?, ?, ?, ?, ?",
          binds: bindings,
        })
      ),
  },
]

describe.each(connectors)(
  "SQL binding driver contract ($source)",
  connector => {
    beforeEach(() => {
      jest.clearAllMocks()
      snowflakeExecute.mockImplementation(({ complete }) =>
        complete(undefined, undefined, [])
      )
    })

    it.each([false, true])(
      "distinguishes null, text, blank, numeric zero and missing values with nullDefaultSupport=%s",
      async nullDefaultSupport => {
        const integration = connector.create()
        const parameters = await enrichParameters({
          parameters: {
            native: null,
            text: "null",
            blank: "",
            zero: 0,
            zeroText: "0",
            number: "42",
          },
        })
        const query = await interpolateSQL(
          connector.source,
          {
            sql: "SELECT {{ native }}, {{ text }}, {{ blank }}, {{ zero }}, {{ zeroText }}, {{ number }}, {{ missing }}",
            bindings: [],
          },
          parameters,
          integration,
          { nullDefaultSupport }
        )

        await integration.read?.(query)

        const blank = nullDefaultSupport ? null : ""
        const zero = connector.numericStrings ? "0" : 0
        const number = connector.numericStrings ? "42" : 42
        connector.assertBindings([
          null,
          "null",
          blank,
          zero,
          zero,
          number,
          blank,
        ])
      }
    )
  }
)
