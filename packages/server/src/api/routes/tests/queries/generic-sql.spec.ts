import { Datasource, Query, SourceName } from "@budibase/types"
import * as setup from "../utilities"
import {
  DatabaseName,
  getDatasource,
  rawQuery,
} from "../../../../integrations/tests/utils"
import pg from "pg"
import mysql from "mysql2/promise"
import mssql from "mssql"

jest.unmock("pg")

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

  async function createQuery(query: Partial<Query>): Promise<Query> {
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
    return await config.api.query.save({ ...defaultQuery, ...query })
  }

  beforeAll(async () => {
    await config.init()
    rawDatasource = await dsProvider
    datasource = await config.api.datasource.create(rawDatasource)
  })

  beforeEach(async () => {
    await rawQuery(rawDatasource, createTableSQL[datasource.source])
    await rawQuery(rawDatasource, insertSQL)
  })

  afterEach(async () => {
    await rawQuery(rawDatasource, dropTableSQL)
  })

  afterAll(async () => {
    setup.afterAll()
  })

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
        rawDatasource,
        "SELECT * FROM test_table WHERE name = 'baz'"
      )
      expect(rows).toHaveLength(1)
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
          rawDatasource,
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
          rawDatasource,
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
        rawDatasource,
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
        rawDatasource,
        "SELECT * FROM test_table WHERE id = 1"
      )
      expect(rows).toHaveLength(0)
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
      if (dbName === DatabaseName.SQL_SERVER) {
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
