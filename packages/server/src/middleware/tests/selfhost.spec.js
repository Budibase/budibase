const { BUILTIN_ROLE_IDS } = require("../../../utilities/security/roles")
const { checkPermissionsEndpoint } = require("./utilities/TestFunctions")
const { basicUser } = require("./utilities/structures")
const setup = require("./utilities")

describe("Self host middleware", () => {
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
})
