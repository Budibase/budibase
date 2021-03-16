const { BUILTIN_ROLE_IDS } = require("../../../utilities/security/roles")
const { checkPermissionsEndpoint } = require("./utilities/TestFunctions")
const setup = require("./utilities")
const { basicUser } = setup.structures

describe("/users", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
  })

  describe("fetch", () => {
    it("returns a list of users from an instance db", async () => {
      await config.createUser("brenda@brenda.com", "brendas_password")
      await config.createUser("pam@pam.com", "pam_password")
      const res = await request
        .get(`/api/users`)
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
        url: `/api/users`,
        passRole: BUILTIN_ROLE_IDS.ADMIN,
        failRole: BUILTIN_ROLE_IDS.PUBLIC,
      })
    })
  })

  describe("create", () => {
    async function create(user, status = 200) {
      return request
        .post(`/api/users`)
        .set(config.defaultHeaders())
        .send(user)
        .expect(status)
        .expect("Content-Type", /json/)
    }

    it("returns a success message when a user is successfully created", async () => {
      const body = basicUser(BUILTIN_ROLE_IDS.POWER)
      body.email = "bill@budibase.com"
      const res = await create(body)

      expect(res.res.statusMessage).toEqual("User created successfully.")
      expect(res.body._id).toBeUndefined()
    })

    it("should apply authorization to endpoint", async () => {
      const body = basicUser(BUILTIN_ROLE_IDS.POWER)
      body.email = "brandNewUser@user.com"
      await checkPermissionsEndpoint({
        config,
        method: "POST",
        body,
        url: `/api/users`,
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
      await create(user, 400)
    })
  })

  describe("update", () => {
    it("should be able to update the user", async () => {
      const user = await config.createUser()
      user.roleId = BUILTIN_ROLE_IDS.BASIC
      const res = await request
        .put(`/api/users`)
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
        .delete(`/api/users/${email}`)
        .set(config.defaultHeaders())
        .expect(200)
        .expect("Content-Type", /json/)
      expect(res.body.message).toBeDefined()
    })
  })

  describe("find", () => {
    it("should be able to find the user", async () => {
      const email = "test@test.com"
      await config.createUser(email)
      const res = await request
        .get(`/api/users/${email}`)
        .set(config.defaultHeaders())
        .expect(200)
        .expect("Content-Type", /json/)
      expect(res.body.email).toEqual(email)
      expect(res.body.roleId).toEqual(BUILTIN_ROLE_IDS.POWER)
      expect(res.body.tableId).toBeDefined()
    })
  })
})
