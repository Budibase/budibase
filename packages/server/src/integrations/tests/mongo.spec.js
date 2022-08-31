const mongo = require("mongodb")
const MongoDBIntegration = require("../mongodb")
jest.mock("mongodb")

class TestConfiguration {
  constructor(config = {}) {
    this.integration = new MongoDBIntegration.integration(config)
  }
}

function disableConsole() {
  jest.spyOn(console, "error")
  console.error.mockImplementation(() => {})

  return console.error.mockRestore
}

describe("MongoDB Integration", () => {
  let config
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
      extra: { collection: "testCollection", actionTypes: "insertOne" },
    })
    expect(config.integration.client.insertOne).toHaveBeenCalledWith(body)
  })

  it("calls the read method with the correct params", async () => {
    const query = {
      json: {
        address: "test",
      },
      extra: { collection: "testCollection", actionTypes: "find" },
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
          opt: "option"
        }
      },
      extra: { collection: "testCollection", actionTypes: "deleteOne" },
    }
    await config.integration.delete(query)
    expect(config.integration.client.deleteOne).toHaveBeenCalledWith(query.json.filter, query.json.options)
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
      extra: { collection: "testCollection", actionTypes: "updateOne" },
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
      extra: { collection: "testCollection", actionTypes: "deleteOne" },
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
          name: "ObjectId('BBBB12345678ABCD12345678')"
        },
        update: {
          _id: "ObjectId('FFFF12345678ABCD12345678')",
          name: "ObjectId('CCCC12345678ABCD12345678')",
        },
        options: {
          upsert: false,
        },
      },
      extra: { collection: "testCollection", actionTypes: "updateOne" },
    }
    await config.integration.update(query)
    expect(config.integration.client.updateOne).toHaveBeenCalled()
    
    const args = config.integration.client.updateOne.mock.calls[0]
    expect(args[0]).toEqual({
      _id: mongo.ObjectID.createFromHexString("ACBD12345678ABCD12345678"),
      name: mongo.ObjectID.createFromHexString("BBBB12345678ABCD12345678"),
    })
    expect(args[1]).toEqual({
      _id: mongo.ObjectID.createFromHexString("FFFF12345678ABCD12345678"),
      name: mongo.ObjectID.createFromHexString("CCCC12345678ABCD12345678"),
    })
    expect(args[2]).toEqual({
      upsert: false
    })
  })

  it("creates ObjectIds if the $ operator fields contains a match on ObjectId", async () => {
    const query = {
      json: {
        filter: {
          _id: {
            $eq: "ObjectId('ACBD12345678ABCD12345678')",
          }
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
      extra: { collection: "testCollection", actionTypes: "updateOne" },
    }
    await config.integration.update(query)
    expect(config.integration.client.updateOne).toHaveBeenCalled()
    
    const args = config.integration.client.updateOne.mock.calls[0]
    expect(args[0]).toEqual({
      _id: {
        $eq: mongo.ObjectID.createFromHexString("ACBD12345678ABCD12345678"),
      }
    })
    expect(args[1]).toEqual({
      $set: {
        _id: mongo.ObjectID.createFromHexString("FFFF12345678ABCD12345678"),
      }
    })
    expect(args[2]).toEqual({
      upsert: true
    })
  })

  it("supports findOneAndUpdate", async () => {
    const query = {
      json: {
        filter: {
          _id: {
            $eq: "ObjectId('ACBD12345678ABCD12345678')",
          }
        },
        update: {
          $set: {
            name: "UPDATED",
            age: 99
          },
        },
        options: {
          upsert: false,
        },
      },
      extra: { collection: "testCollection", actionTypes: "findOneAndUpdate" },
    }
    await config.integration.read(query)
    expect(config.integration.client.findOneAndUpdate).toHaveBeenCalled()
    
    const args = config.integration.client.findOneAndUpdate.mock.calls[0]
    expect(args[0]).toEqual({
      _id: {
        $eq: mongo.ObjectID.createFromHexString("ACBD12345678ABCD12345678"),
      }
    })
    expect(args[1]).toEqual({
      $set: {
        name: "UPDATED",
        age: 99
      }
    })
    expect(args[2]).toEqual({
      upsert: false
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
      extra: { collection: "testCollection", actionTypes: "updateOne" },
    }
    await config.integration.update(query)
    expect(config.integration.client.updateOne).toHaveBeenCalled()
    
    const args = config.integration.client.updateOne.mock.calls[0]
    expect(args[0]).toEqual({
      _id: {
        $eq: mongo.ObjectID.createFromHexString("ACBD12345678ABCD12345678"),
      }
    })
    expect(args[1]).toEqual({
      $set: {
        value: {
          data: [
            { cid: 1 },
            { cid: 2 },
            { nested: {
              name: "test"
            }}
          ]
        },
      },
    })
    expect(args[2]).toEqual({
      upsert: true
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
      extra: { collection: "testCollection", actionTypes: "updateOne" },
    }
    await config.integration.update(query)
    expect(config.integration.client.updateOne).toHaveBeenCalled()
    
    const args = config.integration.client.updateOne.mock.calls[0]
    expect(args[0]).toEqual({
      _id: {
        $eq: mongo.ObjectID.createFromHexString("ACBD12345678ABCD12345678"),
      }
    })
    expect(args[1]).toEqual({
      $set: {
        value: {
          data: [
            { cid: 1 },
            { cid: 2 },
            { nested: {
              name: "te}st"
            }}
          ]
        },
      },
    })
    expect(args[2]).toEqual({
      upsert: true,
      extra: "ad\"{\"d"
    })
  })
})
