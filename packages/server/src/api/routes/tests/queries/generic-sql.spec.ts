import { Datasource, Query, QueryPreview } from "@budibase/types"
import {
  DatabaseName,
  datasourceDescribe,
} from "../../../../integrations/tests/utils"
import { Expectations } from "../../../../tests/utilities/api/base"
import { events } from "@budibase/backend-core"
import { Knex } from "knex"
import { generator } from "@budibase/backend-core/tests"

const descriptions = datasourceDescribe({
  exclude: [DatabaseName.MONGODB, DatabaseName.SQS],
})

if (descriptions.length) {
  describe.each(descriptions)(
    "queries ($dbName)",
    ({ config, dsProvider, isOracle, isMSSQL, isPostgres }) => {
      let rawDatasource: Datasource
      let datasource: Datasource
      let client: Knex

      let tableName: string

      async function createQuery(
        query: Partial<Query>,
        expectations?: Expectations
      ): Promise<Query> {
        const defaultQuery: Query = {
          datasourceId: datasource._id!,
          name: "New Query",
          parameters: [],
          fields: {},
          schema: {},
          queryVerb: "read",
          transformer: "return data",
          readable: true,
        }
        if (query.fields?.sql && typeof query.fields.sql !== "string") {
          throw new Error("Unable to create with knex structure in 'sql' field")
        }
        return await config.api.query.save(
          { ...defaultQuery, ...query },
          expectations
        )
      }

      beforeAll(async () => {
        const ds = await dsProvider()
        rawDatasource = ds.rawDatasource!
        datasource = ds.datasource!
        client = ds.client!
      })

      beforeEach(async () => {
        // The Datasource API doesn ot return the password, but we need it later to
        // connect to the underlying database, so we fill it back in here.
        datasource.config!.password = rawDatasource.config!.password

        tableName = generator.guid()

        await client.schema.dropTableIfExists(tableName)
        await client.schema.createTable(tableName, table => {
          table.increments("id").primary()
          table.string("name")
          table.timestamp("birthday")
          table.integer("number")
        })

        await client(tableName).insert([
          { name: "one" },
          { name: "two" },
          { name: "three" },
          { name: "four" },
          { name: "five" },
        ])

        jest.clearAllMocks()
      })

      describe("query admin", () => {
        describe("create", () => {
          it("should be able to create a query", async () => {
            const query = await createQuery({
              name: "New Query",
              fields: {
                sql: client(tableName).select("*").toString(),
              },
            })

            expect(query).toMatchObject({
              datasourceId: datasource._id!,
              name: "New Query",
              parameters: [],
              fields: {
                sql: client(tableName).select("*").toString(),
              },
              schema: {},
              queryVerb: "read",
              transformer: "return data",
              readable: true,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            })

            expect(events.query.created).toHaveBeenCalledTimes(1)
            expect(events.query.updated).not.toHaveBeenCalled()
          })
        })

        describe("update", () => {
          it("should be able to update a query", async () => {
            const query = await createQuery({
              fields: {
                sql: client(tableName).select("*").toString(),
              },
            })

            jest.clearAllMocks()

            const updatedQuery = await config.api.query.save({
              ...query,
              name: "Updated Query",
              fields: {
                sql: client(tableName).where({ id: 1 }).toString(),
              },
            })

            expect(updatedQuery).toMatchObject({
              datasourceId: datasource._id!,
              name: "Updated Query",
              parameters: [],
              fields: {
                sql: client(tableName).where({ id: 1 }).toString(),
              },
              schema: {},
              queryVerb: "read",
              transformer: "return data",
              readable: true,
            })

            expect(events.query.created).not.toHaveBeenCalled()
            expect(events.query.updated).toHaveBeenCalledTimes(1)
          })
        })

        describe("delete", () => {
          it("should be able to delete a query", async () => {
            const query = await createQuery({
              fields: {
                sql: client(tableName).select("*").toString(),
              },
            })

            await config.api.query.delete(query)
            await config.api.query.get(query._id!, { status: 404 })

            const queries = await config.api.query.fetch()
            expect(queries).not.toContainEqual(query)

            expect(events.query.deleted).toHaveBeenCalledTimes(1)
            expect(events.query.deleted).toHaveBeenCalledWith(datasource, query)
          })
        })

        describe("read", () => {
          it("should be able to list queries", async () => {
            const query = await createQuery({
              fields: {
                sql: client(tableName).select("*").toString(),
              },
            })

            const queries = await config.api.query.fetch()
            expect(queries).toContainEqual(query)
          })

          it("should strip sensitive fields for prod apps", async () => {
            const query = await createQuery({
              fields: {
                sql: client(tableName).select("*").toString(),
              },
            })

            await config.api.application.publish(config.getAppId())
            const prodQuery = await config.api.query.getProd(query._id!)

            expect(prodQuery._id).toEqual(query._id)
            expect(prodQuery.fields).toBeUndefined()
            expect(prodQuery.parameters).toBeUndefined()
            expect(prodQuery.schema).toBeDefined()
          })

          isPostgres &&
            it("should be able to handle a JSON aggregate with newlines", async () => {
              const jsonStatement = `COALESCE(json_build_object('name', name),'{"name":{}}'::json)`
              const query = await createQuery({
                fields: {
                  sql: client(tableName)
                    .select([
                      "*",
                      client.raw(
                        `${jsonStatement} as json,\n${jsonStatement} as json2`
                      ),
                    ])
                    .toString(),
                },
              })
              const res = await config.api.query.execute(
                query._id!,
                {},
                {
                  status: 200,
                }
              )
              expect(res).toBeDefined()
            })
        })
      })

      describe("preview", () => {
        it("should be able to preview a query", async () => {
          const request: QueryPreview = {
            datasourceId: datasource._id!,
            queryVerb: "read",
            fields: {
              sql: client(tableName).where({ id: 1 }).toString(),
            },
            parameters: [],
            transformer: "return data",
            name: datasource.name!,
            schema: {},
            readable: true,
          }
          const response = await config.api.query.preview(request)
          expect(response.schema).toEqual({
            birthday: {
              name: "birthday",
              type: "string",
            },
            id: {
              name: "id",
              type: "number",
            },
            name: {
              name: "name",
              type: "string",
            },
            number: {
              name: "number",
              type: "string",
            },
          })
          expect(response.rows).toEqual([
            {
              birthday: null,
              id: 1,
              name: "one",
              number: null,
            },
          ])
          expect(events.query.previewed).toHaveBeenCalledTimes(1)
        })

        it("should update schema when column type changes from number to string", async () => {
          const tableName = "schema_change_test"
          await client.schema.dropTableIfExists(tableName)

          await client.schema.createTable(tableName, table => {
            table.increments("id").primary()
            table.string("name")
            table.integer("data")
          })

          await client(tableName).insert({
            name: "test",
            data: 123,
          })

          const firstPreview = await config.api.query.preview({
            datasourceId: datasource._id!,
            name: "Test Query",
            queryVerb: "read",
            fields: {
              sql: client(tableName).select("*").toString(),
            },
            parameters: [],
            transformer: "return data",
            schema: {},
            readable: true,
          })

          expect(firstPreview.schema).toEqual(
            expect.objectContaining({
              data: { type: "number", name: "data" },
            })
          )

          await client(tableName).delete()
          await client.schema.alterTable(tableName, table => {
            table.string("data").alter()
          })

          await client(tableName).insert({
            name: "test",
            data: "string value",
          })

          const secondPreview = await config.api.query.preview({
            datasourceId: datasource._id!,
            name: "Test Query",
            queryVerb: "read",
            fields: {
              sql: client(tableName).select("*").toString(),
            },
            parameters: [],
            transformer: "return data",
            schema: firstPreview.schema,
            readable: true,
          })

          expect(secondPreview.schema).toEqual(
            expect.objectContaining({
              data: { type: "string", name: "data" },
            })
          )
        })

        it("should work with static variables", async () => {
          const datasource = await config.api.datasource.create({
            ...rawDatasource,
            config: {
              ...rawDatasource.config,
              staticVariables: {
                foo: "bar",
              },
            },
          })

          const request: QueryPreview = {
            datasourceId: datasource._id!,
            queryVerb: "read",
            fields: {
              sql: `SELECT '{{ foo }}' AS foo ${isOracle ? "FROM dual" : ""}`,
            },
            parameters: [],
            transformer: "return data",
            name: datasource.name!,
            schema: {},
            readable: true,
          }

          const response = await config.api.query.preview(request)

          let key = isOracle ? "FOO" : "foo"
          expect(response.schema).toEqual({
            [key]: {
              name: key,
              type: "string",
            },
          })

          expect(response.rows).toEqual([
            {
              [key]: "bar",
            },
          ])
        })

        it("should work with dynamic variables", async () => {
          const datasource = await config.api.datasource.create(rawDatasource)

          const basedOnQuery = await createQuery({
            datasourceId: datasource._id!,
            fields: {
              sql: client(tableName).select("name").where({ id: 1 }).toString(),
            },
          })

          await config.api.datasource.update({
            ...datasource,
            config: {
              ...datasource.config,
              dynamicVariables: [
                {
                  queryId: basedOnQuery._id!,
                  name: "foo",
                  value: "{{ data[0].name }}",
                },
              ],
            },
          })

          const preview = await config.api.query.preview({
            datasourceId: datasource._id!,
            queryVerb: "read",
            fields: {
              sql: `SELECT '{{ foo }}' AS foo ${isOracle ? "FROM dual" : ""}`,
            },
            parameters: [],
            transformer: "return data",
            name: datasource.name!,
            schema: {},
            readable: true,
          })

          let key = isOracle ? "FOO" : "foo"
          expect(preview.schema).toEqual({
            [key]: {
              name: key,
              type: "string",
            },
          })

          expect(preview.rows).toEqual([
            {
              [key]: "one",
            },
          ])
        })

        it("should handle the dynamic base query being deleted", async () => {
          const datasource = await config.api.datasource.create(rawDatasource)

          const basedOnQuery = await createQuery({
            datasourceId: datasource._id!,
            fields: {
              sql: client(tableName).select("name").where({ id: 1 }).toString(),
            },
          })

          await config.api.datasource.update({
            ...datasource,
            config: {
              ...datasource.config,
              dynamicVariables: [
                {
                  queryId: basedOnQuery._id!,
                  name: "foo",
                  value: "{{ data[0].name }}",
                },
              ],
            },
          })

          await config.api.query.delete(basedOnQuery)

          const preview = await config.api.query.preview({
            datasourceId: datasource._id!,
            queryVerb: "read",
            fields: {
              sql: `SELECT '{{ foo }}' AS foo ${isOracle ? "FROM dual" : ""}`,
            },
            parameters: [],
            transformer: "return data",
            name: datasource.name!,
            schema: {},
            readable: true,
          })

          let key = isOracle ? "FOO" : "foo"
          expect(preview.schema).toEqual({
            [key]: {
              name: key,
              type: "string",
            },
          })

          expect(preview.rows).toEqual([{ [key]: isMSSQL ? "" : null }])
        })
      })

      describe("query verbs", () => {
        describe("create", () => {
          it("should be able to insert with bindings", async () => {
            const query = await createQuery({
              fields: {
                sql: client(tableName).insert({ name: "{{ foo }}" }).toString(),
              },
              parameters: [
                {
                  name: "foo",
                  default: "bar",
                },
              ],
              queryVerb: "create",
            })

            const result = await config.api.query.execute(query._id!, {
              parameters: {
                foo: "baz",
              },
            })

            expect(result.data).toEqual([
              {
                created: true,
              },
            ])

            const rows = await client(tableName).where({ name: "baz" }).select()
            expect(rows).toHaveLength(1)
            for (const row of rows) {
              expect(row).toMatchObject({ name: "baz" })
            }
          })

          it("should not allow handlebars as parameters", async () => {
            const query = await createQuery({
              fields: {
                sql: client(tableName).insert({ name: "{{ foo }}" }).toString(),
              },
              parameters: [
                {
                  name: "foo",
                  default: "bar",
                },
              ],
              queryVerb: "create",
            })

            await config.api.query.execute(
              query._id!,
              {
                parameters: {
                  foo: "{{ 'test' }}",
                },
              },
              {
                status: 400,
                body: {
                  message:
                    "Parameter 'foo' input contains a handlebars binding - this is not allowed.",
                },
              }
            )
          })

          // Oracle doesn't automatically coerce strings into dates.
          !isOracle &&
            it.each(["2021-02-05T12:01:00.000Z", "2021-02-05"])(
              "should coerce %s into a date",
              async datetimeStr => {
                const date = new Date(datetimeStr)
                const query = await createQuery({
                  fields: {
                    sql: client(tableName)
                      .insert({
                        name: "foo",
                        birthday: client.raw("{{ birthday }}"),
                      })
                      .toString(),
                  },
                  parameters: [
                    {
                      name: "birthday",
                      default: "",
                    },
                  ],
                  queryVerb: "create",
                })

                const result = await config.api.query.execute(query._id!, {
                  parameters: { birthday: datetimeStr },
                })

                expect(result.data).toEqual([{ created: true }])

                const rows = await client(tableName)
                  .where({ birthday: datetimeStr })
                  .select()
                expect(rows).toHaveLength(1)

                for (const row of rows) {
                  expect(new Date(row.birthday)).toEqual(date)
                }
              }
            )

          it.each(["2021,02,05", "202205-1500"])(
            "should not coerce %s as a date",
            async notDateStr => {
              const query = await createQuery({
                fields: {
                  sql: client(tableName)
                    .insert({ name: client.raw("{{ name }}") })
                    .toString(),
                },
                parameters: [
                  {
                    name: "name",
                    default: "",
                  },
                ],
                queryVerb: "create",
              })

              const result = await config.api.query.execute(query._id!, {
                parameters: {
                  name: notDateStr,
                },
              })

              expect(result.data).toEqual([{ created: true }])

              const rows = await client(tableName)
                .where({ name: notDateStr })
                .select()
              expect(rows).toHaveLength(1)
            }
          )
        })

        describe("read", () => {
          it("should execute a query", async () => {
            const query = await createQuery({
              fields: {
                sql: client(tableName).select("*").orderBy("id").toString(),
              },
            })

            const result = await config.api.query.execute(query._id!)

            expect(result.data).toEqual([
              {
                id: 1,
                name: "one",
                birthday: null,
                number: null,
              },
              {
                id: 2,
                name: "two",
                birthday: null,
                number: null,
              },
              {
                id: 3,
                name: "three",
                birthday: null,
                number: null,
              },
              {
                id: 4,
                name: "four",
                birthday: null,
                number: null,
              },
              {
                id: 5,
                name: "five",
                birthday: null,
                number: null,
              },
            ])
          })

          it("should be able to transform a query", async () => {
            const query = await createQuery({
              fields: {
                sql: client(tableName).where({ id: 1 }).select("*").toString(),
              },
              transformer: `
            data[0].id = data[0].id + 1;
            return data;
          `,
            })

            const result = await config.api.query.execute(query._id!)

            expect(result.data).toEqual([
              {
                id: 2,
                name: "one",
                birthday: null,
                number: null,
              },
            ])
          })

          it("should coerce numeric bindings", async () => {
            const query = await createQuery({
              fields: {
                sql: client(tableName)
                  .where({ id: client.raw("{{ id }}") })
                  .select("*")
                  .toString(),
              },
              parameters: [
                {
                  name: "id",
                  default: "",
                },
              ],
            })

            const result = await config.api.query.execute(query._id!, {
              parameters: {
                id: "1",
              },
            })

            expect(result.data).toEqual([
              {
                id: 1,
                name: "one",
                birthday: null,
                number: null,
              },
            ])
          })
        })

        describe("update", () => {
          it("should be able to update rows", async () => {
            const query = await createQuery({
              fields: {
                sql: client(tableName)
                  .update({ name: client.raw("{{ name }}") })
                  .where({ id: client.raw("{{ id }}") })
                  .toString(),
              },
              parameters: [
                {
                  name: "id",
                  default: "",
                },
                {
                  name: "name",
                  default: "updated",
                },
              ],
              queryVerb: "update",
            })

            await config.api.query.execute(query._id!, {
              parameters: {
                id: "1",
                name: "foo",
              },
            })

            const rows = await client(tableName).where({ id: 1 }).select()
            expect(rows).toEqual([
              { id: 1, name: "foo", birthday: null, number: null },
            ])
          })

          it("should be able to execute an update that updates no rows", async () => {
            const query = await createQuery({
              fields: {
                sql: client(tableName)
                  .update({ name: "updated" })
                  .where({ id: 100 })
                  .toString(),
              },
              queryVerb: "update",
            })

            await config.api.query.execute(query._id!)

            const rows = await client(tableName).select()
            for (const row of rows) {
              expect(row.name).not.toEqual("updated")
            }
          })

          it("should be able to execute a delete that deletes no rows", async () => {
            const query = await createQuery({
              fields: {
                sql: client(tableName).where({ id: 100 }).delete().toString(),
              },
              queryVerb: "delete",
            })

            await config.api.query.execute(query._id!)

            const rows = await client(tableName).select()
            expect(rows).toHaveLength(5)
          })
        })

        describe("delete", () => {
          it("should be able to delete rows", async () => {
            const query = await createQuery({
              fields: {
                sql: client(tableName)
                  .where({ id: client.raw("{{ id }}") })
                  .delete()
                  .toString(),
              },
              parameters: [
                {
                  name: "id",
                  default: "",
                },
              ],
              queryVerb: "delete",
            })

            await config.api.query.execute(query._id!, {
              parameters: {
                id: "1",
              },
            })

            const rows = await client(tableName).where({ id: 1 }).select()
            expect(rows).toHaveLength(0)
          })
        })
      })

      describe("query through datasource", () => {
        // this parameter really only impacts SQL queries
        describe("confirm nullDefaultSupport", () => {
          let queryParams: Partial<Query>
          beforeAll(async () => {
            queryParams = {
              fields: {
                sql: client(tableName)
                  .insert({
                    name: client.raw("{{ bindingName }}"),
                    number: client.raw("{{ bindingNumber }}"),
                  })
                  .toString(),
              },
              parameters: [
                {
                  name: "bindingName",
                  default: "",
                },
                {
                  name: "bindingNumber",
                  default: "",
                },
              ],
              queryVerb: "create",
            }
          })

          it("should error for old queries", async () => {
            const query = await createQuery(queryParams)
            await config.api.query.save({ ...query, nullDefaultSupport: false })
            let error: string | undefined
            try {
              await config.api.query.execute(query._id!, {
                parameters: {
                  bindingName: "testing",
                },
              })
            } catch (err: any) {
              error = err.message
            }
            if (isMSSQL || isOracle) {
              expect(error).toBeUndefined()
            } else {
              expect(error).toBeDefined()
              expect(error).toContain("integer")
            }
          })

          it("should not error for new queries", async () => {
            const query = await createQuery(queryParams)
            const results = await config.api.query.execute(query._id!, {
              parameters: {
                bindingName: "testing",
              },
            })
            expect(results).toEqual({ data: [{ created: true }] })
          })
        })
      })

      describe("edge cases", () => {
        it("should find rows with a binding containing a slash", async () => {
          const slashValue = "1/10"
          await client(tableName).insert([{ name: slashValue }])

          const query = await createQuery({
            fields: {
              sql: client(tableName)
                .select("*")
                .where("name", "=", client.raw("{{ bindingName }}"))
                .toString(),
            },
            parameters: [
              {
                name: "bindingName",
                default: "",
              },
            ],
            queryVerb: "read",
          })
          const results = await config.api.query.execute(query._id!, {
            parameters: {
              bindingName: slashValue,
            },
          })
          expect(results).toBeDefined()
          expect(results.data.length).toEqual(1)
        })
      })
    }
  )
}
