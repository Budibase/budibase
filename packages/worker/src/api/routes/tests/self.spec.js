jest.mock("nodemailer")
const { config, request } = require("../../../tests")
const { events } = require("@budibase/backend-core")

describe("/api/global/self", () => {

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const updateSelf = async (user) => {
    const res = await request
      .post(`/api/global/self`)
      .send(user)
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    return res
  }

  describe("update", () => {

    it("should update self", async () => {
      const user = await config.createUser()

      delete user.password
      const res = await updateSelf(user)

      expect(res.body._id).toBe(user._id)
      expect(events.user.updated).toBeCalledTimes(1)
      expect(events.user.updated).toBeCalledWith(user)
      expect(events.user.passwordUpdated).not.toBeCalled()
    })

    it("should update password", async () => {
      const user = await config.createUser()
      const password = "newPassword" 
      user.password = password

      const res = await updateSelf(user)

      delete user.password
      expect(res.body._id).toBe(user._id)
      expect(events.user.updated).toBeCalledTimes(1)
      expect(events.user.updated).toBeCalledWith(user)
      expect(events.user.passwordUpdated).toBeCalledTimes(1)
      expect(events.user.passwordUpdated).toBeCalledWith(user)
    })
  })
})