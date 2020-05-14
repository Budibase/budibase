const { 
  createInstance, 
  createClientDatabase,
  createApplication,
  supertest,
  defaultHeaders
} = require("./couchTestUtils");

describe("/instances", () => {
  let TEST_APP_ID;
  let server
  let request
  beforeAll(async () => {
    ({ request, server } = await supertest())
    await createClientDatabase(request);
    TEST_APP_ID = (await createApplication(request))._id
  });

  afterAll(async () => {
    server.close();
  })

  describe("create", () => {

    it("returns a success message when the instance database is successfully created", async () => {
      const res = await request
        .post(`/api/${TEST_APP_ID}/instances`)
        .send({ name: "test-instance" })
        .set(defaultHeaders)
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.res.statusMessage).toEqual("Instance Database test-instance successfully provisioned.");
      expect(res.body._id).toBeDefined();
      
    })
  });

  describe("destroy", () => {

    it("returns a success message when the instance database is successfully deleted", async () => {
      const instance = await createInstance(request, TEST_APP_ID);
      const res = await request
        .delete(`/api/instances/${instance._id}`)
        .set(defaultHeaders)
        .expect(200)

      expect(res.res.statusMessage).toEqual(`Instance Database ${instance._id} successfully destroyed.`);
    })
  });
});
