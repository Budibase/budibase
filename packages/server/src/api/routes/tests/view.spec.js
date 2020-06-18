const { 
  createClientDatabase,
  createApplication,
  createInstance, 
  createModel,
  supertest,
  defaultHeaders
} = require("./couchTestUtils")

describe("/views", () => {
  let request
  let server
  let app
  let instance
  let model

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

  const createView = async () => 
    await request
    .post(`/api/${instance._id}/views`)
    .send({ 
      name: "TestView",
      map: `function(doc) {
        if (doc.id) {
          emit(doc.name, doc._id);
        }
      }`,
      reduce: `function(keys, values) { }`
    })
    .set(defaultHeaders(app._id, instance._id))
    .expect('Content-Type', /json/)
    .expect(200)

  describe("create", () => {

    it("returns a success message when the view is successfully created", async () => {
      const res = await createView()
      expect(res.res.statusMessage).toEqual("View TestView created successfully.");
      expect(res.body.name).toEqual("TestView");
    })
  });

  describe("fetch", () => {

    beforeEach(async () => {
      model = await createModel(request, app._id, instance._id);
    });

    it("should only return custom views", async () => {
      const view = await createView()
      const res = await request
        .get(`/api/${instance._id}/views`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.body.length).toBe(1)
      expect(res.body.find(v => v.name === view.body.name)).toBeDefined()
    })
  });
});