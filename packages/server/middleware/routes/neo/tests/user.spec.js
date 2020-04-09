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
  });

  afterAll(async () => {
    app.close();
  })

  describe("create", () => {
    it("returns a success message when the instance database is successfully created", done => {
      request
        .post(`/api/users`)
        .send({ name: TEST_INSTANCE_ID })
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
