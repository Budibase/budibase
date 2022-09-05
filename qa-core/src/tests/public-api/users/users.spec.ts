import TestConfiguration from "../TestConfiguration"
import PublicAPIClient from "../PublicAPIClient"

describe("Public API - /users endpoints", () => {
  const api = new PublicAPIClient()
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("POST - Create a user", async () => {
    const response = await api.post(`/users`, {
      body: require("./fixtures/user.json")
    })
    const json = await response.json()
    config.testContext.user = json.data
    expect(response).toHaveStatusCode(200)
  })

  it("POST - Search users", async () => {
    const response = await api.post(`/users/search`, {
      body: {
        name: config.testContext.user.email
      }
    })
    expect(response).toHaveStatusCode(200)
  })

  it("GET - Retrieve a user", async () => {
    const response = await api.get(`/users/${config.testContext.user._id}`)
    expect(response).toHaveStatusCode(200)
  })


  it("PUT - update a user", async () => {
    const response = await api.put(`/users/${config.testContext.user._id}`, { 
      body: require("./fixtures/update_user.json") 
    })
    expect(response).toHaveStatusCode(200)
  })
})
