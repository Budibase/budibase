import { default as ElasticSearchIntegration } from "../elasticsearch"

jest.mock("@elastic/elasticsearch")

class TestConfiguration {
  integration: any

  constructor(config: any = {}) {
    this.integration = new ElasticSearchIntegration.integration(config)
  }
}

describe("Elasticsearch Integration", () => {
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
    })
    expect(config.integration.client.index).toHaveBeenCalledWith({
      index: indexName,
      body,
    })
  })

  it("calls the read method with the correct params", async () => {
    const body = {
      query: {
        term: {
          name: "kimchy",
        },
      },
    }
    const response = await config.integration.read({
      index: indexName,
      json: body,
    })
    expect(config.integration.client.search).toHaveBeenCalledWith({
      index: indexName,
      body,
    })
    expect(response).toEqual(expect.any(Array))
  })

  it("calls the update method with the correct params", async () => {
    const body = {
      name: "updated",
    }

    const response = await config.integration.update({
      id: "1234",
      index: indexName,
      json: body,
    })

    expect(config.integration.client.update).toHaveBeenCalledWith({
      id: "1234",
      index: indexName,
      body,
    })
    expect(response).toEqual(expect.any(Array))
  })

  it("calls the delete method with the correct params", async () => {
    const body = {
      id: "1234",
    }

    const response = await config.integration.delete(body)

    expect(config.integration.client.delete).toHaveBeenCalledWith(body)
    expect(response).toEqual(expect.any(Array))
  })
})
