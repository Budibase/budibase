import fetch from "node-fetch"
import * as setup from "../api/routes/tests/utilities"
import { Datasource, FieldType } from "@budibase/types"
import {
  DatabaseName,
  getDatasource,
  rawQuery,
} from "../integrations/tests/utils"
import { generator } from "@budibase/backend-core/tests"
import { tableForDatasource } from "../../src/tests/utilities/structures"
import { Knex } from "knex"
// @ts-ignore
fetch.mockSearch()

function uniqueTableName(length?: number): string {
  return generator
    .guid()
    .replaceAll("-", "_")
    .substring(0, length || 10)
}

const config = setup.getConfig()!

jest.mock("../websockets", () => ({
  clientAppSocket: jest.fn(),
  gridAppSocket: jest.fn(),
  initialise: jest.fn(),
  builderSocket: {
    emitTableUpdate: jest.fn(),
    emitTableDeletion: jest.fn(),
    emitDatasourceUpdate: jest.fn(),
    emitDatasourceDeletion: jest.fn(),
    emitScreenUpdate: jest.fn(),
    emitAppMetadataUpdate: jest.fn(),
    emitAppPublish: jest.fn(),
  },
}))

describe("mysql integrations", () => {
  let rawDatasource: Datasource
  let datasource: Datasource
  let client: Knex

  beforeAll(async () => {
    await config.init()

    rawDatasource = await getDatasource(DatabaseName.MYSQL)
    datasource = await config.api.datasource.create(rawDatasource)
  })

  afterAll(config.end)

  it("validate table schema", async () => {
    // Creating a table so that `entities` is populated.
    await config.api.table.save(tableForDatasource(datasource))
    const res = await config.api.datasource.get(datasource._id!)
    expect(res).toEqual({
      config: {
        database: expect.any(String),
        host: datasource.config!.host,
        password: "--secret-value--",
        port: datasource.config!.port,
        user: "root",
      },
      plus: true,
      source: "MYSQL",
      type: "datasource_plus",
      isSQL: true,
      _id: expect.any(String),
      _rev: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      entities: expect.any(Object),
    })
  })

  describe("Integration compatibility with mysql search_path", () => {
    let datasource: Datasource, rawDatasource: Datasource
    const database = generator.guid()
    const database2 = generator.guid()

    beforeAll(async () => {
      rawDatasource = await getDatasource(DatabaseName.MYSQL)

      await rawQuery(rawDatasource, `CREATE DATABASE \`${database}\`;`)
      await rawQuery(rawDatasource, `CREATE DATABASE \`${database2}\`;`)

      const pathConfig: any = {
        ...rawDatasource,
        config: {
          ...rawDatasource.config!,
          database,
        },
      }
      datasource = await config.api.datasource.create(pathConfig)
    })

    afterAll(async () => {
      await rawQuery(rawDatasource, `DROP DATABASE \`${database}\`;`)
      await rawQuery(rawDatasource, `DROP DATABASE \`${database2}\`;`)
    })

    it("discovers tables from any schema in search path", async () => {
      await rawQuery(
        rawDatasource,
        `CREATE TABLE \`${database}\`.table1 (id1 SERIAL PRIMARY KEY);`
      )
      const res = await config.api.datasource.info(datasource)
      expect(res.tableNames).toBeDefined()
      expect(res.tableNames).toEqual(expect.arrayContaining(["table1"]))
    })

    it("does not mix columns from different tables", async () => {
      const repeated_table_name = "table_same_name"
      await rawQuery(
        rawDatasource,
        `CREATE TABLE \`${database}\`.${repeated_table_name} (id SERIAL PRIMARY KEY, val1 TEXT);`
      )
      await rawQuery(
        rawDatasource,
        `CREATE TABLE \`${database2}\`.${repeated_table_name} (id2 SERIAL PRIMARY KEY, val2 TEXT);`
      )

      const res = await config.api.datasource.fetchSchema({
        datasourceId: datasource._id!,
        tablesFilter: [repeated_table_name],
      })
      expect(res.datasource.entities![repeated_table_name].schema).toBeDefined()
      const schema = res.datasource.entities![repeated_table_name].schema
      expect(Object.keys(schema).sort()).toEqual(["id", "val1"])
    })
  })

  describe("POST /api/datasources/:datasourceId/schema", () => {
    let tableName: string

    beforeEach(async () => {
      tableName = uniqueTableName()
    })

    afterEach(async () => {
      await rawQuery(rawDatasource, `DROP TABLE IF EXISTS \`${tableName}\``)
    })

    it("recognises enum columns as options", async () => {
      const enumColumnName = "status"

      const createTableQuery = `
        CREATE TABLE \`${tableName}\` (
          \`order_id\` INT AUTO_INCREMENT PRIMARY KEY,
          \`customer_name\` VARCHAR(100) NOT NULL,
          \`${enumColumnName}\` ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled')
        );
      `

      await rawQuery(rawDatasource, createTableQuery)

      const res = await config.api.datasource.fetchSchema({
        datasourceId: datasource._id!,
      })

      const table = res.datasource.entities![tableName]

      expect(table).toBeDefined()
      expect(table.schema[enumColumnName].type).toEqual(FieldType.OPTIONS)
    })
  })
})
