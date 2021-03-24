const mongo = require("mongodb")
const MongoDBIntegration = require("../mongodb")
jest.mock("mongodb")

class TestConfiguration {
  constructor(config = {}) {
    this.integration = new MongoDBIntegration.integration(config) 
  }
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
      json: body
    })
    expect(config.integration.client.insertOne).toHaveBeenCalledWith(body)
  })

  it("calls the read method with the correct params", async () => {
    const query = {
      json: {
        address: "test"
      }
    }
    const response = await config.integration.read(query)
    expect(config.integration.client.find).toHaveBeenCalledWith(query.json)
    expect(response).toEqual(expect.any(Array))
  })
})