import TestConfiguration from "../../config/TestConfiguration"
import * as fixtures from "../../fixtures"
import { User } from "../../../types"

describe("Public API - /users endpoints", () => {
  const config = new TestConfiguration<User>()

  beforeAll(async () => {
    await config.beforeAll()
    const [_, user] = await config.api.users.seed()
    config.context = user
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("POST - Create a user", async () => {
    const [response, user] = await config.api.users.create(
      fixtures.users.generateUser()
    )
    expect(response).toHaveStatusCode(200)
    expect(user._id).toBeDefined()
  })

  it("POST - Search users", async () => {
    const [response, users] = await config.api.users.search({
      name: config.context.email,
    })
    expect(response).toHaveStatusCode(200)
    expect(users[0]).toEqual(config.context)
  })

  it("GET - Retrieve a user", async () => {
    const [response, user] = await config.api.users.read(config.context._id)
    expect(response).toHaveStatusCode(200)
    expect(user).toEqual(config.context)
  })

  it("PUT - update a user", async () => {
    config.context.firstName = "Updated First Name"
    const [response, user] = await config.api.users.update(
      config.context._id,
      config.context
    )
    expect(response).toHaveStatusCode(200)
    expect(user).toEqual(config.context)
  })
})
