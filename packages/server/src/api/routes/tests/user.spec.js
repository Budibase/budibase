const supertest = require("supertest");
const app = require("../../../app");
const { 
  createInstanceDatabase
} = require("./couchTestUtils");


const TEST_INSTANCE_ID = "testing-123";
const TEST_USER = {
  name: "Dave"
}

describe("/users", () => {
  let request;
  let server;

  beforeAll(async () => {
    server = app
    request = supertest(server);
  });

  afterAll(async () => {
    server.close();
  })

  describe("fetch", () => {
    let db;

    beforeEach(async () => {
      db = await createInstanceDatabase(TEST_INSTANCE_ID);
    });

    afterEach(async () => {
      await db.destroy();
    });

    it("returns a list of users from an instance db", done => {
      request
        .get(`/api/${TEST_INSTANCE_ID}/users`)
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
            const user = res.body[0];
            expect(user.name).toEqual(TEST_USER.name);            
            done();
        });
      })
    });

  describe("create", () => {
    let db;

    beforeEach(async () => {
      db = await createInstanceDatabase(TEST_INSTANCE_ID);
    });

    afterEach(async () => {
      await db.destroy();
    });

    it("returns a success message when a user is successfully created", done => {
      request
        .post(`/api/${TEST_INSTANCE_ID}/users`)
        .send({ name: "Bill", username: "bill1", password: "password" })
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
