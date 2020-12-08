const {
  createApplication,
  supertest,
  defaultHeaders,
  createUser,
  testPermissionsForEndpoint,
} = require("./couchTestUtils")
const { BUILTIN_ROLE_IDS } = require("../../../utilities/security/roles")
const { cloneDeep } = require("lodash/fp")

const baseBody = {
  email: "bill@bill.com",
  password: "yeeooo",
  roleId: BUILTIN_ROLE_IDS.POWER,
}

describe("/users", () => {
  let request
  let server
  let app
  let appId

  beforeAll(async () => {
    ;({ request, server } = await supertest(server))
  })

  beforeEach(async () => {
    app = await createApplication(request)
    appId = app.instance._id
  })

  afterAll(() => {
    server.close()
    server.destroy()
  })

  describe("fetch", () => {
    it("returns a list of users from an instance db", async () => {
      await createUser(request, appId, "brenda@brenda.com", "brendas_password")
      await createUser(request, appId, "pam@pam.com", "pam_password")
      const res = await request
        .get(`/api/users`)
        .set(defaultHeaders(appId))
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.length).toBe(2)
      expect(res.body.find(u => u.email === "brenda@brenda.com")).toBeDefined()
      expect(res.body.find(u => u.email === "pam@pam.com")).toBeDefined()
    })

    it("should apply authorization to endpoint", async () => {
      await createUser(request, appId, "brenda@brenda.com", "brendas_password")
      await testPermissionsForEndpoint({
        request,
        method: "GET",
        url: `/api/users`,
        appId: appId,
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
        .set(defaultHeaders(appId))
        .send(body)
        .expect(200)
        .expect("Content-Type", /json/)

      expect(res.res.statusMessage).toEqual("User created successfully.")
      expect(res.body._id).toBeUndefined()
    })

    it("should apply authorization to endpoint", async () => {
      const body = cloneDeep(baseBody)
      body.email = "brandNewUser@user.com"
      await testPermissionsForEndpoint({
        request,
        method: "POST",
        body,
        url: `/api/users`,
        appId: appId,
        passRole: BUILTIN_ROLE_IDS.ADMIN,
        failRole: BUILTIN_ROLE_IDS.PUBLIC,
      })
    })
  })
})
