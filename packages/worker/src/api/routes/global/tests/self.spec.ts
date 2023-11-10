jest.mock("nodemailer")
import { TestConfiguration, mocks } from "../../../../tests"
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
          password: "newPassword",
        })
        .expect(200)

      const dbUser = (await config.getUser(user.email))!

      user._rev = dbUser._rev
      user.dayPassRecordedAt = mocks.date.MOCK_DATE.toISOString()
      expect(res.body._id).toBe(user._id)
      expect(events.user.updated).toBeCalledTimes(1)
      expect(events.user.updated).toBeCalledWith(dbUser)
      expect(events.user.passwordUpdated).toBeCalledTimes(1)
      expect(events.user.passwordUpdated).toBeCalledWith(dbUser)
    })
  })

  it("should update onboarding", async () => {
    const user = await config.createUser()
    await config.createSession(user)

    const res = await config.api.self
      .updateSelf(user, {
        onboardedAt: "2023-03-07T14:10:54.869Z",
      })
      .expect(200)

    const dbUser = (await config.getUser(user.email))!

    user._rev = dbUser._rev
    user.dayPassRecordedAt = mocks.date.MOCK_DATE.toISOString()
    expect(dbUser.onboardedAt).toBe("2023-03-07T14:10:54.869Z")
    expect(res.body._id).toBe(user._id)
  })
})
