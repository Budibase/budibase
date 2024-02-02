import { Datasource, Query } from "@budibase/types"
import * as setup from "../utilities"
import { databaseTestProviders } from "../../../../integrations/tests/utils"
import { MongoClient } from "mongodb"

jest.unmock("mongodb")
jest.setTimeout(3000)

describe("/queries", () => {
  let request = setup.getRequest()
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

    const res = await request
      .post(`/api/queries`)
      .set(config.defaultHeaders())
      .send({ ...defaultQuery, ...query })
      .expect("Content-Type", /json/)

    if (res.status !== 200) {
      throw new Error(JSON.stringify(res.body))
    }

    return res.body as Query
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
    const ds = await databaseTestProviders.mongodb.datasource()
    const client = new MongoClient(ds.config!.connectionString)
    await client.connect()

    const db = client.db(ds.config!.db)
    const collection = db.collection("test_table")
    await collection.insertMany([
      { name: "one" },
      { name: "two" },
      { name: "three" },
      { name: "four" },
      { name: "five" },
    ])
    await client.close()
  })

  afterEach(async () => {
    const ds = await databaseTestProviders.mongodb.datasource()
    const client = new MongoClient(ds.config!.connectionString)
    await client.connect()
    const db = client.db(ds.config!.db)
    await db.collection("test_table").drop()
    await client.close()
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
})
