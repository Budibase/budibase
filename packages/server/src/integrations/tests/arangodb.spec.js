const arangodb = require("arangojs")
const ArangoDBIntegration = require("../arangodb")
jest.mock("arangojs")

class TestConfiguration {
  constructor(config = {}) {
    this.integration = new ArangoDBIntegration.integration(config) 
  }
}

describe("ArangoDB Integration", () => {
  let config 
  let indexName = "Users"

  beforeEach(() => {
    config = new TestConfiguration()
  })

  it("calls the create method with the correct params", async () => {
    const body = {
      json: "Hello"
    }

    const response = await config.integration.create(body)
    expect(config.integration.client.query).toHaveBeenCalledWith(`INSERT Hello INTO collection RETURN NEW`)
  })

  it("calls the read method with the correct params", async () => {
    const query = {
      json: `test`, 
    }
    const response = await config.integration.read(query)
    expect(config.integration.client.query).toHaveBeenCalledWith(query.sql)
  })
})