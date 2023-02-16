const mongo = require("mongodb")
import { default as MongoDBIntegration } from "../mongodb"
jest.mock("mongodb")

class TestConfiguration {
  integration: any

  constructor(config: any = {}) {
    this.integration = new MongoDBIntegration.integration(config)
  }
}

function disableConsole() {
  jest.spyOn(console, "error")
  // @ts-ignore
  console.error.mockImplementation(() => {})

  // @ts-ignore
  return console.error.mockRestore
}

describe("MongoDB Integration", () => {
  let config: any
  let indexName = "Users"

  beforeEach(() => {
    config = new TestConfiguration()
  })

  it("calls the create method with the correct params", async () => {
    const body = {
      name: "Hello",
    }
    await config.integration.create({
      index: indexName,
      json: body,
      extra: { collection: "testCollection", actionType: "insertOne" },
    })
    expect(config.integration.client.insertOne).toHaveBeenCalledWith(body)
  })

  it("calls the read method with the correct params", async () => {
    const query = {
      json: {
        address: "test",
      },
      extra: { collection: "testCollection", actionType: "find" },
    }
    const response = await config.integration.read(query)
    expect(config.integration.client.find).toHaveBeenCalledWith(query.json)
    expect(response).toEqual(expect.any(Array))
  })

  it("calls the delete method with the correct params", async () => {
    const query = {
      json: {
        filter: {
          id: "test",
        },
        options: {
          opt: "option",
        },
      },
      extra: { collection: "testCollection", actionType: "deleteOne" },
    }
    await config.integration.delete(query)
    expect(config.integration.client.deleteOne).toHaveBeenCalledWith(
      query.json.filter,
      query.json.options
    )
  })

  it("calls the update method with the correct params", async () => {
    const query = {
      json: {
        filter: {
          id: "test",
        },
        update: {
          name: "TestName",
        },
        options: {
          upsert: false,
        },
      },
      extra: { collection: "testCollection", actionType: "updateOne" },
    }
    await config.integration.update(query)
    expect(config.integration.client.updateOne).toHaveBeenCalledWith(
      query.json.filter,
      query.json.update,
      query.json.options
    )
  })

  it("throws an error when an invalid query.extra.actionType is passed for each method", async () => {
    const restore = disableConsole()

    const query = {
      extra: { collection: "testCollection", actionType: "deleteOne" },
    }

    let error = null
    try {
      await config.integration.read(query)
    } catch (err) {
      error = err
    }
    expect(error).toBeDefined()
    restore()
  })

  it("creates ObjectIds if the field contains a match on ObjectId", async () => {
    const query = {
      json: {
        filter: {
          _id: "ObjectId('ACBD12345678ABCD12345678')",
          name: "ObjectId('BBBB12345678ABCD12345678')",
        },
        update: {
          _id: "ObjectId('FFFF12345678ABCD12345678')",
          name: "ObjectId('CCCC12345678ABCD12345678')",
        },
        options: {
          upsert: false,
        },
      },
      extra: { collection: "testCollection", actionType: "updateOne" },
    }
    await config.integration.update(query)
    expect(config.integration.client.updateOne).toHaveBeenCalled()

    const args = config.integration.client.updateOne.mock.calls[0]
    expect(args[0]).toEqual({
      _id: mongo.ObjectId.createFromHexString("ACBD12345678ABCD12345678"),
      name: mongo.ObjectId.createFromHexString("BBBB12345678ABCD12345678"),
    })
    expect(args[1]).toEqual({
      _id: mongo.ObjectId.createFromHexString("FFFF12345678ABCD12345678"),
      name: mongo.ObjectId.createFromHexString("CCCC12345678ABCD12345678"),
    })
    expect(args[2]).toEqual({
      upsert: false,
    })
  })

  it("creates ObjectIds if the $ operator fields contains a match on ObjectId", async () => {
    const query = {
      json: {
        filter: {
          _id: {
            $eq: "ObjectId('ACBD12345678ABCD12345678')",
          },
        },
        update: {
          $set: {
            _id: "ObjectId('FFFF12345678ABCD12345678')",
          },
        },
        options: {
          upsert: true,
        },
      },
      extra: { collection: "testCollection", actionType: "updateOne" },
    }
    await config.integration.update(query)
    expect(config.integration.client.updateOne).toHaveBeenCalled()

    const args = config.integration.client.updateOne.mock.calls[0]
    expect(args[0]).toEqual({
      _id: {
        $eq: mongo.ObjectId.createFromHexString("ACBD12345678ABCD12345678"),
      },
    })
    expect(args[1]).toEqual({
      $set: {
        _id: mongo.ObjectId.createFromHexString("FFFF12345678ABCD12345678"),
      },
    })
    expect(args[2]).toEqual({
      upsert: true,
    })
  })

  it("supports findOneAndUpdate", async () => {
    const query = {
      json: {
        filter: {
          _id: {
            $eq: "ObjectId('ACBD12345678ABCD12345678')",
          },
        },
        update: {
          $set: {
            name: "UPDATED",
            age: 99,
          },
        },
        options: {
          upsert: false,
        },
      },
      extra: { collection: "testCollection", actionType: "findOneAndUpdate" },
    }
    await config.integration.read(query)
    expect(config.integration.client.findOneAndUpdate).toHaveBeenCalled()

    const args = config.integration.client.findOneAndUpdate.mock.calls[0]
    expect(args[0]).toEqual({
      _id: {
        $eq: mongo.ObjectId.createFromHexString("ACBD12345678ABCD12345678"),
      },
    })
    expect(args[1]).toEqual({
      $set: {
        name: "UPDATED",
        age: 99,
      },
    })
    expect(args[2]).toEqual({
      upsert: false,
    })
  })

  it("can parse nested objects with arrays", async () => {
    const query = {
      json: `{
          "_id": {
            "$eq": "ObjectId('ACBD12345678ABCD12345678')"
          }
        },
        {
          "$set": {
            "value": {
              "data": [
                { "cid": 1 },
                { "cid": 2 },
                { "nested": {
                  "name": "test"
                }}
              ]
            }
          }
        },
        {
          "upsert": true
        }`,
      extra: { collection: "testCollection", actionType: "updateOne" },
    }
    await config.integration.update(query)
    expect(config.integration.client.updateOne).toHaveBeenCalled()

    const args = config.integration.client.updateOne.mock.calls[0]
    expect(args[0]).toEqual({
      _id: {
        $eq: mongo.ObjectId.createFromHexString("ACBD12345678ABCD12345678"),
      },
    })
    expect(args[1]).toEqual({
      $set: {
        value: {
          data: [
            { cid: 1 },
            { cid: 2 },
            {
              nested: {
                name: "test",
              },
            },
          ],
        },
      },
    })
    expect(args[2]).toEqual({
      upsert: true,
    })
  })

  it("ignores braces within strings when parsing nested objects", async () => {
    const query = {
      json: `{
          "_id": {
            "$eq": "ObjectId('ACBD12345678ABCD12345678')"
          }
        },
        {
          "$set": {
            "value": {
              "data": [
                { "cid": 1 },
                { "cid": 2 },
                { "nested": {
                  "name": "te}st"
                }}
              ]
            }
          }
        },
        {
          "upsert": true,
          "extra": "ad\\"{\\"d"
        }`,
      extra: { collection: "testCollection", actionType: "updateOne" },
    }
    await config.integration.update(query)
    expect(config.integration.client.updateOne).toHaveBeenCalled()

    const args = config.integration.client.updateOne.mock.calls[0]
    expect(args[0]).toEqual({
      _id: {
        $eq: mongo.ObjectId.createFromHexString("ACBD12345678ABCD12345678"),
      },
    })
    expect(args[1]).toEqual({
      $set: {
        value: {
          data: [
            { cid: 1 },
            { cid: 2 },
            {
              nested: {
                name: "te}st",
              },
            },
          ],
        },
      },
    })
    expect(args[2]).toEqual({
      upsert: true,
      extra: 'ad"{"d',
    })
  })
})
