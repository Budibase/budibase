import TestConfiguration from "../../../config/public-api/TestConfiguration"
import PublicAPIClient from "../../../config/public-api/TestConfiguration/PublicAPIClient"
import generateUser from "../../../config/public-api/fixtures/users"
import { User } from "@budibase/server/api/controllers/public/mapping/types"

describe("Public API - /users endpoints", () => {
  const api = new PublicAPIClient()
  const config = new TestConfiguration<User>(api)

  beforeAll(async () => {
    await config.beforeAll()
    const [_, user] = await config.users.seed()
    config.context = user
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("POST - Create a user", async () => {
    const [response, user] = await config.users.create(generateUser())
    expect(response).toHaveStatusCode(200)
    expect(user._id).toBeDefined()
  })

  it("POST - Search users", async () => {
    const [response, users] = await config.users.search({
      name: config.context.email,
    })
    expect(response).toHaveStatusCode(200)
    expect(users[0]).toEqual(config.context)
  })

  it("GET - Retrieve a user", async () => {
    const [response, user] = await config.users.read(config.context._id)
    expect(response).toHaveStatusCode(200)
    expect(user).toEqual(config.context)
  })

  it("PUT - update a user", async () => {
    config.context.firstName = "Updated First Name"
    const [response, user] = await config.users.update(
      config.context._id,
      config.context
    )
    expect(response).toHaveStatusCode(200)
    expect(user).toEqual(config.context)
  })
})
