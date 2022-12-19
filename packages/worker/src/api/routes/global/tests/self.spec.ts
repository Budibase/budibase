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
    it("should update self", async () => {
      const user = await config.createUser()
      await config.createSession(user)

      delete user.password
      const res = await config.api.self.updateSelf(user)

      const dbUser = await config.getUser(user.email)
      user._rev = dbUser._rev
      user.dayPassRecordedAt = mocks.date.MOCK_DATE.toISOString()
      expect(res.body._id).toBe(user._id)
      expect(events.user.updated).toBeCalledTimes(1)
      expect(events.user.updated).toBeCalledWith(user)
      expect(events.user.passwordUpdated).not.toBeCalled()
    })

    it("should update password", async () => {
      const user = await config.createUser()
      await config.createSession(user)

      user.password = "newPassword"
      const res = await config.api.self.updateSelf(user)

      const dbUser = await config.getUser(user.email)
      user._rev = dbUser._rev
      user.dayPassRecordedAt = mocks.date.MOCK_DATE.toISOString()
      delete user.password
      expect(res.body._id).toBe(user._id)
      expect(events.user.updated).toBeCalledTimes(1)
      expect(events.user.updated).toBeCalledWith(user)
      expect(events.user.passwordUpdated).toBeCalledTimes(1)
      expect(events.user.passwordUpdated).toBeCalledWith(user)
    })
  })
})
