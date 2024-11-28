jest.mock("nodemailer")
import { TestConfiguration } from "../../../../tests"
import { events } from "@budibase/backend-core"

describe("/api/global/self", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("update", () => {
    it("should reject updates with forbidden keys", async () => {
      const user = await config.createUser()
      await config.createSession(user)
      delete user.password

      await config.api.self.updateSelf(user, user).expect(400)
    })

    it("should update password", async () => {
      const user = await config.createUser()
      await config.createSession(user)

      const res = await config.api.self
        .updateSelf(user, {
          password: "newPassword1",
        })
        .expect(200)

      const dbUser = (await config.getUser(user.email))!

      user._rev = dbUser._rev
      expect(res.body._id).toBe(user._id)
      expect(events.user.updated).toHaveBeenCalledTimes(1)
      expect(events.user.updated).toHaveBeenCalledWith(dbUser)
      expect(events.user.passwordUpdated).toHaveBeenCalledTimes(1)
      expect(events.user.passwordUpdated).toHaveBeenCalledWith(dbUser)
    })
  })

  it("should update onboarding", async () => {
    const user = await config.createUser()
    await config.createSession(user)

    const res = await config.api.self
      .updateSelf(user, {
        onboardedAt: "2023-03-07T14:10:54.869Z",
        freeTrialConfirmedAt: "2024-03-17T14:10:54.869Z",
      })
      .expect(200)

    const dbUser = (await config.getUser(user.email))!

    user._rev = dbUser._rev
    expect(dbUser.onboardedAt).toBe("2023-03-07T14:10:54.869Z")
    expect(dbUser.freeTrialConfirmedAt).toBe("2024-03-17T14:10:54.869Z")
    expect(res.body._id).toBe(user._id)
  })
})
