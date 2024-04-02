import { Datasource, Query } from "@budibase/types"
import * as setup from "../utilities"
import { databaseTestProviders } from "../../../../integrations/tests/utils"
import { MongoClient, type Collection, BSON } from "mongodb"

const collection = "test_collection"

const expectValidId = expect.stringMatching(/^\w{24}$/)
const expectValidBsonObjectId = expect.any(BSON.ObjectId)

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
    return await config.api.query.save(combinedQuery)
  }

  async function withClient<T>(
    callback: (client: MongoClient) => Promise<T>
  ): Promise<T> {
    const ds = await databaseTestProviders.mongodb.datasource()
    const client = new MongoClient(ds.config!.connectionString)
    await client.connect()
    try {
      return await callback(client)
    } finally {
      await client.close()
    }
  }

  async function withCollection<T>(
    callback: (collection: Collection) => Promise<T>
  ): Promise<T> {
    return await withClient(async client => {
      const db = client.db(
        (await databaseTestProviders.mongodb.datasource()).config!.db
      )
      return await callback(db.collection(collection))
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
      { _id: expectValidId, name: "one" },
      { _id: expectValidId, name: "two" },
      { _id: expectValidId, name: "three" },
      { _id: expectValidId, name: "four" },
      { _id: expectValidId, name: "five" },
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

    expect(result.data).toEqual([{ _id: expectValidId, name: "one" }])
  })

  it("should execute a findOneAndUpdate query", async () => {
    const query = await createQuery({
      fields: {
        json: {
          filter: { name: { $eq: "one" } },
          update: { $set: { name: "newName" } },
        },
        extra: {
          actionType: "findOneAndUpdate",
        },
      },
    })

    const result = await config.api.query.execute(query._id!)

    expect(result.data).toEqual([
      {
        lastErrorObject: { n: 1, updatedExisting: true },
        ok: 1,
        value: { _id: expectValidId, name: "one" },
      },
    ])

    await withCollection(async collection => {
      expect(await collection.countDocuments()).toBe(5)

      const doc = await collection.findOne({ name: { $eq: "newName" } })
      expect(doc).toEqual({
        _id: expectValidBsonObjectId,
        name: "newName",
      })
    })
  })

  it("should execute a distinct query", async () => {
    const query = await createQuery({
      fields: {
        json: "name",
        extra: {
          actionType: "distinct",
        },
      },
    })

    const result = await config.api.query.execute(query._id!)
    const values = result.data.map(o => o.value).sort()
    expect(values).toEqual(["five", "four", "one", "three", "two"])
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
        insertedId: expectValidId,
      },
    ])

    await withCollection(async collection => {
      const doc = await collection.findOne({ foo: { $eq: "bar" } })
      expect(doc).toEqual({
        _id: expectValidBsonObjectId,
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
        _id: expectValidBsonObjectId,
        name: "newOne",
      })

      const oldDoc = await collection.findOne({ name: { $eq: "one" } })
      expect(oldDoc).toBeNull()
    })
  })

  it("should be able to updateOne by ObjectId", async () => {
    const insertResult = await withCollection(c => c.insertOne({ name: "one" }))
    const query = await createQuery({
      fields: {
        json: {
          filter: { _id: { $eq: `ObjectId("${insertResult.insertedId}")` } },
          update: { $set: { name: "newName" } },
        },
        extra: {
          actionType: "updateOne",
        },
      },
      queryVerb: "update",
    })

    const result = await config.api.query.execute(query._id!)

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
      const doc = await collection.findOne({ name: { $eq: "newName" } })
      expect(doc).toEqual({
        _id: insertResult.insertedId,
        name: "newName",
      })
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
          _id: expectValidBsonObjectId,
          name: "newName",
        })
      }
    })
  })

  it("should throw an error if the incorrect actionType is specified", async () => {
    const verbs = ["read", "create", "update", "delete"]
    for (const verb of verbs) {
      const query = await createQuery({
        fields: { json: {}, extra: { actionType: "invalid" } },
        queryVerb: verb,
      })
      await config.api.query.execute(query._id!, undefined, { status: 400 })
    }
  })

  it("should ignore extra brackets in query", async () => {
    const query = await createQuery({
      fields: {
        json: { foo: "te}st" },
        extra: {
          actionType: "insertOne",
        },
      },
      queryVerb: "create",
    })

    const result = await config.api.query.execute(query._id!)
    expect(result.data).toEqual([
      {
        acknowledged: true,
        insertedId: expectValidId,
      },
    ])

    await withCollection(async collection => {
      const doc = await collection.findOne({ foo: { $eq: "te}st" } })
      expect(doc).toEqual({
        _id: expectValidBsonObjectId,
        foo: "te}st",
      })
    })
  })

  it("should be able to save deeply nested data", async () => {
    const data = {
      foo: "bar",
      data: [
        { cid: 1 },
        { cid: 2 },
        {
          nested: {
            name: "test",
            ary: [1, 2, 3],
            aryOfObjects: [{ a: 1 }, { b: 2 }],
          },
        },
      ],
    }
    const query = await createQuery({
      fields: {
        json: data,
        extra: {
          actionType: "insertOne",
        },
      },
      queryVerb: "create",
    })

    const result = await config.api.query.execute(query._id!)
    expect(result.data).toEqual([
      {
        acknowledged: true,
        insertedId: expectValidId,
      },
    ])

    await withCollection(async collection => {
      const doc = await collection.findOne({ foo: { $eq: "bar" } })
      expect(doc).toEqual({
        _id: expectValidBsonObjectId,
        ...data,
      })
    })
  })
})
