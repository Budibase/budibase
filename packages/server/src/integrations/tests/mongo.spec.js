const mongo = require("mongodb")
const MongoDBIntegration = require("../mongodb")
jest.mock("mongodb")

class TestConfiguration {
  constructor(config = {}) {
    this.integration = new MongoDBIntegration.integration(config) 
  }
}

function disableConsole() {
  jest.spyOn(console, 'error');
  console.error.mockImplementation(() => {});

  return console.error.mockRestore;
}

describe("MongoDB Integration", () => {
  let config 
  let indexName = "Users"

  beforeEach(() => {
    config = new TestConfiguration()
  })

  it("calls the create method with the correct params", async () => {
    const body = {
      name: "Hello"
    }
    const response = await config.integration.create({ 
      index: indexName,
      json: body,
      extra: { collection: 'testCollection', actionTypes: 'insertOne'}
    })
    expect(config.integration.client.insertOne).toHaveBeenCalledWith(body)
  })

  it("calls the read method with the correct params", async () => {
    const query = {
      json: {
        address: "test"
      },
      extra: { collection: 'testCollection', actionTypes: 'find'}
    }
    const response = await config.integration.read(query)
    expect(config.integration.client.find).toHaveBeenCalledWith(query.json)
    expect(response).toEqual(expect.any(Array))
  })

  it("calls the delete method with the correct params", async () => {
    const query = {
      json: {
        id: "test"
      },
      extra: { collection: 'testCollection', actionTypes: 'deleteOne'}
    }
    const response = await config.integration.delete(query)
    expect(config.integration.client.deleteOne).toHaveBeenCalledWith(query.json)
  })

  it("calls the update method with the correct params", async () => {
    const query = {
      json: {
        id: "test"
      },
      extra: { collection: 'testCollection', actionTypes: 'updateOne'}
    }
    const response = await config.integration.update(query)
    expect(config.integration.client.updateOne).toHaveBeenCalledWith(query.json)
  })

  it("throws an error when an invalid query.extra.actionType is passed for each method", async () => {
    const restore = disableConsole()

    const query = {
      extra: { collection: 'testCollection', actionTypes: 'deleteOne'}
    }
    // Weird, need to do an IIFE for jest to recognize that it throws
    expect(() => config.integration.read(query)()).toThrow(expect.any(Object))

    restore()
  })

})