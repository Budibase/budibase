const { 
  createInstance, 
  createModel, 
  supertest, 
  createClientDatabase, 
  createApplication,
  defaultHeaders,
  builderEndpointShouldBlockNormalUsers,
  getDocument
} = require("./couchTestUtils")

describe("/models", () => {
  let request
  let server
  let app
  let instance

  beforeAll(async () => {
    ({ request, server } = await supertest())
    await createClientDatabase(request)
    app = await createApplication(request)
  });

  afterAll(async () => {
    server.close();
  })

  describe("create", () => {

    beforeEach(async () => {
      instance = await createInstance(request, app._id);
    });

    it("returns a success message when the model is successfully created", done => {
      request
        .post(`/api/models`)
        .send({ 
          name: "TestModel",
          key: "name",
          schema: {
            name: { type: "string" }
          }
        })
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
            expect(res.res.statusMessage).toEqual("Model TestModel created successfully.");            
            expect(res.body.name).toEqual("TestModel");            
            done();
        });
      })

      it("should apply authorization to endpoint", async () => {
        await builderEndpointShouldBlockNormalUsers({
          request,
          method: "POST",
          url: `/api/models`,
          instanceId: instance._id,
          appId: app._id,
          body: { 
            name: "TestModel",
            key: "name",
            schema: {
              name: { type: "string" }
            }
          }
        })
      })
    });

  describe("fetch", () => {
    let testModel

    beforeEach(async () => {
      instance = await createInstance(request, app._id)
      testModel = await createModel(request, app._id, instance._id, testModel)
    });

    it("returns all the models for that instance in the response body", done => {
      request
        .get(`/api/models`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (_, res) => {
            const fetchedModel = res.body[0];
            expect(fetchedModel.name).toEqual(testModel.name);            
            expect(fetchedModel.type).toEqual("model");            
            done();
        });
    })

    it("should apply authorization to endpoint", async () => {
        await builderEndpointShouldBlockNormalUsers({
          request,
          method: "GET",
          url: `/api/models`,
          instanceId: instance._id,
          appId: app._id,
        })
      })
    });

  describe("destroy", () => {
    let testModel;

    beforeEach(async () => {
      instance = await createInstance(request, app._id)
      testModel = await createModel(request, app._id, instance._id, testModel)
    });

    afterEach(() => {
      delete testModel._rev
    });

    it("returns a success response when a model is deleted.", async done => {
      request
        .delete(`/api/models/${testModel._id}/${testModel._rev}`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (_, res) => {
            expect(res.res.statusMessage).toEqual(`Model ${testModel._id} deleted.`);            
            done();
        });
      })

    it("deletes linked references to the model after deletion", async done => {
      const linkedModel = await createModel(request, app._id, instance._id, {
        name: "LinkedModel",
        type: "model",
        key: "name",
        schema: {
          name: {
            type: "text",
            constraints: {
              type: "string",
            },
          },
          TestModel: {
            type: "link",
            modelId: testModel._id,
            constraints: {
              type: "array"
            }
          }
        },
      })

      request
        .delete(`/api/models/${testModel._id}/${testModel._rev}`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (_, res) => {
            expect(res.res.statusMessage).toEqual(`Model ${testModel._id} deleted.`);            
            const dependentModel = await getDocument(instance._id, linkedModel._id)
            expect(dependentModel.schema.TestModel).not.toBeDefined();
            done();
        });
      })

    it("should apply authorization to endpoint", async () => {
      await builderEndpointShouldBlockNormalUsers({
        request,
        method: "DELETE",
        url: `/api/models/${testModel._id}/${testModel._rev}`,
        instanceId: instance._id,
        appId: app._id,
      })
    })

  });
});
