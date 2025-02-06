import { Datasource, FieldType } from "@budibase/types"
import { DatabaseName, datasourceDescribe } from "../integrations/tests/utils"
import { generator } from "@budibase/backend-core/tests"
import { Knex } from "knex"

function uniqueTableName(length?: number): string {
  return generator
    .guid()
    .replaceAll("-", "_")
    .substring(0, length || 10)
}

const mainDescriptions = datasourceDescribe({ only: [DatabaseName.MYSQL] })

if (mainDescriptions.length) {
  describe.each(mainDescriptions)(
    "/Integration compatibility with mysql search_path ($dbName)",
    ({ config, dsProvider }) => {
      let rawDatasource: Datasource
      let datasource: Datasource
      let client: Knex

      const database = generator.guid()
      const database2 = generator.guid()

      beforeAll(async () => {
        const ds = await dsProvider()
        rawDatasource = ds.rawDatasource!
        datasource = ds.datasource!
        client = ds.client!

        await client.raw(`CREATE DATABASE \`${database}\`;`)
        await client.raw(`CREATE DATABASE \`${database2}\`;`)

        rawDatasource.config!.database = database
        datasource = await config.api.datasource.create(rawDatasource)
      })

      afterAll(async () => {
        await client.raw(`DROP DATABASE \`${database}\`;`)
        await client.raw(`DROP DATABASE \`${database2}\`;`)
      })

      it("discovers tables from any schema in search path", async () => {
        await client.schema.createTable(`${database}.table1`, table => {
          table.increments("id1").primary()
        })
        const res = await config.api.datasource.info(datasource)
        expect(res.tableNames).toBeDefined()
        expect(res.tableNames).toEqual(expect.arrayContaining(["table1"]))
      })

      it("does not mix columns from different tables", async () => {
        const repeated_table_name = "table_same_name"
        await client.schema.createTable(
          `${database}.${repeated_table_name}`,
          table => {
            table.increments("id").primary()
            table.string("val1")
          }
        )
        await client.schema.createTable(
          `${database2}.${repeated_table_name}`,
          table => {
            table.increments("id2").primary()
            table.string("val2")
          }
        )

        const res = await config.api.datasource.fetchSchema({
          datasourceId: datasource._id!,
          tablesFilter: [repeated_table_name],
        })
        expect(
          res.datasource.entities![repeated_table_name].schema
        ).toBeDefined()
        const schema = res.datasource.entities![repeated_table_name].schema
        expect(Object.keys(schema).sort()).toEqual(["id", "val1"])
      })
    }
  )

  const descriptions = datasourceDescribe({ only: [DatabaseName.MYSQL] })

  if (descriptions.length) {
    describe.each(descriptions)(
      "POST /api/datasources/:datasourceId/schema ($dbName)",
      ({ config, dsProvider }) => {
        let datasource: Datasource
        let client: Knex

        beforeAll(async () => {
          const ds = await dsProvider()
          datasource = ds.datasource!
          client = ds.client!
        })

        let tableName: string
        beforeEach(async () => {
          tableName = uniqueTableName()
        })

        afterEach(async () => {
          await client.schema.dropTableIfExists(tableName)
        })

        it("recognises enum columns as options", async () => {
          const enumColumnName = "status"

          await client.schema.createTable(tableName, table => {
            table.increments("order_id").primary()
            table.string("customer_name", 100).notNullable()
            table.enum(
              enumColumnName,
              ["pending", "processing", "shipped", "delivered", "cancelled"],
              { useNative: true, enumName: `${tableName}_${enumColumnName}` }
            )
          })

          const res = await config.api.datasource.fetchSchema({
            datasourceId: datasource._id!,
          })

          const table = res.datasource.entities![tableName]

          expect(table).toBeDefined()
          expect(table.schema[enumColumnName].type).toEqual(FieldType.OPTIONS)
        })
      }
    )
  }
}
