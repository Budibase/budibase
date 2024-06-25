import * as setup from "../api/routes/tests/utilities"
import { Datasource, FieldType } from "@budibase/types"
import _ from "lodash"
import { generator } from "@budibase/backend-core/tests"
import {
  DatabaseName,
  getDatasource,
  knexClient,
} from "../integrations/tests/utils"
import { Knex } from "knex"

const config = setup.getConfig()!

describe("postgres integrations", () => {
  let datasource: Datasource
  let client: Knex

  beforeAll(async () => {
    await config.init()
    const rawDatasource = await getDatasource(DatabaseName.POSTGRES)
    datasource = await config.api.datasource.create(rawDatasource)
    client = await knexClient(rawDatasource)
  })

  afterAll(config.end)

  describe("POST /api/datasources/:datasourceId/schema", () => {
    let tableName: string

    beforeEach(async () => {
      tableName = generator.guid().replaceAll("-", "").substring(0, 10)
    })

    afterEach(async () => {
      await client.schema.dropTableIfExists(tableName)
    })

    it("recognises when a table has no primary key", async () => {
      await client.schema.createTable(tableName, table => {
        table.increments("id", { primaryKey: false })
      })

      const response = await config.api.datasource.fetchSchema({
        datasourceId: datasource._id!,
      })

      expect(response.errors).toEqual({
        [tableName]: "Table must have a primary key.",
      })
    })

    it("recognises when a table is using a reserved column name", async () => {
      await client.schema.createTable(tableName, table => {
        table.increments("_id").primary()
      })

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

      await client.schema.createTable(tableName, table => {
        table.increments("order_id").primary()
        table.string("customer_name").notNullable()
        table.enum("status", ["pending", "processing", "shipped"], {
          useNative: true,
          enumName: `${tableName}_status`,
        })
      })

      const response = await config.api.datasource.fetchSchema({
        datasourceId: datasource._id!,
      })

      const table = response.datasource.entities?.[tableName]

      expect(table).toBeDefined()
      expect(table?.schema["status"].type).toEqual(FieldType.OPTIONS)
    })
  })

  describe("Integration compatibility with postgres search_path", () => {
    let datasource: Datasource
    let client: Knex
    let schema1: string
    let schema2: string

    beforeEach(async () => {
      schema1 = generator.guid().replaceAll("-", "")
      schema2 = generator.guid().replaceAll("-", "")

      const rawDatasource = await getDatasource(DatabaseName.POSTGRES)
      client = await knexClient(rawDatasource)

      await client.schema.createSchema(schema1)
      await client.schema.createSchema(schema2)

      rawDatasource.config!.schema = `${schema1}, ${schema2}`

      client = await knexClient(rawDatasource)
      datasource = await config.api.datasource.create(rawDatasource)
    })

    afterEach(async () => {
      await client.schema.dropSchema(schema1, true)
      await client.schema.dropSchema(schema2, true)
    })

    it("discovers tables from any schema in search path", async () => {
      await client.schema.createTable(`${schema1}.table1`, table => {
        table.increments("id1").primary()
      })

      await client.schema.createTable(`${schema2}.table2`, table => {
        table.increments("id2").primary()
      })

      const response = await config.api.datasource.info(datasource)
      expect(response.tableNames).toBeDefined()
      expect(response.tableNames).toEqual(
        expect.arrayContaining(["table1", "table2"])
      )
    })

    it("does not mix columns from different tables", async () => {
      const repeated_table_name = "table_same_name"

      await client.schema.createTable(
        `${schema1}.${repeated_table_name}`,
        table => {
          table.increments("id").primary()
          table.string("val1")
        }
      )

      await client.schema.createTable(
        `${schema2}.${repeated_table_name}`,
        table => {
          table.increments("id2").primary()
          table.string("val2")
        }
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
      await client.schema.createTable("binaryTable", table => {
        table.binary("id").primary()
        table.string("column1")
        table.integer("column2")
      })
    })

    it("should handle binary columns", async () => {
      const response = await config.api.datasource.fetchSchema({
        datasourceId: datasource._id!,
      })
      expect(response.datasource.entities).toBeDefined()
      const table = response.datasource.entities?.["binaryTable"]
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
      await client.schema.createTable("nullableTable", table => {
        table.increments("order_id").primary()
        table.integer("order_number").notNullable()
      })
    })

    it("should be able to change the table to allow nullable and refetch this", async () => {
      const response = await config.api.datasource.fetchSchema({
        datasourceId: datasource._id!,
      })
      const entities = response.datasource.entities
      expect(entities).toBeDefined()
      const nullableTable = entities?.["nullableTable"]
      expect(nullableTable).toBeDefined()
      expect(
        nullableTable?.schema["order_number"].constraints?.presence
      ).toEqual(true)

      // need to perform these calls raw to the DB so that the external state of the DB differs to what Budibase
      // is aware of - therefore we can try to fetch and make sure BB updates correctly
      await client.schema.alterTable("nullableTable", table => {
        table.setNullable("order_number")
      })

      const responseAfter = await config.api.datasource.fetchSchema({
        datasourceId: datasource._id!,
      })
      const entitiesAfter = responseAfter.datasource.entities
      expect(entitiesAfter).toBeDefined()
      const nullableTableAfter = entitiesAfter?.["nullableTable"]
      expect(nullableTableAfter).toBeDefined()
      expect(
        nullableTableAfter?.schema["order_number"].constraints?.presence
      ).toBeUndefined()
    })
  })
})
