const { 
  createClientDatabase,
  createApplication,
  createInstance, 
  createModel,
  supertest,
  defaultHeaders,
  getDocument
} = require("./couchTestUtils")

describe("/views", () => {
  let request
  let server
  let app
  let instance
  let model

  const createView = async (config = {
    name: "TestView",
    field: "Price",
    modelId: model._id
  }) => 
    await request
    .post(`/api/views`)
    .send(config)
    .set(defaultHeaders(app._id, instance._id))
    .expect('Content-Type', /json/)
    .expect(200)

  const createRecord = async record => request
    .post(`/api/${model._id}/records`)
    .send(record)
    .set(defaultHeaders(app._id, instance._id))
    .expect('Content-Type', /json/)
    .expect(200)

  beforeAll(async () => {
    ({ request, server } = await supertest())
    await createClientDatabase(request)
    app = await createApplication(request)
  })

  beforeEach(async () => {
    instance = await createInstance(request, app._id)
  })

  afterAll(async () => {
    server.close()
  })

  describe("create", () => {
    beforeEach(async () => {
      model = await createModel(request, app._id, instance._id);
    })

    it("returns a success message when the view is successfully created", async () => {
      const res = await createView()
      expect(res.res.statusMessage).toEqual("View TestView saved successfully.");
    })

    it("updates the model record with the new view metadata", async () => {
      const res = await createView()
      expect(res.res.statusMessage).toEqual("View TestView saved successfully.");
      const updatedModel = await getDocument(instance._id, model._id)
      expect(updatedModel.views).toEqual({
        TestView: {
          field: "Price",
          modelId: model._id,
          filters: [],
          schema: {
            name: {
              type: "text",
              constraints: {
                type: "string" 
              }
            }
          }
        }
      });
    })
  });

  describe("fetch", () => {
    beforeEach(async () => {
      model = await createModel(request, app._id, instance._id);
    });

    it("returns only custom views", async () => {
      await createView()
      const res = await request
        .get(`/api/views`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.body.length).toBe(1)
      expect(res.body.find(({ name }) => name === "TestView")).toBeDefined()
    })
  });

  describe("query", () => {
    beforeEach(async () => {
      model = await createModel(request, app._id, instance._id);
    });

    it("returns data for the created view", async () => {
      await createView()
      await createRecord({
        modelId: model._id,
        Price: 1000
      })
      await createRecord({
        modelId: model._id,
        Price: 2000
      })
      await createRecord({
        modelId: model._id,
        Price: 4000
      })
      const res = await request
        .get(`/api/views/TestView?stats=true`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.body.length).toBe(1)
      expect(res.body).toMatchSnapshot()
    })

    it("returns data for the created view using a group by", async () => {
      await createView({
        name: "TestView",
        field: "Price",
        groupBy: "Category",
        modelId: model._id
      })
      await createRecord({
        modelId: model._id,
        Price: 1000,
        Category: "One"
      })
      await createRecord({
        modelId: model._id,
        Price: 2000,
        Category: "One"
      })
      await createRecord({
        modelId: model._id,
        Price: 4000,
        Category: "Two"
      })
      const res = await request
        .get(`/api/views/TestView?stats=true&group=Category`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.body.length).toBe(2)
      expect(res.body).toMatchSnapshot()
    })
  });
});