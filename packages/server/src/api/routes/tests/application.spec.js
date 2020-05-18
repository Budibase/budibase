const { 
  createClientDatabase,  
  createApplication,
  destroyClientDatabase,
  supertest,
  defaultHeaders
} = require("./couchTestUtils")

describe("/applications", () => {
  let request
  let server

  beforeAll(async () => {
    ({ request, server } = await supertest())
  });

  beforeEach(async () => {
    await createClientDatabase()
  })

  afterEach(async () => {
    await destroyClientDatabase()
  })

  afterAll(async () => {
    server.close()
  })

  describe("create", () => {
    it("returns a success message when the application is successfully created", async () => {
      const res = await request
        .post("/api/applications")
        .send({ name: "My App" })
        .set(defaultHeaders)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.res.statusMessage).toEqual("Application My App created successfully")
      expect(res.body._id).toBeDefined()
    })
  })

  describe("fetch", () => {
    it("lists all applications", async () => {
      
      await createApplication(request, "app1")
      await createApplication(request, "app2")

      const res = await request
        .get("/api/applications")
        .set(defaultHeaders)
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.length).toBe(2)
    })
  })

})
