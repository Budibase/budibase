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
})
