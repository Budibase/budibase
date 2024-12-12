import * as setup from "./utilities"
import { checkBuilderEndpoint, allowUndefined } from "./utilities/TestFunctions"
import { getCachedVariable } from "../../../threads/utils"
import { context, events } from "@budibase/backend-core"
import sdk from "../../../sdk"

import { generator } from "@budibase/backend-core/tests"
import {
  Datasource,
  FieldSchema,
  BBReferenceFieldSubType,
  FieldType,
  RelationshipType,
  SourceName,
  Table,
  TableSchema,
  SupportedSqlTypes,
  JsonFieldSubType,
} from "@budibase/types"
import {
  DatabaseName,
  datasourceDescribe,
} from "../../../integrations/tests/utils"
import { tableForDatasource } from "../../../tests/utilities/structures"
import nock from "nock"
import { Knex } from "knex"

describe("/datasources", () => {
  const config = setup.getConfig()
  let datasource: Datasource

  beforeAll(async () => {
    await config.init()
  })
  afterAll(setup.afterAll)

  beforeEach(async () => {
    datasource = await config.api.datasource.create({
      type: "datasource",
      name: "Test",
      source: SourceName.POSTGRES,
      config: {},
    })
    jest.clearAllMocks()
    nock.cleanAll()
  })

  describe("create", () => {
    it("should create a new datasource", async () => {
      const ds = await config.api.datasource.create({
        type: "datasource",
        name: "Test",
        source: SourceName.POSTGRES,
        config: {},
      })
      expect(ds.name).toEqual("Test")
      expect(events.datasource.created).toHaveBeenCalledTimes(1)
    })

    it("should fail if the datasource is invalid", async () => {
      await config.api.datasource.create(
        {
          name: "Test",
          type: "test",
          source: "invalid" as SourceName,
          config: {},
        },
        {
          status: 500,
          body: {
            message: 'No datasource implementation found called: "invalid"',
          },
        }
      )
    })
  })

  describe("dynamic variables", () => {
    it("should invalidate changed or removed variables", async () => {
      nock("http://www.example.com/")
        .get("/")
        .reply(200, [{ value: "test" }])
        .get("/?test=test")
        .reply(200, [{ value: 1 }])

      let datasource = await config.api.datasource.create({
        type: "datasource",
        name: "Rest",
        source: SourceName.REST,
        config: {},
      })

      const query = await config.api.query.save({
        datasourceId: datasource._id!,
        fields: {
          path: "www.example.com",
        },
        parameters: [],
        transformer: null,
        queryVerb: "read",
        name: datasource.name!,
        schema: {},
        readable: true,
      })

      datasource = await config.api.datasource.update({
        ...datasource,
        config: {
          dynamicVariables: [
            {
              queryId: query._id,
              name: "variable3",
              value: "{{ data.0.[value] }}",
            },
          ],
        },
      })

      // preview once to cache variables
      await config.api.query.preview({
        fields: {
          path: "www.example.com",
          queryString: "test={{ variable3 }}",
        },
        datasourceId: datasource._id!,
        parameters: [],
        transformer: null,
        queryVerb: "read",
        name: datasource.name!,
        schema: {},
        readable: true,
      })

      // check variables in cache
      let contents = await getCachedVariable(query._id!, "variable3")
      expect(contents.rows.length).toEqual(1)

      // update the datasource to remove the variables
      datasource.config!.dynamicVariables = []
      await config.api.datasource.update(datasource)

      // check variables no longer in cache
      contents = await getCachedVariable(query._id!, "variable3")
      expect(contents).toBe(null)
    })
  })

  describe("permissions", () => {
    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "GET",
        url: `/api/datasources`,
      })
    })

    it("should apply authorization to delete endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "DELETE",
        url: `/api/datasources/${datasource._id}/${datasource._rev}`,
      })
    })
  })
})

const descriptions = datasourceDescribe({
  exclude: [DatabaseName.MONGODB, DatabaseName.SQS],
})

