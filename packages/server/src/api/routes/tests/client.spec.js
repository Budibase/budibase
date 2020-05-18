const { 
  createClientDatabase, 
  destroyClientDatabase,
  supertest,
} = require("./couchTestUtils")

const CLIENT_ID = "test-client-id"

describe("/clients", () => {
  let request;
  let server;

  beforeEach(async () => {
    ({ request, server } = await supertest())
  });

  afterEach(async () => {
    server.close();
  })

  describe("create", () => {

    it("returns a success message when the client database is successfully created", async () => {
      const res = await request
        .post("/api/client")
        .send({ clientId: "testing" })
        .set("Accept", "application/json")
        .expect(200)

      expect(res.res.statusMessage).toEqual(`Client Database ${process.env.CLIENT_ID} successfully provisioned.`);            
    })
  });

  describe("destroy", () => {
    beforeEach(async () => {
      db = await createClientDatabase(request);
    });

    it("returns a success message when the client database is successfully destroyed", async () => {
      const res = await request
        .delete(`/api/client`)
        .set("Accept", "application/json")
        .expect(200)
      expect(res.res.statusMessage).toEqual(`Client Database ${process.env.CLIENT_ID} successfully deleted.`);            

    })
  });
});
