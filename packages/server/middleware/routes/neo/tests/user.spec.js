const couchdb = require("../../../../db");
const supertest = require("supertest");
const app = require("../../../../app");
const { createInstanceDatabase } = require("./couchTestUtils");


const TEST_INSTANCE_ID = "testing-123";

describe("/users", () => {
  let request;

  beforeAll(async () => {
    const server = await app({
      config: {
        port: 3000
      }
    });
    request = supertest(server);
    createInstanceDatabase(TEST_INSTANCE_ID);
  });

  afterAll(async () => {
    app.close();
  })

  describe("create", () => {
    it("returns a success message when a user is successfully created", done => {
      request
        .post(`/api/${TEST_INSTANCE_ID}/users`)
        .send({ name: "John" })
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
            expect(res.body.message).toEqual("Instance Database testing-123 successfully provisioned.");            
            done();
        });
      })
    });
});