if (descriptions.length) {
  describe.each(descriptions)(
    "$dbName",
    ({ config, dsProvider, isOracle, isMSSQL }) => {
      let datasource: Datasource
      let rawDatasource: Datasource
      let client: Knex

      beforeEach(async () => {
        const ds = await dsProvider()
        rawDatasource = ds.rawDatasource!
        datasource = ds.datasource!
        client = ds.client!

        jest.clearAllMocks()
        nock.cleanAll()
      })

      describe("get", () => {
        it("should be able to get a datasource", async () => {
          const ds = await config.api.datasource.get(datasource._id!)
          expect(ds).toEqual({
            config: expect.any(Object),
            plus: datasource.plus,
            source: datasource.source,
            isSQL: true,
            type: "datasource_plus",
            _id: datasource._id,
            _rev: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          })
        })

        it("should not return database password", async () => {
          const ds = await config.api.datasource.get(datasource._id!)
          expect(ds.config!.password).toBe("--secret-value--")
        })
      })

      describe("list", () => {
        it("returns all the datasources", async () => {
          const datasources = await config.api.datasource.fetch()
          expect(datasources).toContainEqual(
            expect.objectContaining(datasource)
          )
        })
      })

      describe("put", () => {
        it("should update an existing datasource", async () => {
          const newName = generator.guid()
          datasource.name = newName
          const updatedDs = await config.api.datasource.update(datasource)
          expect(updatedDs.name).toEqual(newName)
          expect(events.datasource.updated).toHaveBeenCalledTimes(1)
        })

        it("should not overwrite database password with --secret-value--", async () => {
          const password = await context.doInAppContext(
            config.getAppId(),
            async () => {
              const ds = await sdk.datasources.get(datasource._id!)
              return ds.config!.password
            }
          )

          expect(password).not.toBe("--secret-value--")

          const ds = await config.api.datasource.get(datasource._id!)
          expect(ds.config!.password).toBe("--secret-value--")

          await config.api.datasource.update(
            await config.api.datasource.get(datasource._id!)
          )

          const newPassword = await context.doInAppContext(
            config.getAppId(),
            async () => {
              const ds = await sdk.datasources.get(datasource._id!)
              return ds.config!.password
            }
          )

          expect(newPassword).not.toBe("--secret-value--")
          expect(newPassword).toBe(password)
        })
      })

      describe("destroy", () => {
        it("deletes queries for the datasource after deletion and returns a success message", async () => {
          await config.api.query.save({
            datasourceId: datasource._id!,
            name: "Test Query",
            parameters: [],
            fields: {},
            schema: {},
            queryVerb: "read",
            transformer: null,
            readable: true,
          })

          await config.api.datasource.delete(datasource)
          const datasources = await config.api.datasource.fetch()
          expect(datasources).not.toContainEqual(
            expect.objectContaining(datasource)
          )
          expect(events.datasource.deleted).toHaveBeenCalledTimes(1)
        })
      })

      describe("schema", () => {
        it("fetching schema will not drop tables or columns", async () => {
          const datasourceId = datasource!._id!

          const simpleTable = await config.api.table.save(
            tableForDatasource(datasource, {
              name: "simple",
              schema: {
                name: {
                  name: "name",
                  type: FieldType.STRING,
                },
              },
            })
          )

          const stringName = "string"
          const fullSchema: {
            [type in SupportedSqlTypes]: FieldSchema & { type: type }
          } = {
            [FieldType.STRING]: {
              name: stringName,
              type: FieldType.STRING,
            },
            [FieldType.LONGFORM]: {
              name: "longform",
              type: FieldType.LONGFORM,
            },
            [FieldType.OPTIONS]: {
              name: "options",
              type: FieldType.OPTIONS,
              constraints: {
                presence: {
                  allowEmpty: false,
                },
                inclusion: ["1", "2", "3"],
              },
            },
            [FieldType.NUMBER]: {
              name: "number",
              type: FieldType.NUMBER,
            },
            [FieldType.BOOLEAN]: {
              name: "boolean",
              type: FieldType.BOOLEAN,
            },
            [FieldType.ARRAY]: {
              name: "array",
              type: FieldType.ARRAY,
              constraints: {
                type: JsonFieldSubType.ARRAY,
                inclusion: [],
              },
            },
            [FieldType.DATETIME]: {
              name: "datetime",
              type: FieldType.DATETIME,
              dateOnly: true,
              timeOnly: false,
            },
            [FieldType.LINK]: {
              name: "link",
              type: FieldType.LINK,
              tableId: simpleTable._id!,
              relationshipType: RelationshipType.ONE_TO_MANY,
              fieldName: "link",
            },
            [FieldType.FORMULA]: {
              name: "formula",
              type: FieldType.FORMULA,
              formula: "any formula",
            },
            [FieldType.BARCODEQR]: {
              name: "barcodeqr",
              type: FieldType.BARCODEQR,
            },
            [FieldType.BIGINT]: {
              name: "bigint",
              type: FieldType.BIGINT,
            },
            [FieldType.BB_REFERENCE]: {
              name: "bb_reference",
              type: FieldType.BB_REFERENCE,
              subtype: BBReferenceFieldSubType.USER,
            },
            [FieldType.BB_REFERENCE_SINGLE]: {
              name: "bb_reference_single",
              type: FieldType.BB_REFERENCE_SINGLE,
              subtype: BBReferenceFieldSubType.USER,
            },
          }

          await config.api.table.save(
            tableForDatasource(datasource, {
              name: "full",
              schema: fullSchema,
            })
          )

          const persisted = await config.api.datasource.get(datasourceId)
          await config.api.datasource.fetchSchema({ datasourceId })

          const updated = await config.api.datasource.get(datasourceId)
          const expected: Datasource = {
            ...persisted,
            entities:
              persisted?.entities &&
              Object.entries(persisted.entities).reduce<Record<string, Table>>(
                (acc, [tableName, table]) => {
                  acc[tableName] = expect.objectContaining({
                    ...table,
                    primaryDisplay: expect.not.stringMatching(
                      new RegExp(`^${table.primaryDisplay || ""}$`)
                    ),
                    schema: Object.entries(table.schema).reduce<TableSchema>(
                      (acc, [fieldName, field]) => {
                        acc[fieldName] = {
                          ...field,
                          externalType: allowUndefined(expect.any(String)),
                          constraints: allowUndefined(expect.any(Object)),
                          autocolumn: allowUndefined(expect.any(Boolean)),
                        }
                        return acc
                      },
                      {}
                    ),
                  })
                  return acc
                },
                {}
              ),

            _rev: expect.any(String),
            updatedAt: expect.any(String),
          }
          expect(updated).toEqual(expected)
        })

        !isOracle &&
          !isMSSQL &&
          it("can fetch options columns with a large number of options", async () => {
            const enumOptions = new Array(1000)
              .fill(0)
              .map((_, i) => i.toString())
              .toSorted()
            await client.schema.createTable("options", table => {
              table.increments("id").primary()
              table.enum("enum", enumOptions, {
                useNative: true,
                enumName: "enum",
              })
            })

            const resp = await config.api.datasource.fetchSchema({
              datasourceId: datasource._id!,
            })
            expect(resp.errors).toEqual({})

            const table = resp.datasource.entities!.options
            expect(
              table.schema.enum.constraints!.inclusion!.toSorted()
            ).toEqual(enumOptions)
          })

        !isOracle &&
          !isMSSQL &&
          it("can fetch options with commas in them", async () => {
            const enumOptions = [
              "Lincoln, Abraham",
              "Washington, George",
              "Fred",
              "Bob",
            ].toSorted()
            await client.schema.createTable("options", table => {
              table.increments("id").primary()
              table.enum("enum", enumOptions, {
                useNative: true,
                enumName: "enum",
              })
            })

            const resp = await config.api.datasource.fetchSchema({
              datasourceId: datasource._id!,
            })
            expect(resp.errors).toEqual({})

            const table = resp.datasource.entities!.options
            expect(
              table.schema.enum.constraints!.inclusion!.toSorted()
            ).toEqual(enumOptions)
          })

        !isOracle &&
          !isMSSQL &&
          it("can fetch options that may include other type names", async () => {
            const enumOptions = [
              "int",
              "bigint",
              "float",
              "numeric",
              "json",
              "map",
            ].toSorted()

            await client.schema.createTable("options", table => {
              table.increments("id").primary()
              table.enum("enum", enumOptions, {
                useNative: true,
                enumName: "enum",
              })
            })

            const resp = await config.api.datasource.fetchSchema({
              datasourceId: datasource._id!,
            })

            expect(resp.errors).toEqual({})

            const table = resp.datasource.entities!.options
            expect(
              table.schema.enum.constraints!.inclusion!.toSorted()
            ).toEqual(enumOptions)
          })
      })

      describe("verify", () => {
        it("should be able to verify the connection", async () => {
          await config.api.datasource.verify(
            {
              datasource: rawDatasource,
            },
            {
              body: {
                connected: true,
              },
            }
          )
        })

        it("should state an invalid datasource cannot connect", async () => {
          await config.api.datasource.verify(
            {
              datasource: {
                ...rawDatasource,
                config: {
                  ...rawDatasource.config,
                  password: "wrongpassword",
                },
              },
            },
            {
              body: {
                connected: false,
                error: /.*/, // error message differs between databases
              },
            }
          )
        })
      })

      describe("info", () => {
        it("should fetch information about a datasource with a single table", async () => {
          const existingTableNames = (
            await config.api.datasource.info(datasource)
          ).tableNames

          const tableName = generator.guid()
          await client.schema.createTable(tableName, table => {
            table.increments("id").primary()
            table.string("name")
          })

          const info = await config.api.datasource.info(datasource)
          expect(info.tableNames).toEqual(
            expect.arrayContaining([tableName, ...existingTableNames])
          )
          expect(info.tableNames).toHaveLength(existingTableNames.length + 1)
        })

        it("should fetch information about a datasource with multiple tables", async () => {
          const existingTableNames = (
            await config.api.datasource.info(datasource)
          ).tableNames

          const tableNames = [
            generator.guid(),
            generator.guid(),
            generator.guid(),
            generator.guid(),
          ]
          for (const tableName of tableNames) {
            await client.schema.createTable(tableName, table => {
              table.increments("id").primary()
              table.string("name")
            })
          }

          const info = await config.api.datasource.info(datasource)
          expect(info.tableNames).toEqual(
            expect.arrayContaining([...tableNames, ...existingTableNames])
          )
          expect(info.tableNames).toHaveLength(
            existingTableNames.length + tableNames.length
          )
        })
      })
    }
  )
}

