import fetch from "node-fetch"
import {
  generateMakeRequest,
  MakeRequestResponse,
} from "../api/routes/public/tests/utils"

import * as setup from "../api/routes/tests/utilities"
import { Datasource, FieldType } from "@budibase/types"
import _ from "lodash"
import { generator } from "@budibase/backend-core/tests"
import {
  DatabaseName,
  getDatasource,
  rawQuery,
} from "../integrations/tests/utils"

// @ts-ignore
fetch.mockSearch()

const config = setup.getConfig()!

jest.mock("../websockets")

describe("postgres integrations", () => {
  let makeRequest: MakeRequestResponse,
    rawDatasource: Datasource,
    datasource: Datasource

  beforeAll(async () => {
    await config.init()
    const apiKey = await config.generateApiKey()

    makeRequest = generateMakeRequest(apiKey, true)

    rawDatasource = await getDatasource(DatabaseName.POSTGRES)
    datasource = await config.api.datasource.create(rawDatasource)
  })

  afterAll(config.end)

  describe("POST /api/datasources/:datasourceId/schema", () => {
    let tableName: string

    beforeEach(async () => {
      tableName = generator.guid().replaceAll("-", "").substring(0, 10)
    })

    afterEach(async () => {
      await rawQuery(rawDatasource, `DROP TABLE IF EXISTS "${tableName}"`)
    })

    it("recognises when a table has no primary key", async () => {
      await rawQuery(rawDatasource, `CREATE TABLE "${tableName}" (id SERIAL)`)

      const response = await config.api.datasource.fetchSchema({
        datasourceId: datasource._id!,
      })

      expect(response.errors).toEqual({
        [tableName]: "Table must have a primary key.",
      })
    })

    it("recognises when a table is using a reserved column name", async () => {
      await rawQuery(
        rawDatasource,
        `CREATE TABLE "${tableName}" (_id SERIAL PRIMARY KEY) `
      )

      const response = await config.api.datasource.fetchSchema({
        datasourceId: datasource._id!,
      })

      expect(response.errors).toEqual({
        [tableName]: "Table contains invalid columns.",
      })
    })

    it("recognises enum columns as options", async () => {
      const tableName = `orders_${generator
        .guid()
        .replaceAll("-", "")
        .substring(0, 6)}`
      const enumColumnName = "status"

      await rawQuery(
        rawDatasource,
        `
        CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
        
        CREATE TABLE ${tableName} (
          order_id SERIAL PRIMARY KEY,
          customer_name VARCHAR(100) NOT NULL,
          ${enumColumnName} order_status
        );
      `
      )

      const response = await config.api.datasource.fetchSchema({
        datasourceId: datasource._id!,
      })

      const table = response.datasource.entities?.[tableName]

      expect(table).toBeDefined()
      expect(table?.schema[enumColumnName].type).toEqual(FieldType.OPTIONS)
    })
  })

  describe("Integration compatibility with postgres search_path", () => {
    let rawDatasource: Datasource,
      datasource: Datasource,
      schema1: string,
      schema2: string

    beforeEach(async () => {
      schema1 = generator.guid().replaceAll("-", "")
      schema2 = generator.guid().replaceAll("-", "")

      rawDatasource = await getDatasource(DatabaseName.POSTGRES)
      const dbConfig = rawDatasource.config!

      await rawQuery(rawDatasource, `CREATE SCHEMA "${schema1}";`)
      await rawQuery(rawDatasource, `CREATE SCHEMA "${schema2}";`)

      const pathConfig: any = {
        ...rawDatasource,
        config: {
          ...dbConfig,
          schema: `${schema1}, ${schema2}`,
        },
      }
      datasource = await config.api.datasource.create(pathConfig)
    })

    afterEach(async () => {
      await rawQuery(rawDatasource, `DROP SCHEMA "${schema1}" CASCADE;`)
      await rawQuery(rawDatasource, `DROP SCHEMA "${schema2}" CASCADE;`)
    })

    it("discovers tables from any schema in search path", async () => {
      await rawQuery(
        rawDatasource,
        `CREATE TABLE "${schema1}".table1 (id1 SERIAL PRIMARY KEY);`
      )
      await rawQuery(
        rawDatasource,
        `CREATE TABLE "${schema2}".table2 (id2 SERIAL PRIMARY KEY);`
      )
      const response = await makeRequest("post", "/api/datasources/info", {
        datasource: datasource,
      })
      expect(response.status).toBe(200)
      expect(response.body.tableNames).toBeDefined()
      expect(response.body.tableNames).toEqual(
        expect.arrayContaining(["table1", "table2"])
      )
    })

    it("does not mix columns from different tables", async () => {
      const repeated_table_name = "table_same_name"
      await rawQuery(
        rawDatasource,
        `CREATE TABLE "${schema1}".${repeated_table_name} (id SERIAL PRIMARY KEY, val1 TEXT);`
      )
      await rawQuery(
        rawDatasource,
        `CREATE TABLE "${schema2}".${repeated_table_name} (id2 SERIAL PRIMARY KEY, val2 TEXT);`
      )

      const response = await config.api.datasource.fetchSchema({
        datasourceId: datasource._id!,
        tablesFilter: [repeated_table_name],
      })
      expect(
        response.datasource.entities?.[repeated_table_name].schema
      ).toBeDefined()
      const schema = response.datasource.entities?.[repeated_table_name].schema
      expect(Object.keys(schema || {}).sort()).toEqual(["id", "val1"])
    })
  })

  describe("check custom column types", () => {
    beforeAll(async () => {
      await rawQuery(
        rawDatasource,
        `CREATE TABLE binaryTable (
          id BYTEA PRIMARY KEY,
          column1 TEXT,
          column2 INT
        );
      `
      )
    })

    it("should handle binary columns", async () => {
      const response = await config.api.datasource.fetchSchema({
        datasourceId: datasource._id!,
      })
      expect(response.datasource.entities).toBeDefined()
      const table = response.datasource.entities?.["binarytable"]
      expect(table).toBeDefined()
      expect(table?.schema.id.externalType).toBe("bytea")
      const row = await config.api.row.save(table?._id!, {
        id: "1111",
        column1: "hello",
        column2: 222,
      })
      expect(row._id).toBeDefined()
      const decoded = decodeURIComponent(row._id!).replace(/'/g, '"')
      expect(JSON.parse(decoded)[0]).toBe("1111")
    })
  })

  describe("check fetching null/not null table", () => {
    beforeAll(async () => {
      await rawQuery(
        rawDatasource,
        `CREATE TABLE nullableTable (
          order_id SERIAL PRIMARY KEY,
          order_number INT NOT NULL
        );
      `
      )
    })

    it("should be able to change the table to allow nullable and refetch this", async () => {
      const response = await config.api.datasource.fetchSchema({
        datasourceId: datasource._id!,
      })
      const entities = response.datasource.entities
      expect(entities).toBeDefined()
      const nullableTable = entities?.["nullabletable"]
      expect(nullableTable).toBeDefined()
      expect(
        nullableTable?.schema["order_number"].constraints?.presence
      ).toEqual(true)
      // need to perform these calls raw to the DB so that the external state of the DB differs to what Budibase
      // is aware of - therefore we can try to fetch and make sure BB updates correctly
      await rawQuery(
        rawDatasource,
        `ALTER TABLE nullableTable
             ALTER COLUMN order_number DROP NOT NULL;
        `
      )
      const responseAfter = await config.api.datasource.fetchSchema({
        datasourceId: datasource._id!,
      })
      const entitiesAfter = responseAfter.datasource.entities
      expect(entitiesAfter).toBeDefined()
      const nullableTableAfter = entitiesAfter?.["nullabletable"]
      expect(nullableTableAfter).toBeDefined()
      expect(
        nullableTableAfter?.schema["order_number"].constraints?.presence
      ).toBeUndefined()
    })
  })
})
