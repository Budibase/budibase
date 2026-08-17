import { Datasource } from "@budibase/types"
import { generator } from "@budibase/backend-core/tests"
import { Knex } from "knex"
import { DatabaseName, datasourceDescribe, knexClient } from "./utils"

const descriptions = datasourceDescribe({
  only: [DatabaseName.POSTGRES, DatabaseName.POSTGRES_LEGACY],
})

function name() {
  return generator.guid().replaceAll("-", "").substring(0, 10)
}

if (descriptions.length) {
  describe.each(descriptions)(
    "postgres table visibility ($dbName)",
    ({ config, dsProvider }) => {
      let rawDatasource: Datasource
      let client: Knex

      let tableName: string
      let roleName: string
      let otherSchemaName: string
      let restrictedDatasource: Datasource

      beforeAll(async () => {
        const ds = await dsProvider()
        rawDatasource = ds.rawDatasource!
        client = ds.client!
      })

      afterAll(config.end)

      beforeEach(async () => {
        tableName = name()
        roleName = `restricted_${name()}`
        otherSchemaName = `other_${name()}`

        await client.schema.createTable(tableName, table => {
          table.increments("id").primary()
          table.string("name")
        })

        await client.raw(`CREATE ROLE ?? LOGIN PASSWORD 'password'`, [roleName])
        await client.raw(`GRANT CONNECT ON DATABASE ?? TO ??`, [
          rawDatasource.config!.database,
          roleName,
        ])

        restrictedDatasource = {
          ...rawDatasource,
          config: {
            ...rawDatasource.config,
            user: roleName,
            password: "password",
          },
        }
      })

      afterEach(async () => {
        await client.raw(`DROP SCHEMA IF EXISTS ?? CASCADE`, [otherSchemaName])
        await client.schema.dropTableIfExists(tableName)
        await client.raw(`DROP OWNED BY ??`, [roleName])
        await client.raw(`REVOKE ALL ON DATABASE ?? FROM ??`, [
          rawDatasource.config!.database,
          roleName,
        ])
        await client.raw(`DROP ROLE ??`, [roleName])
      })

      it("hides the table from information_schema when the user has no SELECT", async () => {
        const restrictedClient = await knexClient(restrictedDatasource)
        try {
          const { rows } = await restrictedClient.raw(
            `SELECT table_name FROM information_schema.columns WHERE table_name = ?`,
            [tableName]
          )
          expect(rows).toEqual([])
        } finally {
          await restrictedClient.destroy()
        }
      })

      it("reports the table from pg_catalog when its columns cannot be read", async () => {
        await config.api.datasource.info(restrictedDatasource, {
          status: 500,
          body: {
            message: expect.stringContaining(tableName),
          },
        })
      })

      it("explains the missing SELECT privilege rather than reporting no tables", async () => {
        await config.api.datasource.info(restrictedDatasource, {
          status: 500,
          body: {
            message: expect.stringContaining(
              "missing SELECT privilege on them"
            ),
          },
        })
      })

      it("returns the table names once SELECT is granted", async () => {
        await client.raw(`GRANT SELECT ON TABLE ?? TO ??`, [
          tableName,
          roleName,
        ])

        const info = await config.api.datasource.info(restrictedDatasource)
        expect(info.tableNames).toEqual([tableName])
      })

      it("does not report tables outside the datasource schema", async () => {
        const otherTableName = name()
        await client.raw(`CREATE SCHEMA ??`, [otherSchemaName])
        await client.raw(`CREATE TABLE ??.?? (id serial primary key)`, [
          otherSchemaName,
          otherTableName,
        ])
        await client.raw(`GRANT USAGE ON SCHEMA ?? TO ??`, [
          otherSchemaName,
          roleName,
        ])

        await config.api.datasource.info(restrictedDatasource, {
          status: 500,
          body: {
            message: expect.not.stringContaining(otherTableName),
          },
        })
      })

      it("reports a per-table error when building the schema", async () => {
        const datasource =
          await config.api.datasource.create(restrictedDatasource)

        const response = await config.api.datasource.fetchSchema({
          datasourceId: datasource._id!,
        })

        expect(response.errors).toEqual({
          [tableName]:
            "This table is visible but its columns could not be read. The datasource user is likely missing SELECT privilege on it - granting USAGE on the schema alone is not sufficient.",
        })
        expect(response.datasource.entities).toEqual({})
      })

      it("builds the schema normally when the user can read columns", async () => {
        await client.raw(`GRANT SELECT ON TABLE ?? TO ??`, [
          tableName,
          roleName,
        ])
        const datasource =
          await config.api.datasource.create(restrictedDatasource)

        const response = await config.api.datasource.fetchSchema({
          datasourceId: datasource._id!,
        })

        expect(response.errors).toEqual({})
        expect(Object.keys(response.datasource.entities!)).toEqual([tableName])
      })
    }
  )
}
