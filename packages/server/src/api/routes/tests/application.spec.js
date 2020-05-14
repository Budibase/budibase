const { 
  createClientDatabase,  
  supertest
} = require("./couchTestUtils")

describe("/applications", () => {
  let request
  let server

  beforeAll(async () => {
    ({ request, server } = await supertest())
    await createClientDatabase(request)
  });

  afterAll(async () => {
    server.close()
  })

  describe("create", () => {
    it("returns a success message when the application is successfully created", done => {
      request
        .post("/api/applications")
        .send({ name: "My App" })
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            expect(res.res.statusMessage).toEqual("Application My App created successfully")
            expect(res.body._id).toBeDefined()            
            done();
        });
      })
    });
});
