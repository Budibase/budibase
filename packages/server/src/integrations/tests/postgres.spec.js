
const Airtable = require("airtable")
const { ElectronHttpExecutor } = require("electron-updater/out/electronHttpExecutor")
const AirtableIntegration = require("../airtable")
jest.mock("airtable")

class TestConfiguration {
  constructor(config = {}) {
    this.integration = new AirtableIntegration.integration(config) 
  }
}

describe("Airtable Integration", () => {
  let config 

  beforeEach(() => {
    config = new TestConfiguration()
  })

  it("calls the create method with the correct params", async () => {
    const response = await config.integration.create({
      table: "test",
      json: ""
    })
    expect(config.integration.client.create).toHaveBeenCalledWith({})
  })

  it("calls the read method with the correct params", () => {

  })

  it("calls the update method with the correct params", () => {

  })

  it("calls the delete method with the correct params", () => {

  })
})