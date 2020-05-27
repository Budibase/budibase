const { 
  createClientDatabase,
  createApplication,
  createInstance, 
  createModel,
  createRecord,
  supertest,
  defaultHeaders,
  testPermissionsForEndpoint,
  builderEndpointShouldBlockNormalUsers,
} = require("./couchTestUtils")
const { READ_VIEW } = require("../../../utilities/accessLevels")

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
        if (doc.type === 'record') {
          emit(doc.name, doc._id);
        }
      }`,
    })
    .set(defaultHeaders)
    .expect('Content-Type', /json/)
    .expect(200)

  describe("create", () => {

    it("returns a success message when the view is successfully created", async () => {
      const res = await createView()
      expect(res.res.statusMessage).toEqual("View TestView created successfully.");
      expect(res.body.name).toEqual("TestView");
    })

    it("should apply authorization to endpoint", async () => {
      await builderEndpointShouldBlockNormalUsers({
        request,
        method: "POST",
        url: `/api/${instance._id}/views`,
        body: { 
          name: "TestView",
          map: `function(doc) {
            if (doc.id) {
              emit(doc.name, doc._id);
            }
          }`,
          reduce: `function(keys, values) { }`
        },
        instanceId: instance._id,
      })
    })
  });

  describe("fetch", () => {

    it("should only return custom views", async () => {
      const view = await createView()
      const res = await request
        .get(`/api/${instance._id}/views`)
        .set(defaultHeaders)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.body.length).toBe(1)
      expect(res.body.find(v => v.name === view.body.name)).toBeDefined()
    })

    it("should apply authorization to endpoint", async () => {
      await builderEndpointShouldBlockNormalUsers({
        request,
        method: "GET",
        url: `/api/${instance._id}/views`,
        instanceId: instance._id,
      })
    })
  });

  describe("query", () => {

    beforeEach(async () => {
      model = await createModel(request, instance._id);
    });

    it("should return records from custom view", async () => {
      await createView()
      const rec1 = await createRecord(request, instance._id, model._id)
      await createRecord(request, instance._id, model._id)
      const res = await request
        .get(`/api/${instance._id}/views/TestView`)
        .set(defaultHeaders)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.body.length).toBe(2)
      expect(res.body.find(r => r._id === rec1._id)).toBeDefined()
    })

    it("should apply authorization to endpoint", async () => {
      await createView()
      await testPermissionsForEndpoint({
        request,
        method: "GET",
        url: `/api/${instance._id}/views/TestView`,
        instanceId: instance._id,
        permissionName: READ_VIEW,
        itemId: "TestView",
      })
    })
  })
});
