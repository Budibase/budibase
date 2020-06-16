const { 
  createClientDatabase,  
  createApplication,
  createInstance,
  destroyClientDatabase,
  builderEndpointShouldBlockNormalUsers,
  supertest,
  TEST_CLIENT_ID,
  defaultHeaders,
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

    it("should apply authorization to endpoint", async () => {
      const otherApplication = await createApplication(request) 
      const instance = await createInstance(request, otherApplication._id)
      await builderEndpointShouldBlockNormalUsers({
        request,
        method: "POST",
        url: `/api/applications`,
        instanceId: instance._id,
        body: { name: "My App" }
      })
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

    it("lists only applications in requested client databse", async () => {
      await createApplication(request, "app1")
      await createClientDatabase("new_client")

      const blah = await request
        .post("/api/applications")
        .send({ name: "app2", clientId: "new_client"})
        .set(defaultHeaders)
        .expect('Content-Type', /json/)
        //.expect(200)

      const client1Res = await request
        .get(`/api/applications?clientId=${TEST_CLIENT_ID}`)
        .set(defaultHeaders)
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(client1Res.body.length).toBe(1)
      expect(client1Res.body[0].name).toBe("app1")

      const client2Res = await request
        .get(`/api/applications?clientId=new_client`)
        .set(defaultHeaders)
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(client2Res.body.length).toBe(1)
      expect(client2Res.body[0].name).toBe("app2")

    })

    it("should apply authorization to endpoint", async () => {
      const otherApplication = await createApplication(request) 
      const instance = await createInstance(request, otherApplication._id)
      await builderEndpointShouldBlockNormalUsers({
        request,
        method: "GET",
        url: `/api/applications`,
        instanceId: instance._id,
      })
    })
  })

})
