import { default as AirtableIntegration } from "../airtable"

jest.mock("airtable")

class TestConfiguration {
  integration: any
  client: any

  constructor(config: any = {}) {
    this.integration = new AirtableIntegration.integration(config)
    this.client = {
      create: jest.fn(),
      select: jest.fn(() => ({
        firstPage: jest.fn(() => []),
      })),
      update: jest.fn(),
      destroy: jest.fn(),
    }
    this.integration.client = () => this.client
  }
}

describe("Airtable Integration", () => {
  let config: any

  beforeEach(() => {
    config = new TestConfiguration()
  })

  it("calls the create method with the correct params", async () => {
    await config.integration.create({
      table: "test",
      json: {},
    })
    expect(config.client.create).toHaveBeenCalledWith([
      {
        fields: {},
      },
    ])
  })

  it("calls the read method with the correct params", async () => {
    await config.integration.read({
      table: "test",
      view: "Grid view",
    })
    expect(config.client.select).toHaveBeenCalledWith({
      maxRecords: 10,
      view: "Grid view",
    })
  })

  it("calls the update method with the correct params", async () => {
    await config.integration.update({
      table: "table",
      id: "123",
      json: {
        name: "test",
      },
    })
    expect(config.client.update).toHaveBeenCalledWith([
      {
        id: "123",
        fields: { name: "test" },
      },
    ])
  })

  it("calls the delete method with the correct params", async () => {
    const ids = [1, 2, 3, 4]
    await config.integration.delete({
      ids,
    })
    expect(config.client.destroy).toHaveBeenCalledWith(ids)
  })
})
