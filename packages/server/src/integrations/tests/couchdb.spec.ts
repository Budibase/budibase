jest.mock(
  "pouchdb",
  () =>
    function CouchDBMock(this: any) {
      this.post = jest.fn()
      this.allDocs = jest.fn(() => ({ rows: [] }))
      this.put = jest.fn()
      this.get = jest.fn()
      this.remove = jest.fn()
      this.plugin = jest.fn()
      this.close = jest.fn()
    }
)

import { default as CouchDBIntegration } from "../couchdb"

class TestConfiguration {
  integration: any

  constructor(config: any = {}) {
    this.integration = new CouchDBIntegration.integration(config)
  }
}

describe("CouchDB Integration", () => {
  let config: any

  beforeEach(() => {
    config = new TestConfiguration()
  })

  it("calls the create method with the correct params", async () => {
    const doc = {
      test: 1,
    }
    const response = await config.integration.create({
      json: doc,
    })
    expect(config.integration.client.post).toHaveBeenCalledWith(doc)
  })

  it("calls the read method with the correct params", async () => {
    const doc = {
      name: "search",
    }

    const response = await config.integration.read({
      json: doc,
    })

    expect(config.integration.client.allDocs).toHaveBeenCalledWith({
      include_docs: true,
      name: "search",
    })
  })

  it("calls the update method with the correct params", async () => {
    const doc = {
      _id: "1234",
      name: "search",
    }

    const response = await config.integration.update({
      json: doc,
    })

    expect(config.integration.client.put).toHaveBeenCalledWith(doc)
  })

  it("calls the delete method with the correct params", async () => {
    const id = "1234"
    const response = await config.integration.delete({ id })
    expect(config.integration.client.get).toHaveBeenCalledWith(id)
    expect(config.integration.client.remove).toHaveBeenCalled()
  })
})
