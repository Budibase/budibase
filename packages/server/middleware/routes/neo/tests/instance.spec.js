const supertest = require("supertest");
const app = require("../../../../app");
const { 
  createInstanceDatabase, 
  destroyDatabase, 
  createClientDatabase,
  destroyClientDatabase
} = require("./couchTestUtils");


const TEST_INSTANCE_ID = "testing-123";
const TEST_APP_ID = "test-app";

describe("/instances", () => {
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
    beforeEach(async () => {
      await createClientDatabase();
    });

    afterEach(async () => {
      await destroyClientDatabase();
      await destroyDatabase(TEST_INSTANCE_ID);
    });

    it("returns a success message when the instance database is successfully created", done => {
      request
        .post(`/api/testing/${TEST_APP_ID}/instances`)
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
      await createClientDatabase();
      await createInstanceDatabase(TEST_INSTANCE_ID);
    });

    afterEach(async () => {
      await destroyClientDatabase();
    });

    it("returns a success message when the instance database is successfully deleted", done => {
      request
        .delete(`/api/instances/${TEST_INSTANCE_ID}`)
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
