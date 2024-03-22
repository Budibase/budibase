import {
  Datasource,
  Operation,
  Query,
  QueryPreview,
  SourceName,
} from "@budibase/types"
import * as setup from "../utilities"
import { databaseTestProviders } from "../../../../integrations/tests/utils"
import pg from "pg"
import mysql from "mysql2/promise"
import mssql from "mssql"
import { Expectations } from "src/tests/utilities/api/base"
import { events } from "@budibase/backend-core"

jest.unmock("pg")

const createTableSQL: Record<string, string> = {
  [SourceName.POSTGRES]: `
    CREATE TABLE test_table (
        id serial PRIMARY KEY,
        name VARCHAR ( 50 ) NOT NULL,
        birthday TIMESTAMP
    );`,
  [SourceName.MYSQL]: `
    CREATE TABLE test_table (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        birthday TIMESTAMP
    );`,
  [SourceName.SQL_SERVER]: `
    CREATE TABLE test_table (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(50) NOT NULL,
        birthday DATETIME
    );`,
}

const insertSQL = `INSERT INTO test_table (name) VALUES ('one'), ('two'), ('three'), ('four'), ('five')`
const dropTableSQL = `DROP TABLE test_table;`

describe.each([
  ["postgres", databaseTestProviders.postgres],
  ["mysql", databaseTestProviders.mysql],
  ["mssql", databaseTestProviders.mssql],
  ["mariadb", databaseTestProviders.mariadb],
])("queries (%s)", (__, dsProvider) => {
  const config = setup.getConfig()
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

  async function rawQuery(sql: string): Promise<any> {
    switch (datasource.source) {
      case SourceName.POSTGRES: {
        const client = new pg.Client(datasource.config!)
        await client.connect()
        try {
          const { rows } = await client.query(sql)
          return rows
        } finally {
          await client.end()
        }
      }
      case SourceName.MYSQL: {
        const con = await mysql.createConnection(datasource.config!)
        try {
          const [rows] = await con.query(sql)
          return rows
        } finally {
          con.end()
        }
      }
      case SourceName.SQL_SERVER: {
        const pool = new mssql.ConnectionPool(
          datasource.config! as mssql.config
        )
        const client = await pool.connect()
        try {
          const { recordset } = await client.query(sql)
          return recordset
        } finally {
          await pool.close()
        }
      }
    }
  }

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    const datasourceRequest = await dsProvider.datasource()
    datasource = await config.api.datasource.create(datasourceRequest)

    // The Datasource API does not return the password, but we need
    // it later to connect to the underlying database, so we fill it
    // back in here.
    datasource.config!.password = datasourceRequest.config!.password

    await rawQuery(createTableSQL[datasource.source])
    await rawQuery(insertSQL)

    jest.clearAllMocks()
  })

  afterEach(async () => {
    const ds = await config.api.datasource.get(datasource._id!)
    config.api.datasource.delete(ds)
    await rawQuery(dropTableSQL)
  })

  afterAll(async () => {
    await dsProvider.stop()
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
      })
      expect(response.rows).toEqual([
        {
          birthday: null,
          id: 1,
          name: "one",
        },
      ])
      expect(events.query.previewed).toHaveBeenCalledTimes(1)

      const dsWithoutConfig = { ...datasource }
      delete dsWithoutConfig.config
      expect(events.query.previewed).toHaveBeenCalledWith(
        dsWithoutConfig,
        request
      )
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

      // TODO: is this the correct behaviour? To return an empty string when the
      // underlying query has been deleted?
      expect(preview.rows).toEqual([
        {
          foo: "",
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
          },
          {
            id: 2,
            name: "two",
            birthday: null,
          },
          {
            id: 3,
            name: "three",
            birthday: null,
          },
          {
            id: 4,
            name: "four",
            birthday: null,
          },
          {
            id: 5,
            name: "five",
            birthday: null,
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

        const rows = await rawQuery("SELECT * FROM test_table WHERE id = 1")
        expect(rows).toEqual([{ id: 1, name: "foo", birthday: null }])
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

        const rows = await rawQuery("SELECT * FROM test_table WHERE id = 1")
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
  })
})
