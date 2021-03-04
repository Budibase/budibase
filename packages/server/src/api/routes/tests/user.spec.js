const { BUILTIN_ROLE_IDS } = require("../../../utilities/security/roles")
const TestConfig = require("./utilities/TestConfiguration")
const { checkPermissionsEndpoint } = require("./utilities/TestFunctions")
const { cloneDeep } = require("lodash/fp")

const baseBody = {
  email: "bill@bill.com",
  password: "yeeooo",
  roleId: BUILTIN_ROLE_IDS.POWER,
}

describe("/users", () => {
  let request
  let config

  beforeAll(async () => {
    config = new TestConfig()
    request = config.request
  })

  beforeEach(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
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
    it("returns a success message when a user is successfully created", async () => {
      const body = cloneDeep(baseBody)
      body.email = "bill@budibase.com"
      const res = await request
        .post(`/api/users`)
        .set(config.defaultHeaders())
        .send(body)
        .expect(200)
        .expect("Content-Type", /json/)

      expect(res.res.statusMessage).toEqual("User created successfully.")
      expect(res.body._id).toBeUndefined()
    })

    it("should apply authorization to endpoint", async () => {
      const body = cloneDeep(baseBody)
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
  })
})
