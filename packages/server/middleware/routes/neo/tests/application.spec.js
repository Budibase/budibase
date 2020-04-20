const supertest = require("supertest");
const app = require("../../../../app");
const { createClientDatabase, destroyDatabase } = require("./couchTestUtils");


const CLIENT_DB_ID = "client-testing";

describe("/applications", () => {
  let request;
  let server;

  beforeAll(async () => {
    server = await app({
      config: {
        port: 3000
      }
    });
    request = supertest(server);
    await createClientDatabase();
  });

  afterAll(async () => {
    await destroyDatabase(CLIENT_DB_ID)
    server.close();
  })

  describe("create", () => {
    it("returns a success message when the application is successfully created", done => {
      request
        .post("/api/testing/applications")
        .send({ name: "My App" })
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            expect(res.body.message).toEqual("Application My App created successfully");            
            done();
        });
      })
    });
});
