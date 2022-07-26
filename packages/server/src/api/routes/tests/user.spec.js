const { BUILTIN_ROLE_IDS } = require("@budibase/backend-core/roles")
const { checkPermissionsEndpoint } = require("./utilities/TestFunctions")
const setup = require("./utilities")

jest.mock("../../../utilities/workerRequests", () => ({
  getGlobalUsers: jest.fn(() => {
    return {}
  }),
  getGlobalSelf: jest.fn(() => {
    return {}
  }),
  deleteGlobalUser: jest.fn(),
}))

describe("/users", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
  })

  describe("fetch", () => {

    it("should apply authorization to endpoint", async () => {
      await config.createUser()
      await checkPermissionsEndpoint({
        config,
        request,
        method: "GET",
        url: `/api/users/metadata`,
        passRole: BUILTIN_ROLE_IDS.ADMIN,
        failRole: BUILTIN_ROLE_IDS.PUBLIC,
      })
    })
  })

  describe("update", () => {
    it("should be able to update the user", async () => {
      const user = await config.createUser()
      user.roleId = BUILTIN_ROLE_IDS.BASIC
      const res = await request
        .put(`/api/users/metadata`)
        .set(config.defaultHeaders())
        .send(user)
        .expect(200)
        .expect("Content-Type", /json/)
      expect(res.body.ok).toEqual(true)
    })
  })

  describe("destroy", () => {
    it("should be able to delete the user", async () => {
      const user = await config.createUser()
      const res = await request
        .delete(`/api/users/metadata/${user._id}`)
        .set(config.defaultHeaders())
        .expect(200)
        .expect("Content-Type", /json/)
      expect(res.body.message).toBeDefined()
    })
  })

  describe("find", () => {
    it("should be able to find the user", async () => {
      const user = await config.createUser()
      const res = await request
        .get(`/api/users/metadata/${user._id}`)
        .set(config.defaultHeaders())
        .expect(200)
        .expect("Content-Type", /json/)
      expect(res.body._id).toEqual(user._id)
      expect(res.body.roleId).toEqual(BUILTIN_ROLE_IDS.ADMIN)
      expect(res.body.tableId).toBeDefined()
    })
  })
})
