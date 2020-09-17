const { 
  createClientDatabase,
  createApplication,
  createInstance,
  defaultHeaders,
  supertest,
  insertDocument,
  destroyDocument,
  builderEndpointShouldBlockNormalUsers
} = require("./couchTestUtils")

const TEST_WORKFLOW = {
  _id: "Test Workflow",
  name: "My Workflow",
  pageId: "123123123",
  screenId: "kasdkfldsafkl",
  live: true,
  uiTree: {

  },
  definition: {
    triggers: [

    ],
    next: {
      stepId: "abc123",
      type: "SERVER",
      conditions: {
      }
    }
  }
}

describe("/workflows", () => {
  let request
  let server
  let app
  let instance
  let workflow

  beforeAll(async () => {
    ({ request, server } = await supertest())
    await createClientDatabase(request)
    app = await createApplication(request)
  })

  beforeEach(async () => {
    instance = await createInstance(request, app._id)
    if (workflow) await destroyDocument(workflow.id);
  })

  afterAll(async () => {
    server.close()
  })

  const createWorkflow = async () => {
    workflow = await insertDocument(instance._id, {
      type: "workflow",
      ...TEST_WORKFLOW
    });
  }

  describe("create", () => {
    it("returns a success message when the workflow is successfully created", async () => {
      const res = await request
        .post(`/api/workflows`)
        .set(defaultHeaders(app._id, instance._id))
        .send(TEST_WORKFLOW)
        .expect('Content-Type', /json/)
        .expect(200)

        expect(res.body.message).toEqual("Workflow created successfully");
        expect(res.body.workflow.name).toEqual("My Workflow");
    })

    it("should apply authorization to endpoint", async () => {
      await builderEndpointShouldBlockNormalUsers({
        request,
        method: "POST",
        url: `/api/workflows`,
        instanceId: instance._id,
        appId: app._id,
        body: TEST_WORKFLOW
      })
    })
  })

  describe("update", () => {
    it("updates a workflows data", async () => {
      await createWorkflow();
      workflow._id = workflow.id
      workflow._rev = workflow.rev
      workflow.name = "Updated Name";

      const res = await request
        .put(`/api/workflows`)
        .set(defaultHeaders(app._id, instance._id))
        .send(workflow)
        .expect('Content-Type', /json/)
        .expect(200)

        expect(res.body.message).toEqual("Workflow Test Workflow updated successfully.");
        expect(res.body.workflow.name).toEqual("Updated Name");
    })
  })

  describe("fetch", () => {
    it("return all the workflows for an instance", async () => {
      await createWorkflow();
      const res = await request
        .get(`/api/workflows`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)

        expect(res.body[0]).toEqual(expect.objectContaining(TEST_WORKFLOW));
    })

    it("should apply authorization to endpoint", async () => {
      await builderEndpointShouldBlockNormalUsers({
        request,
        method: "GET",
        url: `/api/workflows`,
        instanceId: instance._id,
        appId: app._id,
      })
    })
  })

  describe("destroy", () => {
    it("deletes a workflow by its ID", async () => {
      await createWorkflow();
      const res = await request
        .delete(`/api/workflows/${workflow.id}/${workflow.rev}`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)

        expect(res.body.id).toEqual(TEST_WORKFLOW._id);
    })

    it("should apply authorization to endpoint", async () => {
      await createWorkflow();
      await builderEndpointShouldBlockNormalUsers({
        request,
        method: "DELETE",
        url: `/api/workflows/${workflow.id}/${workflow._rev}`,
        instanceId: instance._id,
        appId: app._id,
      })
    })
  })
});
