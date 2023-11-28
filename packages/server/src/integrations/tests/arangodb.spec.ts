import { default as ArangoDBIntegration } from "../arangodb"

jest.mock("arangojs")

class TestConfiguration {
  integration: any

  constructor(config: any = {}) {
    this.integration = new ArangoDBIntegration.integration(config)
  }
}

describe("ArangoDB Integration", () => {
  let config: any
  let indexName = "Users"

  beforeEach(() => {
    config = new TestConfiguration()
  })

  it("calls the create method with the correct params", async () => {
    const body = {
      json: "Hello",
    }

    const response = await config.integration.create(body)
    expect(config.integration.client.query).toHaveBeenCalledWith(
      `INSERT Hello INTO collection RETURN NEW`
    )
  })

  it("calls the read method with the correct params", async () => {
    const query = {
      sql: `test`,
    }
    const response = await config.integration.read(query)
    expect(config.integration.client.query).toHaveBeenCalledWith(query.sql)
  })
})
