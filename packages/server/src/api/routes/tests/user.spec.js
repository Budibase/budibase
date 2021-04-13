const { BUILTIN_ROLE_IDS } = require("../../../utilities/security/roles")
const { checkPermissionsEndpoint } = require("./utilities/TestFunctions")
const setup = require("./utilities")
const { basicUser } = setup.structures
const workerRequests = require("../../../utilities/workerRequests")

jest.mock("../../../utilities/workerRequests", () => ({
  getGlobalUsers: jest.fn(),
  saveGlobalUser: jest.fn(() => {
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
    beforeEach(() => {
      workerRequests.getGlobalUsers.mockImplementationOnce(() => ([
          {
            email: "brenda@brenda.com"
          },
          {
            email: "pam@pam.com"
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
      expect(res.body.find(u => u.email === "brenda@brenda.com")).toBeDefined()
      expect(res.body.find(u => u.email === "pam@pam.com")).toBeDefined()
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

  describe("create", () => {
    beforeEach(() => {
      workerRequests.getGlobalUsers.mockImplementationOnce(() => ([
          {
            email: "bill@budibase.com"
          },
          {
            email: "brandNewUser@user.com"
          }
        ]
      ))
    })

    async function create(user, status = 200) {
      return request
        .post(`/api/users/metadata`)
        .set(config.defaultHeaders())
        .send(user)
        .expect(status)
        .expect("Content-Type", /json/)
    }

    it("returns a success message when a user is successfully created", async () => {
      const body = basicUser(BUILTIN_ROLE_IDS.POWER)
      body.email = "bill@budibase.com"
      const res = await create(body)

      expect(res.res.statusMessage).toEqual("OK")
      expect(res.body._id).toBeDefined()
    })

    it("should apply authorization to endpoint", async () => {
      const body = basicUser(BUILTIN_ROLE_IDS.POWER)
      body.email = "brandNewUser@user.com"
      await checkPermissionsEndpoint({
        config,
        method: "POST",
        body,
        url: `/api/users/metadata`,
        passRole: BUILTIN_ROLE_IDS.ADMIN,
        failRole: BUILTIN_ROLE_IDS.PUBLIC,
      })
    })

    it("should error if no email provided", async () => {
      const user = basicUser(BUILTIN_ROLE_IDS.POWER)
      delete user.email
      await create(user, 400)
    })

    it("should error if no role provided", async () => {
      const user = basicUser(null)
      await create(user, 400)
    })

    it("should throw error if user exists already", async () => {
      await config.createUser("test@test.com")
      const user = basicUser(BUILTIN_ROLE_IDS.POWER)
      user.email = "test@test.com"
      await create(user, 409)
    })
  })

  describe("update", () => {
    beforeEach(() => {
      workerRequests.saveGlobalUser.mockImplementationOnce(() => ({
        _id: "us_test@test.com"
      }))
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
      const email = "test@test.com"
      await config.createUser(email)
      const res = await request
        .delete(`/api/users/metadata/${email}`)
        .set(config.defaultHeaders())
        .expect(200)
        .expect("Content-Type", /json/)
      expect(res.body.message).toBeDefined()
      expect(workerRequests.deleteGlobalUser).toHaveBeenCalled()
    })
  })

  describe("find", () => {
    beforeEach(() => {
      jest.resetAllMocks()
      workerRequests.getGlobalUsers.mockImplementationOnce(() => ({
        email: "test@test.com",
        roleId: BUILTIN_ROLE_IDS.POWER,
      }))
    })

    it("should be able to find the user", async () => {
      const email = "test@test.com"
      await config.createUser(email)
      const res = await request
        .get(`/api/users/metadata/${email}`)
        .set(config.defaultHeaders())
        .expect(200)
        .expect("Content-Type", /json/)
      expect(res.body.email).toEqual(email)
      expect(res.body.roleId).toEqual(BUILTIN_ROLE_IDS.POWER)
      expect(res.body.tableId).toBeDefined()
    })
  })
})
