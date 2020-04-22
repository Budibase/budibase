const supertest = require("supertest");
const app = require("../../../../app");
const { createInstanceDatabase, createModel, destroyDatabase } = require("./couchTestUtils");
const { getNewRecord } = require("../../../../../common/lib/records/getNewRecord")
const { testSchema } = require("../../../../../common/lib/testUtils/testSchema")

const TEST_INSTANCE_ID = "testing-123";

describe("/records", () => {
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

  describe("save, load, update, delete", () => {
    const schema = testSchema()

    beforeAll(async () => {
      await createInstanceDatabase(TEST_INSTANCE_ID);
      await createModel(TEST_INSTANCE_ID, schema.findModel("Contact"))
    });

    afterAll(async () => {
      await destroyDatabase(TEST_INSTANCE_ID);
    });

    let record = getNewRecord(schema, "Contact")
    record.name = "Test Contact"
    record.Status = "new"

    it("returns a success message when the record is created", done => {
      request
        .post(`/api/${TEST_INSTANCE_ID}/records`)
        .send(record)
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
            expect(res.res.statusMessage.toLowerCase()).toEqual("contact created successfully")           
            expect(res.body.name).toEqual("Test Contact")
            expect(res.body._rev).toBeDefined()   
            record = res.body         
            done();
        });
    })

    it("updates a record successfully", async () => {
      record.name = "Updated Name"
      const res = await request
        .post(`/api/${TEST_INSTANCE_ID}/records`)
        .send(record)
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.res.statusMessage.toLowerCase()).toEqual("contact updated successfully")
      expect(res.body.name).toEqual("Updated Name")
      record = res.body
    })

    it("should load a record", async () => {
      const res = await request
        .get(`/api/${TEST_INSTANCE_ID}/records/${record._id}`)
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.body).toEqual(record)
    })

    it("should list all records for given modelId", async () => {
      const secondRecord = getNewRecord(schema, "Contact")
      secondRecord.name = "Second Contact"
      secondRecord.Status = "new"

      await request
        .post(`/api/${TEST_INSTANCE_ID}/records`)
        .send(secondRecord)
        .set("Accept", "application/json")

      const res = await request
        .get(`/api/${TEST_INSTANCE_ID}/${record.modelId}/records`)
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.length).toBe(2)
      console.log(JSON.stringify(res.body, undefined, 2))
      expect(res.body.find(c => c.name === record.name)).toBeDefined()
      expect(res.body.find(c => c.name === secondRecord.name)).toBeDefined()
    })

    it("should return 404 when load, after a delete", async () => {
      await request
        .delete(`/api/${TEST_INSTANCE_ID}/records/${record._id}/${record._rev}`)
        .expect(200)

      await request
        .get(`/api/${TEST_INSTANCE_ID}/records/${record._id}`)
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(404)
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
