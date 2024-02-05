import { Datasource, Query } from "@budibase/types"
import * as setup from "../utilities"
import { databaseTestProviders } from "../../../../integrations/tests/utils"
import { MongoClient, type Collection } from "mongodb"

jest.unmock("mongodb")

const collection = "test_collection"

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
    const combinedQuery = { ...defaultQuery, ...query }
    if (
      combinedQuery.fields &&
      combinedQuery.fields.extra &&
      !combinedQuery.fields.extra.collection
    ) {
      combinedQuery.fields.extra.collection = collection
    }
    return await config.api.query.create(combinedQuery)
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
    await withCollection(async collection => {
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
    await withCollection(async collection => {
      await collection.drop()
    })
  })

  it("should execute a count query", async () => {
    const query = await createQuery({
      fields: {
        json: {},
        extra: {
          actionType: "count",
        },
      },
    })

    const result = await config.api.query.execute(query._id!)

    expect(result.data).toEqual([{ value: 5 }])
  })

  it("should execute a count query with a transformer", async () => {
    const query = await createQuery({
      fields: {
        json: {},
        extra: {
          actionType: "count",
        },
      },
      transformer: "return data + 1",
    })

    const result = await config.api.query.execute(query._id!)

    expect(result.data).toEqual([{ value: 6 }])
  })

  it("should execute a find query", async () => {
    const query = await createQuery({
      fields: {
        json: {},
        extra: {
          actionType: "find",
        },
      },
    })

    const result = await config.api.query.execute(query._id!)

    expect(result.data).toEqual([
      { _id: expect.anything(), name: "one" },
      { _id: expect.anything(), name: "two" },
      { _id: expect.anything(), name: "three" },
      { _id: expect.anything(), name: "four" },
      { _id: expect.anything(), name: "five" },
    ])
  })

  it("should execute a findOne query", async () => {
    const query = await createQuery({
      fields: {
        json: {},
        extra: {
          actionType: "findOne",
        },
      },
    })

    const result = await config.api.query.execute(query._id!)

    expect(result.data).toEqual([{ _id: expect.anything(), name: "one" }])
  })

  it("should execute a create query with parameters", async () => {
    const query = await createQuery({
      fields: {
        json: { foo: "{{ foo }}" },
        extra: {
          actionType: "insertOne",
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

    await withCollection(async collection => {
      const doc = await collection.findOne({ foo: { $eq: "bar" } })
      expect(doc).toEqual({
        _id: expect.anything(),
        foo: "bar",
      })
    })
  })

  it("should execute a delete query with parameters", async () => {
    const query = await createQuery({
      fields: {
        json: { name: { $eq: "{{ name }}" } },
        extra: {
          actionType: "deleteOne",
        },
      },
      queryVerb: "delete",
      parameters: [
        {
          name: "name",
          default: "",
        },
      ],
    })

    const result = await config.api.query.execute(query._id!, {
      parameters: { name: "one" },
    })

    expect(result.data).toEqual([
      {
        acknowledged: true,
        deletedCount: 1,
      },
    ])

    await withCollection(async collection => {
      const doc = await collection.findOne({ name: { $eq: "one" } })
      expect(doc).toBeNull()
    })
  })

  it("should execute an update query with parameters", async () => {
    const query = await createQuery({
      fields: {
        json: {
          filter: { name: { $eq: "{{ name }}" } },
          update: { $set: { name: "{{ newName }}" } },
        },
        extra: {
          actionType: "updateOne",
        },
      },
      queryVerb: "update",
      parameters: [
        {
          name: "name",
          default: "",
        },
        {
          name: "newName",
          default: "",
        },
      ],
    })

    const result = await config.api.query.execute(query._id!, {
      parameters: { name: "one", newName: "newOne" },
    })

    expect(result.data).toEqual([
      {
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
      },
    ])

    await withCollection(async collection => {
      const doc = await collection.findOne({ name: { $eq: "newOne" } })
      expect(doc).toEqual({
        _id: expect.anything(),
        name: "newOne",
      })

      const oldDoc = await collection.findOne({ name: { $eq: "one" } })
      expect(oldDoc).toBeNull()
    })
  })

  it("should be able to delete all records", async () => {
    const query = await createQuery({
      fields: {
        json: {},
        extra: {
          actionType: "deleteMany",
        },
      },
      queryVerb: "delete",
    })

    const result = await config.api.query.execute(query._id!)

    expect(result.data).toEqual([
      {
        acknowledged: true,
        deletedCount: 5,
      },
    ])

    await withCollection(async collection => {
      const docs = await collection.find().toArray()
      expect(docs).toHaveLength(0)
    })
  })

  it("should be able to update all documents", async () => {
    const query = await createQuery({
      fields: {
        json: {
          filter: {},
          update: { $set: { name: "newName" } },
        },
        extra: {
          actionType: "updateMany",
        },
      },
      queryVerb: "update",
    })

    const result = await config.api.query.execute(query._id!)

    expect(result.data).toEqual([
      {
        acknowledged: true,
        matchedCount: 5,
        modifiedCount: 5,
        upsertedCount: 0,
        upsertedId: null,
      },
    ])

    await withCollection(async collection => {
      const docs = await collection.find().toArray()
      expect(docs).toHaveLength(5)
      for (const doc of docs) {
        expect(doc).toEqual({
          _id: expect.anything(),
          name: "newName",
        })
      }
    })
  })
})
