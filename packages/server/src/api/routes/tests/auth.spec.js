const setup = require("./utilities")

require("../../../utilities/workerRequests")
jest.mock("../../../utilities/workerRequests", () => ({
  getGlobalUsers: jest.fn(() => {
    return {
      email: "test@test.com",
    }
  }),
  saveGlobalUser: jest.fn(),
}))

describe("/authenticate", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
  })

  describe("fetch self", () => {
    it("should be able to fetch self", async () => {
      await config.createUser("test@test.com", "p4ssw0rd")
      const headers = await config.login("test@test.com", "p4ssw0rd")
      const res = await request
        .get(`/api/self`)
        .set(headers)
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.email).toEqual("test@test.com")
    })
  })
})