const supertest = require("supertest");
const app = require("../../../../app");
const { createInstanceDatabase, createModel, destroyDatabase } = require("./couchTestUtils");


const TEST_INSTANCE_ID = "testing-123";

describe("/views", () => {
  let request;
  let server;
  let db;

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
      db = await createInstanceDatabase(TEST_INSTANCE_ID);
    });

    afterEach(async () => {
      await db.destroy();
    });

    it("returns a success message when the view is successfully created", done => {
      request
        .post(`/api/${TEST_INSTANCE_ID}/views`)
        .send({ 
          name: "TestView",
          map: `function(doc) {
            if (doc.id) {
              emit(doc.name, doc._id);
            }
          }`,
          reduce: `function(keys, values) { }`
        })
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
            expect(res.body.message).toEqual("View TestView created successfully.");
            expect(res.body.id).toEqual("_design/database");
            done();
        });
      })
    });

  describe("fetch", () => {
    let db;

    beforeEach(async () => {
      db = await createInstanceDatabase(TEST_INSTANCE_ID);
      await createModel(TEST_INSTANCE_ID);
    });

    afterEach(async () => {
      await db.destroy();
    });

    it("returns a list of all the views that exist in the instance database", done => {
      request
        .get(`/api/${TEST_INSTANCE_ID}/views`)
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (_, res) => {
            expect(res.body.by_type).toBeDefined();
            done();
        });
      })
    });
});
