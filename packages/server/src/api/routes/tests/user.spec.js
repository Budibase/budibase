const {
  createApplication,
  supertest,
  defaultHeaders,
  createUser,
  testPermissionsForEndpoint,
} = require("./couchTestUtils")
const { 
  POWERUSER_LEVEL_ID, 
  LIST_USERS, 
  USER_MANAGEMENT 
} = require("../../../utilities/accessLevels")

describe("/users", () => {
  let request
  let server
  let app
  let instanceId

  beforeAll(async () => {
    ({ request, server } = await supertest(server))
  });

  beforeEach(async () => {
    app = await createApplication(request)
    instanceId = app.instances[0]._id
  });

  describe("fetch", () => {
    it("returns a list of users from an instance db", async () => {
      await createUser(request, instanceId, "brenda", "brendas_password")
      await createUser(request, instanceId, "pam", "pam_password")
      const res = await request
        .get(`/api/users`)
        .set(defaultHeaders(instanceId))
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.body.length).toBe(2)
      expect(res.body.find(u => u.username === "brenda")).toBeDefined()
      expect(res.body.find(u => u.username === "pam")).toBeDefined()
    })

    it("should apply authorization to endpoint", async () => {
      await createUser(request, instanceId, "brenda", "brendas_password")
      await testPermissionsForEndpoint({
        request,
        method: "GET",
        url: `/api/users`,
        instanceId: instanceId,
        permissionName: LIST_USERS,
      })
    })

  })

  describe("create", () => {

    it("returns a success message when a user is successfully created", async () => {
      const res = await request
        .post(`/api/users`)
        .set(defaultHeaders(instanceId))
        .send({ name: "Bill", username: "bill", password: "bills_password", accessLevelId: POWERUSER_LEVEL_ID })
        .expect(200)
        .expect('Content-Type', /json/)

      expect(res.res.statusMessage).toEqual("User created successfully."); 
      expect(res.body._id).toBeUndefined()
    })

    it("should apply authorization to endpoint", async () => {
      await testPermissionsForEndpoint({
        request,
        method: "POST",
        body: { name: "brandNewUser", username: "brandNewUser", password: "yeeooo", accessLevelId: POWERUSER_LEVEL_ID },
        url: `/api/users`,
        instanceId: instanceId,
        permissionName: USER_MANAGEMENT,
      })
    })

  });
})
