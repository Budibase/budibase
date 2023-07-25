import { TestConfiguration, structures } from "../../../../tests"
import { User } from "@budibase/types"

const MOCK_APP_ID = "app_a"

describe("/api/global/users/:userId/app/builder", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  async function newUser() {
    const base = structures.users.user()
    return await config.createUser(base)
  }

  async function getUser(userId: string) {
    const response = await config.api.users.getUser(userId)
    return response.body as User
  }

  async function grantAppBuilder(): Promise<User> {
    const user = await newUser()
    await config.api.users.grantAppBuilder(user._id!)
    return await getUser(user._id!)
  }

  describe("POST /api/global/users/:userId/app/builder", () => {
    it("should be able to grant a user builder permissions", async () => {
      const user = await grantAppBuilder()
      expect(user.builder?.appBuilder).toBe(true)
    })
  })

  describe("PATCH /api/global/users/:userId/app/:appId/builder", () => {
    it("shouldn't allow granting access to an app to a non-app builder", async () => {
      const user = await newUser()
      await config.api.users.grantBuilderToApp(user._id!, MOCK_APP_ID, 400)
    })

    it("should be able to grant a user access to a particular app", async () => {
      const user = await grantAppBuilder()
      await config.api.users.grantBuilderToApp(user._id!, MOCK_APP_ID)
      const updated = await getUser(user._id!)
      expect(updated.builder?.appBuilder).toBe(true)
      expect(updated.builder?.apps).toBe([MOCK_APP_ID])
    })
  })

  describe("DELETE /api/global/users/:userId/app/:appId/builder", () => {
    it("should allow revoking access", async () => {
      const user = await grantAppBuilder()
      await config.api.users.grantBuilderToApp(user._id!, MOCK_APP_ID)
      let updated = await getUser(user._id!)
      expect(updated.builder?.apps).toBe([MOCK_APP_ID])
      await config.api.users.revokeBuilderToApp(user._id!, MOCK_APP_ID)
      updated = await getUser(user._id!)
      expect(updated.builder?.apps).toBe([])
    })
  })
})
