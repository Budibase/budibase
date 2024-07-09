jest.mock("@budibase/backend-core", () => {
  const core = jest.requireActual("@budibase/backend-core")
  return {
    ...core,
    db: {
      ...core.db,
      DatabaseWithConnection: function () {
        return {
          allDocs: jest.fn().mockReturnValue({ rows: [] }),
          put: jest.fn(),
          get: jest.fn().mockReturnValue({ _rev: "a" }),
          remove: jest.fn(),
        }
      },
    },
  }
})

import { default as CouchDBIntegration } from "../couchdb"

class TestConfiguration {
  integration: any

  constructor(
    config: any = { url: "http://somewhere", database: "something" }
  ) {
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
    await config.integration.create({
      json: JSON.stringify(doc),
    })
    expect(config.integration.client.put).toHaveBeenCalledWith(doc)
  })

  it("calls the read method with the correct params", async () => {
    const doc = {
      name: "search",
    }

    await config.integration.read({
      json: JSON.stringify(doc),
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

    await config.integration.update({
      json: JSON.stringify(doc),
    })

    expect(config.integration.client.put).toHaveBeenCalledWith({
      ...doc,
      _rev: "a",
    })
  })

  it("calls the delete method with the correct params", async () => {
    const id = "1234"
    await config.integration.delete({ id })
    expect(config.integration.client.remove).toHaveBeenCalledWith(id)
  })
})
