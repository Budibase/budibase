const { 
  createClientDatabase,
  createApplication,
  createInstance,
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
  let instance

  beforeAll(async () => {
    ({ request, server } = await supertest(server))
    await createClientDatabase(request)
    app = await createApplication(request)
  });

  beforeEach(async () => {
    instance = await createInstance(request, app._id)
  });

  afterAll(async () => {
    server.close();
  })

  describe("fetch", () => {    

    it("returns a list of users from an instance db", async () => {
      await createUser(request, app._id, instance._id, "brenda", "brendas_password")
      await createUser(request, app._id, instance._id, "pam", "pam_password")
      const res = await request
        .get(`/api/users`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.body.length).toBe(2)
      expect(res.body.find(u => u.username === "brenda")).toBeDefined()
      expect(res.body.find(u => u.username === "pam")).toBeDefined()
    })

    it("should apply authorization to endpoint", async () => {
      await createUser(request, app._id, instance._id, "brenda", "brendas_password")
      await testPermissionsForEndpoint({
        request,
        method: "GET",
        url: `/api/${instance._id}/users`,
        instanceId: instance._id,
        permissionName: LIST_USERS,
      })
    })

  })

  describe("create", () => {

    it("returns a success message when a user is successfully created", async () => {
      const res = await request
        .post(`/api/${instance._id}/users`)
        .set(defaultHeaders(app._id, instance._id))
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
        url: `/api/${instance._id}/users`,
        instanceId: instance._id,
        permissionName: USER_MANAGEMENT,
      })
    })

  });
})
