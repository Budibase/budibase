import { Datasource, Query } from "@budibase/types"
import * as setup from "../utilities"
import { databaseTestProviders } from "../../../../integrations/tests/utils"
import mysql from "mysql2/promise"

jest.unmock("mysql2")
jest.unmock("mysql2/promise")

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
      const resp = await connection.query(createTableSQL)
      await connection.query(insertSQL)
    })
  })

  afterEach(async () => {
    await withConnection(async connection => {
      await connection.query(dropTableSQL)
    })
  })

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
})
