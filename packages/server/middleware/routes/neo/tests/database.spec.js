const couchdb = require("../../../../db");
const supertest = require("supertest");
const app = require("../../../../app");
const { createInstanceDatabase, destroyDatabase } = require("./couchTestUtils");


const TEST_INSTANCE_ID = "testing-123";

describe("/databases", () => {
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
      await destroyDatabase(TEST_INSTANCE_ID);
    });

    it("returns a success message when the instance database is successfully created", done => {
      request
        .post(`/api/databases`)
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

  describe("destroy", () => {
    beforeEach(async () => {
      await createInstanceDatabase(TEST_INSTANCE_ID);
    });

    it("returns a success message when the instance database is successfully deleted", done => {
      request
        .delete(`/api/databases/${TEST_INSTANCE_ID}`)
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
            expect(res.body.message).toEqual("Instance Database testing-123 successfully destroyed.");            
            done();
        });
      })
    });
});
