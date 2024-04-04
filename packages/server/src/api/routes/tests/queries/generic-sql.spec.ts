import {
  Datasource,
  Operation,
  Query,
  QueryPreview,
  SourceName,
} from "@budibase/types"
import * as setup from "../utilities"
import {
  DatabaseName,
  getDatasource,
  rawQuery,
} from "../../../../integrations/tests/utils"
import { Expectations } from "src/tests/utilities/api/base"
import { events } from "@budibase/backend-core"

const createTableSQL: Record<string, string> = {
  [SourceName.POSTGRES]: `
    CREATE TABLE test_table (
        id serial PRIMARY KEY,
        name VARCHAR ( 50 ) NOT NULL,
        birthday TIMESTAMP,
        number INT
    );`,
  [SourceName.MYSQL]: `
    CREATE TABLE test_table (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        birthday TIMESTAMP,
        number INT
    );`,
  [SourceName.SQL_SERVER]: `
    CREATE TABLE test_table (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(50) NOT NULL,
        birthday DATETIME,
        number INT
    );`,
}

const insertSQL = `INSERT INTO test_table (name) VALUES ('one'), ('two'), ('three'), ('four'), ('five')`
const dropTableSQL = `DROP TABLE test_table;`

describe.each(
  [
    DatabaseName.POSTGRES,
    DatabaseName.MYSQL,
    DatabaseName.SQL_SERVER,
    DatabaseName.MARIADB,
  ].map(name => [name, getDatasource(name)])
)("queries (%s)", (dbName, dsProvider) => {
  const config = setup.getConfig()
  let rawDatasource: Datasource
  let datasource: Datasource

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
    return await config.api.query.save(
      { ...defaultQuery, ...query },
      expectations
    )
  }

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    rawDatasource = await dsProvider
    datasource = await config.api.datasource.create(rawDatasource)

    // The Datasource API does not return the password, but we need
    // it later to connect to the underlying database, so we fill it
    // back in here.
    datasource.config!.password = rawDatasource.config!.password

    await rawQuery(datasource, createTableSQL[datasource.source])
    await rawQuery(datasource, insertSQL)

    jest.clearAllMocks()
  })

  afterEach(async () => {
    const ds = await config.api.datasource.get(datasource._id!)
    config.api.datasource.delete(ds)
    await rawQuery(datasource, dropTableSQL)
  })

  afterAll(async () => {
    setup.afterAll()
  })

  describe("query admin", () => {
    describe("create", () => {
      it("should be able to create a query", async () => {
        const query = await createQuery({
          name: "New Query",
          fields: {
            sql: "SELECT * FROM test_table",
          },
        })

        expect(query).toMatchObject({
          datasourceId: datasource._id!,
          name: "New Query",
          parameters: [],
          fields: {
            sql: "SELECT * FROM test_table",
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
            sql: "SELECT * FROM test_table",
          },
        })

        jest.clearAllMocks()

        const updatedQuery = await config.api.query.save({
          ...query,
          name: "Updated Query",
          fields: {
            sql: "SELECT * FROM test_table WHERE id = 1",
          },
        })

        expect(updatedQuery).toMatchObject({
          datasourceId: datasource._id!,
          name: "Updated Query",
          parameters: [],
          fields: {
            sql: "SELECT * FROM test_table WHERE id = 1",
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
            sql: "SELECT * FROM test_table",
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
            sql: "SELECT * FROM test_table",
          },
        })

        const queries = await config.api.query.fetch()
        expect(queries).toContainEqual(query)
      })

      it("should strip sensitive fields for prod apps", async () => {
        const query = await createQuery({
          fields: {
            sql: "SELECT * FROM test_table",
          },
        })

        await config.publish()
        const prodQuery = await config.api.query.getProd(query._id!)

        expect(prodQuery._id).toEqual(query._id)
        expect(prodQuery.fields).toBeUndefined()
        expect(prodQuery.parameters).toBeUndefined()
        expect(prodQuery.schema).toBeDefined()
      })
    })
  })

  describe("preview", () => {
    it("should be able to preview a query", async () => {
      const request: QueryPreview = {
        datasourceId: datasource._id!,
        queryVerb: "read",
        fields: {
          sql: `SELECT * FROM test_table WHERE id = 1`,
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

    it("should work with static variables", async () => {
      await config.api.datasource.update({
        ...datasource,
        config: {
          ...datasource.config,
          staticVariables: {
            foo: "bar",
          },
        },
      })

      const request: QueryPreview = {
        datasourceId: datasource._id!,
        queryVerb: "read",
        fields: {
          sql: `SELECT '{{ foo }}' as foo`,
        },
        parameters: [],
        transformer: "return data",
        name: datasource.name!,
        schema: {},
        readable: true,
      }

      const response = await config.api.query.preview(request)

      expect(response.schema).toEqual({
        foo: {
          name: "foo",
          type: "string",
        },
      })

      expect(response.rows).toEqual([
        {
          foo: "bar",
        },
      ])
    })

    it("should work with dynamic variables", async () => {
      const basedOnQuery = await createQuery({
        fields: {
          sql: "SELECT name FROM test_table WHERE id = 1",
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
          sql: `SELECT '{{ foo }}' as foo`,
        },
        parameters: [],
        transformer: "return data",
        name: datasource.name!,
        schema: {},
        readable: true,
      })

      expect(preview.schema).toEqual({
        foo: {
          name: "foo",
          type: "string",
        },
      })

      expect(preview.rows).toEqual([
        {
          foo: "one",
        },
      ])
    })

    it("should handle the dynamic base query being deleted", async () => {
      const basedOnQuery = await createQuery({
        fields: {
          sql: "SELECT name FROM test_table WHERE id = 1",
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
          sql: `SELECT '{{ foo }}' as foo`,
        },
        parameters: [],
        transformer: "return data",
        name: datasource.name!,
        schema: {},
        readable: true,
      })

      expect(preview.schema).toEqual({
        foo: {
          name: "foo",
          type: "string",
        },
      })

      expect(preview.rows).toEqual([
        {
          foo: datasource.source === SourceName.SQL_SERVER ? "" : null,
        },
      ])
    })
  })

  describe("query verbs", () => {
    describe("create", () => {
      it("should be able to insert with bindings", async () => {
        const query = await createQuery({
          fields: {
            sql: "INSERT INTO test_table (name) VALUES ({{ foo }})",
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

        const rows = await rawQuery(
          datasource,
          "SELECT * FROM test_table WHERE name = 'baz'"
        )
        expect(rows).toHaveLength(1)
      })

      it("should not allow handlebars as parameters", async () => {
        const query = await createQuery({
          fields: {
            sql: "INSERT INTO test_table (name) VALUES ({{ foo }})",
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

      it.each(["2021-02-05T12:01:00.000Z", "2021-02-05"])(
        "should coerce %s into a date",
        async datetimeStr => {
          const date = new Date(datetimeStr)
          const query = await createQuery({
            fields: {
              sql: `INSERT INTO test_table (name, birthday) VALUES ('foo', {{ birthday }})`,
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

          const rows = await rawQuery(
            datasource,
            `SELECT * FROM test_table WHERE birthday = '${date.toISOString()}'`
          )
          expect(rows).toHaveLength(1)
        }
      )

      it.each(["2021,02,05", "202205-1500"])(
        "should not coerce %s as a date",
        async notDateStr => {
          const query = await createQuery({
            fields: {
              sql: "INSERT INTO test_table (name) VALUES ({{ name }})",
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

          const rows = await rawQuery(
            datasource,
            `SELECT * FROM test_table WHERE name = '${notDateStr}'`
          )
          expect(rows).toHaveLength(1)
        }
      )
    })

    describe("read", () => {
      it("should execute a query", async () => {
        const query = await createQuery({
          fields: {
            sql: "SELECT * FROM test_table ORDER BY id",
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
            sql: "SELECT * FROM test_table WHERE id = 1",
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
            sql: "SELECT * FROM test_table WHERE id = {{ id }}",
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
            sql: "UPDATE test_table SET name = {{ name }} WHERE id = {{ id }}",
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

        const result = await config.api.query.execute(query._id!, {
          parameters: {
            id: "1",
            name: "foo",
          },
        })

        expect(result.data).toEqual([
          {
            updated: true,
          },
        ])

        const rows = await rawQuery(
          datasource,
          "SELECT * FROM test_table WHERE id = 1"
        )
        expect(rows).toEqual([
          { id: 1, name: "foo", birthday: null, number: null },
        ])
      })

      it("should be able to execute an update that updates no rows", async () => {
        const query = await createQuery({
          fields: {
            sql: "UPDATE test_table SET name = 'updated' WHERE id = 100",
          },
          queryVerb: "update",
        })

        const result = await config.api.query.execute(query._id!)

        expect(result.data).toEqual([
          {
            updated: true,
          },
        ])
      })

      it("should be able to execute a delete that deletes no rows", async () => {
        const query = await createQuery({
          fields: {
            sql: "DELETE FROM test_table WHERE id = 100",
          },
          queryVerb: "delete",
        })

        const result = await config.api.query.execute(query._id!)

        expect(result.data).toEqual([
          {
            deleted: true,
          },
        ])
      })
    })

    describe("delete", () => {
      it("should be able to delete rows", async () => {
        const query = await createQuery({
          fields: {
            sql: "DELETE FROM test_table WHERE id = {{ id }}",
          },
          parameters: [
            {
              name: "id",
              default: "",
            },
          ],
          queryVerb: "delete",
        })

        const result = await config.api.query.execute(query._id!, {
          parameters: {
            id: "1",
          },
        })

        expect(result.data).toEqual([
          {
            deleted: true,
          },
        ])

        const rows = await rawQuery(
          datasource,
          "SELECT * FROM test_table WHERE id = 1"
        )
        expect(rows).toHaveLength(0)
      })
    })
  })

  describe("query through datasource", () => {
    it("should be able to query a pg datasource", async () => {
      const res = await config.api.datasource.query({
        endpoint: {
          datasourceId: datasource._id!,
          operation: Operation.READ,
          entityId: "test_table",
        },
        resource: {
          fields: ["id", "name"],
        },
        filters: {
          string: {
            name: "two",
          },
        },
      })
      expect(res).toHaveLength(1)
      expect(res[0]).toEqual({
        id: 2,
        name: "two",
      })
    })

    it("should be able to execute an update that updates no rows", async () => {
      const query = await createQuery({
        fields: {
          sql: "UPDATE test_table SET name = 'updated' WHERE id = 100",
        },
        queryVerb: "update",
      })

      const result = await config.api.query.execute(query._id!, {})

      expect(result.data).toEqual([
        {
          updated: true,
        },
      ])
    })
  })

  // this parameter really only impacts SQL queries
  describe("confirm nullDefaultSupport", () => {
    const queryParams = {
      fields: {
        sql: "INSERT INTO test_table (name, number) VALUES ({{ bindingName }}, {{ bindingNumber }})",
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
      if (dbName === "mssql") {
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
