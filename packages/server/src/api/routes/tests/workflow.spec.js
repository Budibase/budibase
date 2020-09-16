const { 
  createClientDatabase,
  createApplication,
  createInstance,
  createModel,
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
    trigger: {},
    steps: [
    ],
  },
  type: "workflow",
}

let ACTION_DEFINITIONS = {}
let TRIGGER_DEFINITIONS = {}
let LOGIC_DEFINITIONS = {}

describe("/workflows", () => {
  let request
  let server
  let app
  let instance
  let workflow
  let model

  beforeAll(async () => {
    ({ request, server } = await supertest())
    await createClientDatabase(request)
    app = await createApplication(request)
  })

  beforeEach(async () => {
    if (workflow) await destroyDocument(workflow.id)
    instance = await createInstance(request, app._id)
    model = await createModel(request, app._id, instance._id)
  })

  afterAll(async () => {
    server.close()
  })

  const createWorkflow = async () => {
    workflow = await insertDocument(instance._id, {
      type: "workflow",
      ...TEST_WORKFLOW
    });
    workflow = { ...workflow, ...TEST_WORKFLOW }
  }

  describe("get definitions", () => {
    it("returns a list of definitions for actions", async () => {
      const res = await request
        .get(`/api/workflows/action/list`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)

      expect(Object.keys(res.body).length).not.toEqual(0)
      ACTION_DEFINITIONS = res.body
    })

    it("returns a list of definitions for triggers", async () => {
      const res = await request
        .get(`/api/workflows/trigger/list`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)

      expect(Object.keys(res.body).length).not.toEqual(0)
      TRIGGER_DEFINITIONS = res.body
    })

    it("returns a list of definitions for actions", async () => {
      const res = await request
        .get(`/api/workflows/logic/list`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)

      expect(Object.keys(res.body).length).not.toEqual(0)
      LOGIC_DEFINITIONS = res.body
    })

    it("returns all of the definitions in one", async () => {
      const res = await request
        .get(`/api/workflows/definitions/list`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)

      expect(Object.keys(res.body.action).length).toEqual(Object.keys(ACTION_DEFINITIONS).length)
      expect(Object.keys(res.body.trigger).length).toEqual(Object.keys(TRIGGER_DEFINITIONS).length)
      expect(Object.keys(res.body.logic).length).toEqual(Object.keys(LOGIC_DEFINITIONS).length)
    })
  })

  describe("create", () => {
    it("should setup the workflow fully", () => {
      let trigger = TRIGGER_DEFINITIONS["RECORD_SAVED"]
      trigger.inputs.modelId = model._id
      trigger.id = "wadiawdo34"
      let saveAction = ACTION_DEFINITIONS["SAVE_RECORD"]
      saveAction.inputs.record = {
        modelId: model._id,
        name: "Testing",
      }
      saveAction.id = "awde444wk"
      let deleteAction = ACTION_DEFINITIONS["DELETE_RECORD"]
      deleteAction.inputs.id = "{{blocks[1].id}}"
      deleteAction.inputs.revision = "{{blocks[1].revision}}"
      deleteAction.id = "78MOt8nQO"

      TEST_WORKFLOW.definition.steps.push(saveAction)
      TEST_WORKFLOW.definition.steps.push(deleteAction)
      TEST_WORKFLOW.definition.trigger = trigger
    })

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
      workflow.type = "workflow"

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
