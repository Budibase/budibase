import { Datasource, Query } from "@budibase/types"
import * as setup from "../utilities"
import { databaseTestProviders } from "../../../../integrations/tests/utils"
import mysql from "mysql2/promise"
import { generator } from "@budibase/backend-core/tests"

const createTableSQL = `
CREATE TABLE test_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
)
`

const insertSQL = `
INSERT INTO test_table (name) VALUES ('one'), ('two'), ('three'), ('four'), ('five')
`

const dropTableSQL = `
DROP TABLE test_table
`

describe("/queries", () => {
  let config = setup.getConfig()
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
    return await config.api.query.create({ ...defaultQuery, ...query })
  }

  async function withConnection(
    callback: (client: mysql.Connection) => Promise<void>
  ): Promise<void> {
    const ds = await databaseTestProviders.mysql.datasource()
    const con = await mysql.createConnection(ds.config!)
    try {
      await callback(con)
    } finally {
      con.end()
    }
  }

  afterAll(async () => {
    await databaseTestProviders.mysql.stop()
    setup.afterAll()
  })

  beforeAll(async () => {
    await config.init()
    datasource = await config.api.datasource.create(
      await databaseTestProviders.mysql.datasource()
    )
  })

  beforeEach(async () => {
    await withConnection(async connection => {
      await connection.query(createTableSQL)
      await connection.query(insertSQL)
    })
  })

  afterEach(async () => {
    await withConnection(async connection => {
      await connection.query(dropTableSQL)
    })
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
        },
        {
          id: 2,
          name: "two",
        },
        {
          id: 3,
          name: "three",
        },
        {
          id: 4,
          name: "four",
        },
        {
          id: 5,
          name: "five",
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
        },
      ])
    })
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

      await withConnection(async connection => {
        const [rows] = await connection.query(
          "SELECT * FROM test_table WHERE name = 'baz'"
        )
        expect(rows).toHaveLength(1)
      })
    })

    it.each(["2021-02-05T12:01:00.000Z", "2021-02-05"])(
      "should coerce %s into a date",
      async dateStr => {
        const date = new Date(dateStr)
        const tableName = `\`${generator.guid()}\``
        await withConnection(async connection => {
          await connection.query(`CREATE TABLE ${tableName} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            date DATETIME NOT NULL
        )`)
        })

        const query = await createQuery({
          fields: {
            sql: `INSERT INTO ${tableName} (date) VALUES ({{ date }})`,
          },
          parameters: [
            {
              name: "date",
              default: "",
            },
          ],
          queryVerb: "create",
        })

        const result = await config.api.query.execute(query._id!, {
          parameters: { date: dateStr },
        })

        expect(result.data).toEqual([{ created: true }])

        await withConnection(async connection => {
          const [rows] = await connection.query(
            `SELECT * FROM ${tableName} WHERE date = '${date.toISOString()}'`
          )
          expect(rows).toHaveLength(1)
        })
      }
    )

    it.each(["2021,02,05", "202205-1500"])(
      "should not coerce %s as a date",
      async date => {
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
            name: date,
          },
        })

        expect(result.data).toEqual([{ created: true }])

        await withConnection(async connection => {
          const [rows] = await connection.query(
            `SELECT * FROM test_table WHERE name = '${date}'`
          )
          expect(rows).toHaveLength(1)
        })
      }
    )
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

      await withConnection(async connection => {
        const [rows] = await connection.query(
          "SELECT * FROM test_table WHERE id = 1"
        )
        expect(rows).toEqual([{ id: 1, name: "foo" }])
      })
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

      await withConnection(async connection => {
        const [rows] = await connection.query(
          "SELECT * FROM test_table WHERE id = 1"
        )
        expect(rows).toHaveLength(0)
      })
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
})
