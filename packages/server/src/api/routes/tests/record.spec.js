const supertest = require("supertest");
const app = require("../../../app");
const { createInstanceDatabase, createModel } = require("./couchTestUtils");

const TEST_INSTANCE_ID = "testing-123";

const CONTACT_MODEL = {
  "name": "Contact",
  "type": "model",
  "key": "name",
  "schema": {
    "name": { "type": "string" },
    "age": { "type": "number" }
  }
};

describe("/records", () => {
  let request;
  let server;
  let db;

  beforeAll(async () => {
    server = app;
    request = supertest(server);
  });

  afterAll(async () => {
    server.close();
  })

  describe("save, load, update, delete", () => {
    let record;
    let model;

    beforeEach(async () => {
      db = await createInstanceDatabase(TEST_INSTANCE_ID);
      model = await createModel(TEST_INSTANCE_ID, CONTACT_MODEL)
      record = {
        name: "Test Contact",
        status: "new",
        modelId: model.id
      }
    });

    afterEach(async () => {
      await db.destroy();
    });

    it("returns a success message when the record is created", done => {
      request
        .post(`/api/${TEST_INSTANCE_ID}/records`)
        .send(record)
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
            expect(res.res.statusMessage).toEqual("Contact created successfully")           
            expect(res.body.name).toEqual("Test Contact")
            expect(res.body._rev).toBeDefined()   
            done();
        });
    })

    it("updates a record successfully", async () => {
      const existing = await db.post(record);

      const res = await request
        .post(`/api/${TEST_INSTANCE_ID}/records`)
        .send({
          _id: existing.id,
          _rev: existing.rev,
          modelId: model.id,
          name: "Updated Name",
        })
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.body.message).toEqual("Contact updated successfully.")
      expect(res.body.record.name).toEqual("Updated Name")
    })

    it("should load a record", async () => {
      const existing = await db.post(record);

      const res = await request
        .get(`/api/${TEST_INSTANCE_ID}/records/${existing.id}`)
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body).toEqual({
        ...record,
        _id: existing.id,
        _rev: existing.rev
      })
    })

    it("should list all records for given modelId", async () => {
      const newRecord = {
        modelId: model.id,
        name: "Second Contact",
        status: "new"
      }

      await db.post(newRecord);

      const res = await request
        .get(`/api/${TEST_INSTANCE_ID}/all_${newRecord.modelId}/records`)
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.length).toBe(1)
      expect(res.body[0].name).toEqual(newRecord.name);
    })

    it("load should return 404 when record does not exist", async () => {
      await request
        .get(`/api/${TEST_INSTANCE_ID}/records/not-a-valid-id`)
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(404)
    })
  })
})
