const supertest = require("supertest");
const couchdb = require("../../../../db");
const app = require("../../../../app");
const { createClientDatabase, destroyDatabase } = require("./couchTestUtils")


const CLIENT_DB_ID = "client-testing";

describe("/clients", () => {
  let request;
  let server;

  beforeAll(async () => {
    server = await app({
      config: {
        port: 3000
      }
    });
    request = supertest(server);
  });

  afterAll(async () => {
    server.close();
  })

  describe("create", () => {
    afterEach(async () => {
      await destroyDatabase(CLIENT_DB_ID);
    });

    it("returns a success message when the client database is successfully created", done => {
      request
        .post("/api/clients")
        .send({ clientId: "testing" })
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            expect(res.body.message).toEqual(`Client Database ${CLIENT_DB_ID} successfully provisioned.`);            
            done();
        });
      })
    });

  describe("destroy", () => {
    beforeEach(async () => {
      await createClientDatabase();
    });

    it("returns a success message when the client database is successfully destroyed", async done => {
      request
        .delete(`/api/clients/testing`)
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            expect(res.body.message).toEqual(`Client Database ${CLIENT_DB_ID} successfully deleted.`);            
            done();
        });
      })
    });
});
