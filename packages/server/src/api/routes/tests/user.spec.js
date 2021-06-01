const { BUILTIN_ROLE_IDS } = require("@budibase/auth/roles")
const { checkPermissionsEndpoint } = require("./utilities/TestFunctions")
const setup = require("./utilities")
const workerRequests = require("../../../utilities/workerRequests")

jest.mock("../../../utilities/workerRequests", () => ({
  getGlobalUsers: jest.fn(() => {
    return {}
  }),
  getGlobalSelf: jest.fn(() => {
    return {}
  }),
  addAppRoleToUser: jest.fn(),
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
    beforeEach(() => {
      workerRequests.getGlobalUsers.mockImplementationOnce(() => ([
          {
            _id: "us_uuid1",
          },
          {
            _id: "us_uuid2",
          }
        ]
      ))
    })

    it("returns a list of users from an instance db", async () => {
      await config.createUser("brenda@brenda.com", "brendas_password")
      await config.createUser("pam@pam.com", "pam_password")
      const res = await request
        .get(`/api/users/metadata`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.length).toBe(2)
      expect(res.body.find(u => u._id === `ro_ta_users_us_uuid1`)).toBeDefined()
      expect(res.body.find(u => u._id === `ro_ta_users_us_uuid2`)).toBeDefined()
    })

    it("should apply authorization to endpoint", async () => {
      await config.createUser("brenda@brenda.com", "brendas_password")
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
    beforeEach(() => {
    })

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
    beforeEach(() => {
      jest.resetAllMocks()
      workerRequests.getGlobalUsers.mockImplementationOnce(() => ({
        _id: "us_uuid1",
        roleId: BUILTIN_ROLE_IDS.POWER,
      }))
    })

    it("should be able to find the user", async () => {
      const user = await config.createUser()
      const res = await request
        .get(`/api/users/metadata/${user._id}`)
        .set(config.defaultHeaders())
        .expect(200)
        .expect("Content-Type", /json/)
      expect(res.body._id).toEqual(user._id)
      expect(res.body.roleId).toEqual(BUILTIN_ROLE_IDS.POWER)
      expect(res.body.tableId).toBeDefined()
    })
  })
})
