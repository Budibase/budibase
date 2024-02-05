import { Datasource, Query } from "@budibase/types"
import * as setup from "../utilities"
import { databaseTestProviders } from "../../../../integrations/tests/utils"
import { Client } from "pg"

jest.unmock("pg")

const createTableSQL = `
CREATE TABLE test_table (
    id serial PRIMARY KEY,
    name VARCHAR ( 50 ) NOT NULL
);
`

const insertSQL = `
INSERT INTO test_table (name) VALUES ('one');
INSERT INTO test_table (name) VALUES ('two');
INSERT INTO test_table (name) VALUES ('three');
INSERT INTO test_table (name) VALUES ('four');
INSERT INTO test_table (name) VALUES ('five');
`

const dropTableSQL = `
DROP TABLE test_table;
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

  async function withClient(
    callback: (client: Client) => Promise<void>
  ): Promise<void> {
    const ds = await databaseTestProviders.postgres.datasource()
    const client = new Client(ds.config!)
    await client.connect()
    try {
      await callback(client)
    } finally {
      await client.end()
    }
  }

  afterAll(async () => {
    await databaseTestProviders.postgres.stop()
    setup.afterAll()
  })

  beforeAll(async () => {
    await config.init()
    datasource = await config.api.datasource.create(
      await databaseTestProviders.postgres.datasource()
    )
  })

  beforeEach(async () => {
    await withClient(async client => {
      await client.query(createTableSQL)
      await client.query(insertSQL)
    })
  })

  afterEach(async () => {
    await withClient(async client => {
      await client.query(dropTableSQL)
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

    await withClient(async client => {
      const { rows } = await client.query(
        "SELECT * FROM test_table WHERE name = 'baz'"
      )
      expect(rows).toHaveLength(1)
    })
  })
})
