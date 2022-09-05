import TestConfiguration from "../TestConfiguration"
import PublicAPIClient from "../PublicAPIClient"

describe("Public API - /rows endpoints", () => {
  let api: PublicAPIClient

  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
    const app = await config.seedApp()

    config.testContext.table = await config.seedTable(app.data._id)
    api = new PublicAPIClient(app.data._id)
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("POST - Create a row", async () => {
    const response = await api.post(`/tables/${config.testContext.table._id}/rows`, {
      body: require("./fixtures/row.json")
    })
    const json = await response.json()
    config.testContext.row = json.data
    expect(response).toHaveStatusCode(200)
  })

  it("POST - Search rows", async () => {
    const response = await api.post(`/tables/${config.testContext.table._id}/rows/search`, {
      body: {
        name: config.testContext.row.name
      }
    })
    expect(response).toHaveStatusCode(200)
  })

  it("GET - Retrieve a row", async () => {
    const response = await api.get(`/tables/${config.testContext.table._id}/rows/${config.testContext.row._id}`)
    expect(response).toHaveStatusCode(200)
  })


  it("PUT - update a row", async () => {
    const response = await api.put(`/tables/${config.testContext.table._id}/rows/${config.testContext.row._id}`, {
      body: require("./fixtures/update_row.json")
    })
    expect(response).toHaveStatusCode(200)
  })
})
