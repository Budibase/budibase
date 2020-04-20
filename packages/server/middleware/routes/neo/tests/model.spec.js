const supertest = require("supertest");
const app = require("../../../../app");
const { createInstanceDatabase, createModel, destroyDatabase } = require("./couchTestUtils");


const TEST_INSTANCE_ID = "testing-123";

describe("/models", () => {
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
      await createInstanceDatabase(TEST_INSTANCE_ID);
    });

    afterEach(async () => {
      await destroyDatabase(TEST_INSTANCE_ID);
    });

    it("returns a success message when the model is successfully created", done => {
      request
        .post(`/api/${TEST_INSTANCE_ID}/models`)
        .send({ 
          name: "TestModel",
          key: "name",
          schema: {
            name: { type: "string" }
          }
        })
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
            expect(res.body.message).toEqual("Model TestModel created successfully.");            
            expect(res.body.model.name).toEqual("TestModel");            
            done();
        });
      })
    });

  describe("fetch", () => {
    let testModel;

    beforeEach(async () => {
      await createInstanceDatabase(TEST_INSTANCE_ID);
      testModel = await createModel(TEST_INSTANCE_ID);
    });

    afterEach(async () => {
      await destroyDatabase(TEST_INSTANCE_ID);
    });

    it("returns all the models for that instance in the response body", done => {
      request
        .get(`/api/${TEST_INSTANCE_ID}/models`)
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (_, res) => {
            const fetchedModel = res.body[0];
            expect(fetchedModel.name).toEqual(testModel.name);            
            expect(fetchedModel.type).toEqual("model");            
            done();
        });
      })
    });

  describe("destroy", () => {
    let testModel;

    beforeEach(async () => {
      await createInstanceDatabase(TEST_INSTANCE_ID);
      testModel = await createModel(TEST_INSTANCE_ID);
    });

    afterEach(async () => {
      await destroyDatabase(TEST_INSTANCE_ID);
    });

    it("returns a success response when a model is deleted.", done => {
      request
        .delete(`/api/${TEST_INSTANCE_ID}/models/${testModel.id}/${testModel.rev}`)
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (_, res) => {
            expect(res.body.message).toEqual(`Model ${testModel.id} deleted.`);            
            done();
        });
      })
    });
});
