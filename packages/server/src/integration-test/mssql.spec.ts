import { Datasource } from "@budibase/types"
import { generator } from "@budibase/backend-core/tests"
import { DatabaseName, datasourceDescribe } from "../integrations/tests/utils"
import { Knex } from "knex"

const quoteIdentifier = (identifier: string) => {
  return `[${identifier.replaceAll("]", "]]")}]`
}

const descriptions = datasourceDescribe({ only: [DatabaseName.SQL_SERVER] })

if (descriptions.length) {
  describe.each(descriptions)(
    "POST /api/datasources/:datasourceId/schema ($dbName)",
    ({ config, dsProvider }) => {
      let datasource: Datasource
      let client: Knex
      let tableName: string
      let schemaName = "dbo"

      const dropTable = async (schema: string, table: string) => {
        await client.raw(
          `DROP TABLE IF EXISTS ${quoteIdentifier(schema)}.${quoteIdentifier(
            table
          )}`
        )
      }

      beforeAll(async () => {
        const ds = await dsProvider()
        datasource = ds.datasource!
        client = ds.client!
      })

      afterAll(config.end)

      afterEach(async () => {
        if (tableName) {
          await dropTable(schemaName, tableName)
        }
        schemaName = "dbo"
      })

      it("handles table names containing single quotes", async () => {
        tableName = `bb_${generator
          .guid()
          .replaceAll("-", "")
          .substring(0, 6)}'safe`

        await client.raw(
          `CREATE TABLE ${quoteIdentifier("dbo")}.${quoteIdentifier(
            tableName
          )} (${quoteIdentifier("id")} INT IDENTITY(1,1) PRIMARY KEY)`
        )

        const res = await config.api.datasource.fetchSchema({
          datasourceId: datasource._id!,
          tablesFilter: [tableName],
        })

        const table = res.datasource.entities?.[tableName]
        expect(table).toBeDefined()
        expect(table?.schema.id).toBeDefined()
      })

      it("does not execute SQL from schema names", async () => {
        const markerTable = `bb_${generator
          .guid()
          .replaceAll("-", "")
          .substring(0, 6)}_marker`
        schemaName = `bb_${generator
          .guid()
          .replaceAll("-", "")
          .substring(0, 6)}'; CREATE TABLE ${quoteIdentifier(
          "dbo"
        )}.${quoteIdentifier(markerTable)} (id INT); --`
        tableName = "safe_table"

        try {
          await client.raw(`CREATE SCHEMA ${quoteIdentifier(schemaName)}`)
          await client.raw(
            `CREATE TABLE ${quoteIdentifier(schemaName)}.${quoteIdentifier(
              tableName
            )} (${quoteIdentifier("id")} INT IDENTITY(1,1) PRIMARY KEY)`
          )

          datasource = await config.api.datasource.get(datasource._id!)
          datasource.config!.schema = schemaName
          datasource = await config.api.datasource.update(datasource)

          let fetchSchemaError: Error | undefined
          const res = await config.api.datasource
            .fetchSchema({
              datasourceId: datasource._id!,
              tablesFilter: [tableName],
            })
            .catch(error => {
              fetchSchemaError = error
            })

          expect(await client.schema.hasTable(markerTable)).toBe(false)
          if (fetchSchemaError) {
            throw fetchSchemaError
          }

          const table = res!.datasource.entities?.[tableName]
          expect(table).toBeDefined()
          expect(table?.schema.id).toBeDefined()
        } finally {
          await dropTable("dbo", markerTable)
          await dropTable(schemaName, tableName)
          await client.raw(
            `DROP SCHEMA IF EXISTS ${quoteIdentifier(schemaName)}`
          )
        }
      })
    }
  )
}
