import TestConfiguration from "../TestConfiguration"
import PublicAPIClient from "../PublicAPIClient"

describe("Public API - /tables endpoints", () => {
  let api: PublicAPIClient
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
    const app = await config.seedApp()
    api = new PublicAPIClient(app.data._id)
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("POST - Create a table", async () => {
    const response = await api.post(`/tables`, {
      body: require("./fixtures/table.json")
    })
    const json = await response.json()
    config.testContext.table = json.data
    expect(response).toHaveStatusCode(200)
  })

  it("POST - Search tables", async () => {
    const response = await api.post(`/tables/search`, {
      body: {
        name: config.testContext.table.name
      }
    })
    expect(response).toHaveStatusCode(200)
  })

  it("GET - Retrieve a table", async () => {
    const response = await api.get(`/tables/${config.testContext.table._id}`)
    expect(response).toHaveStatusCode(200)
  })


  it("PUT - update a table", async () => {
    const response = await api.put(`/tables/${config.testContext.table._id}`, {
      body: require("./fixtures/update_table.json")
    })
    expect(response).toHaveStatusCode(200)
  })
})
