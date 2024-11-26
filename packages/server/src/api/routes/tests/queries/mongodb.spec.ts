import { Datasource, Query } from "@budibase/types"
import {
  DatabaseName,
  datasourceDescribe,
} from "../../../../integrations/tests/utils"
import { MongoClient, type Collection, BSON, Db } from "mongodb"
import { generator } from "@budibase/backend-core/tests"

const expectValidId = expect.stringMatching(/^\w{24}$/)
const expectValidBsonObjectId = expect.any(BSON.ObjectId)

const descriptions = datasourceDescribe({ only: [DatabaseName.MONGODB] })

if (descriptions.length) {
  describe.each(descriptions)(
    "/queries ($dbName)",
    ({ config, dsProvider }) => {
      let collection: string
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
        const client = new MongoClient(datasource.config!.connectionString)
        await client.connect()
        try {
          return await callback(client)
        } finally {
          await client.close()
        }
      }

      async function withDb<T>(callback: (db: Db) => Promise<T>): Promise<T> {
        return await withClient(async client => {
          return await callback(client.db(datasource.config!.db))
        })
      }

      async function withCollection<T>(
        callback: (collection: Collection) => Promise<T>
      ): Promise<T> {
        return await withDb(async db => {
          return await callback(db.collection(collection))
        })
      }

      beforeAll(async () => {
        const ds = await dsProvider()
        datasource = ds.datasource!
      })

      beforeEach(async () => {
        collection = generator.guid()
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
        await withCollection(collection => collection.drop())
      })

      describe("preview", () => {
        it("should generate a nested schema with an empty array", async () => {
          const name = generator.guid()
          await withCollection(
            async collection => await collection.insertOne({ name, nested: [] })
          )

          const preview = await config.api.query.preview({
            name: "New Query",
            datasourceId: datasource._id!,
            fields: {
              json: {
                name: { $eq: name },
              },
              extra: {
                collection,
                actionType: "findOne",
              },
            },
            schema: {},
            queryVerb: "read",
            parameters: [],
            transformer: "return data",
            readable: true,
          })

          expect(preview).toEqual({
            nestedSchemaFields: {},
            rows: [{ _id: expect.any(String), name, nested: [] }],
            schema: {
              _id: {
                type: "string",
                name: "_id",
              },
              name: {
                type: "string",
                name: "name",
              },
              nested: {
                type: "array",
                name: "nested",
              },
            },
          })
        })

        it("should update schema when structure changes from object to array", async () => {
          const name = generator.guid()

          await withCollection(async collection => {
            await collection.insertOne({ name, field: { subfield: "value" } })
          })

          const firstPreview = await config.api.query.preview({
            name: "Test Query",
            datasourceId: datasource._id!,
            fields: {
              json: { name: { $eq: name } },
              extra: {
                collection,
                actionType: "findOne",
              },
            },
            schema: {},
            queryVerb: "read",
            parameters: [],
            transformer: "return data",
            readable: true,
          })

          expect(firstPreview.schema).toEqual(
            expect.objectContaining({
              field: { type: "json", name: "field" },
            })
          )

          await withCollection(async collection => {
            await collection.updateOne(
              { name },
              { $set: { field: ["value1", "value2"] } }
            )
          })

          const secondPreview = await config.api.query.preview({
            name: "Test Query",
            datasourceId: datasource._id!,
            fields: {
              json: { name: { $eq: name } },
              extra: {
                collection,
                actionType: "findOne",
              },
            },
            schema: firstPreview.schema,
            queryVerb: "read",
            parameters: [],
            transformer: "return data",
            readable: true,
          })

          expect(secondPreview.schema).toEqual(
            expect.objectContaining({
              field: { type: "array", name: "field" },
            })
          )
        })

        it("should generate a nested schema based on all of the nested items", async () => {
          const name = generator.guid()
          const item = {
            name,
            contacts: [
              {
                address: "123 Lane",
              },
              {
                address: "456 Drive",
              },
              {
                postcode: "BT1 12N",
                lat: 54.59,
                long: -5.92,
              },
              {
                city: "Belfast",
              },
              {
                address: "789 Avenue",
                phoneNumber: "0800-999-5555",
              },
              {
                name: "Name",
                isActive: false,
              },
            ],
          }

          await withCollection(collection => collection.insertOne(item))

          const preview = await config.api.query.preview({
            name: "New Query",
            datasourceId: datasource._id!,
            fields: {
              json: {
                name: { $eq: name },
              },
              extra: {
                collection,
                actionType: "findOne",
              },
            },
            schema: {},
            queryVerb: "read",
            parameters: [],
            transformer: "return data",
            readable: true,
          })

          expect(preview).toEqual({
            nestedSchemaFields: {
              contacts: {
                address: {
                  type: "string",
                  name: "address",
                },
                postcode: {
                  type: "string",
                  name: "postcode",
                },
                lat: {
                  type: "number",
                  name: "lat",
                },
                long: {
                  type: "number",
                  name: "long",
                },
                city: {
                  type: "string",
                  name: "city",
                },
                phoneNumber: {
                  type: "string",
                  name: "phoneNumber",
                },
                name: {
                  type: "string",
                  name: "name",
                },
                isActive: {
                  type: "boolean",
                  name: "isActive",
                },
              },
            },
            rows: [{ ...item, _id: expect.any(String) }],
            schema: {
              _id: { type: "string", name: "_id" },
              name: { type: "string", name: "name" },
              contacts: { type: "json", name: "contacts", subtype: "array" },
            },
          })
        })
      })

      describe("execute", () => {
        it("a count query", async () => {
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

        it("should be able to updateOne by ObjectId", async () => {
          const insertResult = await withCollection(c =>
            c.insertOne({ name: "one" })
          )
          const query = await createQuery({
            fields: {
              json: {
                filter: {
                  _id: { $eq: `ObjectId("${insertResult.insertedId}")` },
                },
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

        it("a count query with a transformer", async () => {
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

        it("a find query", async () => {
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

        it("a findOne query", async () => {
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

        it("a findOneAndUpdate query", async () => {
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

        it("a distinct query", async () => {
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

        it("a create query with parameters", async () => {
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

        it("a delete query with parameters", async () => {
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

        it("an update query with parameters", async () => {
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
    }
  )
}
