const { ElectronHttpExecutor } = require("electron-updater/out/electronHttpExecutor")
const { integration } = require("../airtable")
const Airtable = require("airtable")
jest.mock("airtable")

class TestConfiguration {
  constructor(config = {}) {
    this.integration = new integration(config) 
  }
}

xdescribe("Airtable Integration", () => {
  let config 

  beforeEach(() => {
    config = new TestConfiguration()
  })

  it("calls the create method with the correct params", async () => {
    const response = await config.integration.create({
      table: "test",
      json: {}
    })
    console.log(config.integration.client)
    expect(config.integration.client.create).toHaveBeenCalledWith({})
  })

  it("calls the read method with the correct params", () => {

  })

  it("calls the update method with the correct params", () => {

  })

  it("calls the delete method with the correct params", () => {

  })
})