import { Datasource, Query } from "@budibase/types"
import * as setup from "../utilities"
import { databaseTestProviders } from "../../../../integrations/tests/utils"
import { MongoClient, type Collection } from "mongodb"

jest.unmock("mongodb")

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
    callback: (client: MongoClient) => Promise<void>
  ): Promise<void> {
    const ds = await databaseTestProviders.mongodb.datasource()
    const client = new MongoClient(ds.config!.connectionString)
    await client.connect()
    try {
      await callback(client)
    } finally {
      await client.close()
    }
  }

  async function withCollection(
    collection: string,
    callback: (collection: Collection) => Promise<void>
  ): Promise<void> {
    await withClient(async client => {
      const db = client.db(
        (await databaseTestProviders.mongodb.datasource()).config!.db
      )
      await callback(db.collection(collection))
    })
  }

  afterAll(async () => {
    await databaseTestProviders.mongodb.stop()
    setup.afterAll()
  })

  beforeAll(async () => {
    await config.init()
    datasource = await config.api.datasource.create(
      await databaseTestProviders.mongodb.datasource()
    )
  })

  beforeEach(async () => {
    await withCollection("test_table", async collection => {
      await collection.insertMany([
        { name: "one" },
        { name: "two" },
        { name: "three" },
        { name: "four" },
        { name: "five" },
      ])
    })
  })

  afterEach(async () => {
    await withCollection("test_table", async collection => {
      await collection.drop()
    })
  })

  it("should execute a query", async () => {
    const query = await createQuery({
      fields: {
        json: "{}",
        extra: {
          actionType: "count",
          collection: "test_table",
        },
      },
    })

    const result = await config.api.query.execute(query._id!)

    expect(result.data).toEqual([{ value: 5 }])
  })

  it("should execute a query with a transformer", async () => {
    const query = await createQuery({
      fields: {
        json: "{}",
        extra: {
          actionType: "count",
          collection: "test_table",
        },
      },
      transformer: "return data + 1",
    })

    const result = await config.api.query.execute(query._id!)

    expect(result.data).toEqual([{ value: 6 }])
  })

  it("should execute a create query with parameters", async () => {
    const query = await createQuery({
      fields: {
        json: '{"foo": "{{ foo }}"}',
        extra: {
          actionType: "insertOne",
          collection: "test_table",
        },
      },
      queryVerb: "create",
      parameters: [
        {
          name: "foo",
          default: "default",
        },
      ],
    })

    const result = await config.api.query.execute(query._id!, {
      parameters: { foo: "bar" },
    })

    expect(result.data).toEqual([
      {
        acknowledged: true,
        insertedId: expect.anything(),
      },
    ])

    await withCollection("test_table", async collection => {
      const doc = await collection.findOne({ foo: { $eq: "bar" } })
      expect(doc).toEqual({
        _id: expect.anything(),
        foo: "bar",
      })
    })
  })
})
