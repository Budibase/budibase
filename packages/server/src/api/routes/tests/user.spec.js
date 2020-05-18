const { 
  createClientDatabase,
  createApplication,
  createInstance,
  supertest,
  defaultHeaders,
  createUser,
} = require("./couchTestUtils")

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
      await createUser(request, instance._id, "brenda", "brendas_password")
      await createUser(request, instance._id, "pam", "pam_password")
      const res = await request
        .get(`/api/${instance._id}/users`)
        .set(defaultHeaders)
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.body.length).toBe(2)
      expect(res.body.find(u => u.username === "brenda")).toBeDefined()
      expect(res.body.find(u => u.username === "pam")).toBeDefined()
    })

  })

  describe("create", () => {

    it("returns a success message when a user is successfully created", async () => {
      const res = await request
        .post(`/api/${instance._id}/users`)
        .set(defaultHeaders)
        .send({ name: "Bill", username: "bill", password: "bills_password" })
        .expect(200)
        .expect('Content-Type', /json/)

      expect(res.res.statusMessage).toEqual("User created successfully."); 
      expect(res.body._id).toBeUndefined()
    })
  });
})
