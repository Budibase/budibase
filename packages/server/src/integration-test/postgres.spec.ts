import { Datasource, FieldType, Table } from "@budibase/types"
import { generator } from "@budibase/backend-core/tests"
import {
  DatabaseName,
  datasourceDescribe,
  knexClient,
} from "../integrations/tests/utils"
import { Knex } from "knex"

const mainDescriptions = datasourceDescribe({
  only: [DatabaseName.POSTGRES, DatabaseName.POSTGRES_LEGACY],
})

if (mainDescriptions.length) {
  describe.each(mainDescriptions)(
    "/postgres integrations ($dbName)",
    ({ config, dsProvider }) => {
      let datasource: Datasource
      let client: Knex

      beforeAll(async () => {
        const ds = await dsProvider()
        datasource = ds.datasource!
        client = ds.client!
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
          const row = await config.api.row.save(table!._id!, {
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

      describe("money field 💰", () => {
        const tableName = "moneytable"
        let table: Table

        beforeAll(async () => {
          await client.raw(`
        CREATE TABLE ${tableName} (
          id serial PRIMARY KEY,
          price money
        )   
      `)
          const response = await config.api.datasource.fetchSchema({
            datasourceId: datasource._id!,
          })
          table = response.datasource.entities![tableName]
        })

        it("should be able to import a money field", async () => {
          expect(table).toBeDefined()
          expect(table?.schema.price.type).toBe(FieldType.NUMBER)
        })

        it("should be able to search a money field", async () => {
          await config.api.row.bulkImport(table._id!, {
            rows: [{ price: 200 }, { price: 300 }],
          })

          const { rows } = await config.api.row.search(table._id!, {
            query: {
              equal: {
                price: 200,
              },
            },
          })
          expect(rows).toHaveLength(1)
          expect(rows[0].price).toBe("200.00")
        })

        it("should be able to update a money field", async () => {
          let row = await config.api.row.save(table._id!, { price: 200 })
          expect(row.price).toBe("200.00")

          row = await config.api.row.save(table._id!, { ...row, price: 300 })
          expect(row.price).toBe("300.00")

          row = await config.api.row.save(table._id!, {
            ...row,
            price: "400.00",
          })
          expect(row.price).toBe("400.00")
        })
      })
    }
  )

  const descriptions = datasourceDescribe({ only: [DatabaseName.POSTGRES] })

  if (descriptions.length) {
    describe.each(descriptions)(
      "Integration compatibility with postgres search_path",
      ({ config, dsProvider }) => {
        let datasource: Datasource
        let client: Knex
        let schema1: string
        let schema2: string

        beforeEach(async () => {
          const ds = await dsProvider()
          datasource = ds.datasource!
          const rawDatasource = ds.rawDatasource!

          schema1 = generator.guid().replaceAll("-", "")
          schema2 = generator.guid().replaceAll("-", "")

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
          const schema =
            response.datasource.entities?.[repeated_table_name].schema
          expect(Object.keys(schema || {}).sort()).toEqual(["id", "val1"])
        })
      }
    )
  }
}
