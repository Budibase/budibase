import TestConfiguration from "../TestConfiguration"
import PublicAPIClient from "../PublicAPIClient"
import generateApp from "./fixtures/generate"

describe("Public API - /applications endpoints", () => {
  const api = new PublicAPIClient()
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("POST - Create a application", async () => {
    const response = await api.post(`/applications`, {
      body: generateApp()
    })
    const json = await response.json()
    config.testContext.application = json.data
    expect(response).toHaveStatusCode(200)
  })

  it("POST - Search applications", async () => {
    const response = await api.post(`/applications/search`, {
      body: {
        name: config.testContext.application.name
      }
    })
    expect(response).toHaveStatusCode(200)
  })

  it("GET - Retrieve a application", async () => {
    const response = await api.get(`/applications/${config.testContext.application._id}`)
    expect(response).toHaveStatusCode(200)
  })


  it("PUT - update a application", async () => {
    const response = await api.put(`/applications/${config.testContext.application._id}`, {
      body: require("./fixtures/update_application.json")
    })
    expect(response).toHaveStatusCode(200)
  })
})
