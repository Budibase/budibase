import { Datasource } from "@budibase/types"
import { generator } from "@budibase/backend-core/tests"
import { DatabaseName, datasourceDescribe } from "../integrations/tests/utils"
import { quoteSqlServerIdentifier } from "../integrations/utils"
import { Knex } from "knex"

const uniqueName = (suffix = "") => {
  return `bb_${generator.guid().replaceAll("-", "").substring(0, 6)}${suffix}`
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
          `DROP TABLE IF EXISTS ${quoteSqlServerIdentifier(
            schema
          )}.${quoteSqlServerIdentifier(table)}`
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
        tableName = uniqueName("'safe")

        await client.raw(
          `CREATE TABLE ${quoteSqlServerIdentifier(
            "dbo"
          )}.${quoteSqlServerIdentifier(tableName)} (${quoteSqlServerIdentifier(
            "id"
          )} INT IDENTITY(1,1) PRIMARY KEY)`
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
        const markerTable = uniqueName("_marker")
        schemaName = `${uniqueName()}'; CREATE TABLE ${quoteSqlServerIdentifier(
          "dbo"
        )}.${quoteSqlServerIdentifier(markerTable)} (id INT); --`
        tableName = "safe_table"

        try {
          await client.raw(
            `CREATE SCHEMA ${quoteSqlServerIdentifier(schemaName)}`
          )
          await client.raw(
            `CREATE TABLE ${quoteSqlServerIdentifier(
              schemaName
            )}.${quoteSqlServerIdentifier(tableName)} (${quoteSqlServerIdentifier(
              "id"
            )} INT IDENTITY(1,1) PRIMARY KEY)`
          )

          datasource = await config.api.datasource.get(datasource._id!)
          datasource.config!.schema = schemaName
          datasource = await config.api.datasource.update(datasource)

          const res = await config.api.datasource.fetchSchema({
            datasourceId: datasource._id!,
            tablesFilter: [tableName],
          })

          expect(await client.schema.hasTable(markerTable)).toBe(false)

          const table = res.datasource.entities?.[tableName]
          expect(table).toBeDefined()
          expect(table?.schema.id).toBeDefined()
        } finally {
          await dropTable("dbo", markerTable)
          await dropTable(schemaName, tableName)
          await client.raw(
            `DROP SCHEMA IF EXISTS ${quoteSqlServerIdentifier(schemaName)}`
          )
        }
      })
    }
  )
}