const datasources = datasourceDescribe({
  exclude: [DatabaseName.MONGODB, DatabaseName.SQS, DatabaseName.ORACLE],
})

if (datasources.length) {
  describe.each(datasources)(
    "$dbName",
    ({ config, dsProvider, isPostgres, isLegacy, isMySQL, isMariaDB }) => {
      let datasource: Datasource
      let client: Knex

      beforeEach(async () => {
        const ds = await dsProvider()
        datasource = ds.datasource!
        client = ds.client!
      })

      describe("external export", () => {
        let table: Table

        beforeEach(async () => {
          table = await config.api.table.save(
            tableForDatasource(datasource, {
              name: "simple",
              primary: ["id"],
              primaryDisplay: "name",
              schema: {
                id: {
                  name: "id",
                  autocolumn: true,
                  type: FieldType.NUMBER,
                  constraints: {
                    presence: false,
                  },
                },
                name: {
                  name: "name",
                  autocolumn: false,
                  type: FieldType.STRING,
                  constraints: {
                    presence: false,
                  },
                },
              },
            })
          )
        })

        it("should be able to export and reimport a schema", async () => {
          let { schema } = await config.api.datasource.externalSchema(
            datasource
          )

          if (isPostgres) {
            // pg_dump 17 puts this config parameter into the dump but no DB < 17
            // can load it. We're using postgres 16 in tests at the time of writing.
            schema = schema.replace("SET transaction_timeout = 0;", "")
          }
          if (isPostgres && isLegacy) {
            // in older versions of Postgres, this is not a valid option - Postgres 9.5 does not support this.
            schema = schema.replace(
              "SET idle_in_transaction_session_timeout = 0;",
              ""
            )
          }

          await config.api.table.destroy(table._id!, table._rev!)

          if (isMySQL || isMariaDB) {
            // MySQL/MariaDB clients don't let you run multiple queries in a
            // single call.  They also throw an error when given an empty query.
            // The below handles both of these things.
            for (let query of schema.split(";\n")) {
              query = query.trim()
              if (!query) {
                continue
              }
              await client.raw(query)
            }
          } else {
            await client.raw(schema)
          }

          await config.api.datasource.fetchSchema({
            datasourceId: datasource._id!,
          })

          const tables = await config.api.table.fetch()
          const newTable = tables.find(t => t.name === table.name)!

          // This is only set on tables created through Budibase, we don't
          // expect it to match after we import the table.
          delete table.created

          for (const field of Object.values(newTable.schema)) {
            // Will differ per-database, not useful for this test.
            delete field.externalType
          }

          expect(newTable).toEqual(table)
        })
      })
    }
  )
}
