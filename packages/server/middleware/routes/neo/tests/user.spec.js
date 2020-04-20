const supertest = require("supertest");
const app = require("../../../../app");
const { 
  createInstanceDatabase, 
  insertDocument, 
  destroyDatabase 
} = require("./couchTestUtils");


const TEST_INSTANCE_ID = "testing-123";
const TEST_USER = {
  name: "Dave"
}

describe("/users", () => {
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

  describe("fetch", () => {
    beforeEach(async () => {
      await createInstanceDatabase(TEST_INSTANCE_ID);
    });

    afterEach(async () => {
      await destroyDatabase(TEST_INSTANCE_ID);
    });

    it("returns a list of users from an instance db", done => {
      request
        .get(`/api/${TEST_INSTANCE_ID}/users`)
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
            const createdUser = res.body[0];
            expect(createdUser.name).toEqual(TEST_USER.name);            
            done();
        });
      })
    });

  describe("create", () => {
    beforeEach(async () => {
      await createInstanceDatabase(TEST_INSTANCE_ID);
    });

    afterEach(async () => {
      await destroyDatabase(TEST_INSTANCE_ID);
    });

    it("returns a success message when a user is successfully created", done => {
      request
        .post(`/api/${TEST_INSTANCE_ID}/users`)
        .send({ name: "John" })
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
            expect(res.body.message).toEqual("User created successfully.");            
            done();
        });
      })
    });
});
