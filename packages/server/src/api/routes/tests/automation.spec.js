const { 
  createClientDatabase,
  createApplication,
  createInstance,
  createModel,
  getAllFromModel,
  defaultHeaders,
  supertest,
  insertDocument,
  destroyDocument,
  builderEndpointShouldBlockNormalUsers
} = require("./couchTestUtils")

const { delay } = require("./testUtils")

const MAX_RETRIES = 4
const TEST_AUTOMATION = {
  _id: "Test Automation",
  name: "My Automation",
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
  type: "automation",
}

let ACTION_DEFINITIONS = {}
let TRIGGER_DEFINITIONS = {}
let LOGIC_DEFINITIONS = {}

describe("/automations", () => {
  let request
  let server
  let app
  let instance
  let automation
  let automationId

  beforeAll(async () => {
    ({ request, server } = await supertest())
    await createClientDatabase(request)
    app = await createApplication(request)
  })

  beforeEach(async () => {
    if (automation) await destroyDocument(automation.id)
    instance = await createInstance(request, app._id)
  })

  afterAll(async () => {
    server.close()
  })

  const createAutomation = async () => {
    automation = await insertDocument(instance._id, {
      type: "automation",
      ...TEST_AUTOMATION
    })
    automation = { ...automation, ...TEST_AUTOMATION }
  }

  describe("get definitions", () => {
    it("returns a list of definitions for actions", async () => {
      const res = await request
        .get(`/api/automations/action/list`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)

      expect(Object.keys(res.body).length).not.toEqual(0)
      ACTION_DEFINITIONS = res.body
    })

    it("returns a list of definitions for triggers", async () => {
      const res = await request
        .get(`/api/automations/trigger/list`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)

      expect(Object.keys(res.body).length).not.toEqual(0)
      TRIGGER_DEFINITIONS = res.body
    })

    it("returns a list of definitions for actions", async () => {
      const res = await request
        .get(`/api/automations/logic/list`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)

      expect(Object.keys(res.body).length).not.toEqual(0)
      LOGIC_DEFINITIONS = res.body
    })

    it("returns all of the definitions in one", async () => {
      const res = await request
        .get(`/api/automations/definitions/list`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)

      expect(Object.keys(res.body.action).length).toEqual(Object.keys(ACTION_DEFINITIONS).length)
      expect(Object.keys(res.body.trigger).length).toEqual(Object.keys(TRIGGER_DEFINITIONS).length)
      expect(Object.keys(res.body.logic).length).toEqual(Object.keys(LOGIC_DEFINITIONS).length)
    })
  })

  describe("create", () => {
    it("should setup the automation fully", () => {
      let trigger = TRIGGER_DEFINITIONS["RECORD_SAVED"]
      trigger.id = "wadiawdo34"
      let saveAction = ACTION_DEFINITIONS["SAVE_RECORD"]
      saveAction.inputs.record = {
        name: "{{trigger.name}}",
        description: "{{trigger.description}}"
      }
      saveAction.id = "awde444wk"

      TEST_AUTOMATION.definition.steps.push(saveAction)
      TEST_AUTOMATION.definition.trigger = trigger
    })

    it("returns a success message when the automation is successfully created", async () => {
      const res = await request
        .post(`/api/automations`)
        .set(defaultHeaders(app._id, instance._id))
        .send(TEST_AUTOMATION)
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.message).toEqual("Automation created successfully")
      expect(res.body.automation.name).toEqual("My Automation")
      expect(res.body.automation._id).not.toEqual(null)
      automationId = res.body.automation._id
    })

    it("should apply authorization to endpoint", async () => {
      await builderEndpointShouldBlockNormalUsers({
        request,
        method: "POST",
        url: `/api/automations`,
        instanceId: instance._id,
        appId: app._id,
        body: TEST_AUTOMATION
      })
    })
  })

  describe("trigger", () => {
    it("trigger the automation successfully", async () => {
      let model = await createModel(request, app._id, instance._id)
      TEST_AUTOMATION.definition.trigger.inputs.modelId = model._id
      TEST_AUTOMATION.definition.steps[0].inputs.record.modelId = model._id
      await createAutomation()
      const res = await request
        .post(`/api/automations/${automation._id}/trigger`)
        .send({ name: "Test", description: "TEST" })
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.body.message).toEqual(`Automation ${automation._id} has been triggered.`)
      expect(res.body.automation.name).toEqual(TEST_AUTOMATION.name)
      // wait for automation to complete in background
      for (let tries = 0; tries < MAX_RETRIES; tries++) {
        await delay(500)
        let elements = await getAllFromModel(request, app._id, instance._id, model._id)
        // don't test it unless there are values to test
        if (elements.length === 1) {
          expect(elements.length).toEqual(1)
          expect(elements[0].name).toEqual("Test")
          expect(elements[0].description).toEqual("TEST")
          return
        }
      }
      throw "Failed to find the records"
    })
  })

  describe("update", () => {
    it("updates a automations data", async () => {
      await createAutomation()
      automation._id = automation.id
      automation._rev = automation.rev
      automation.name = "Updated Name"
      automation.type = "automation"

      const res = await request
        .put(`/api/automations`)
        .set(defaultHeaders(app._id, instance._id))
        .send(automation)
        .expect('Content-Type', /json/)
        .expect(200)

        expect(res.body.message).toEqual("Automation Test Automation updated successfully.")
        expect(res.body.automation.name).toEqual("Updated Name")
    })
  })

  describe("fetch", () => {
    it("return all the automations for an instance", async () => {
      await createAutomation()
      const res = await request
        .get(`/api/automations`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)

        expect(res.body[0]).toEqual(expect.objectContaining(TEST_AUTOMATION))
    })

    it("should apply authorization to endpoint", async () => {
      await builderEndpointShouldBlockNormalUsers({
        request,
        method: "GET",
        url: `/api/automations`,
        instanceId: instance._id,
        appId: app._id,
      })
    })
  })

  describe("destroy", () => {
    it("deletes a automation by its ID", async () => {
      await createAutomation()
      const res = await request
        .delete(`/api/automations/${automation.id}/${automation.rev}`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)

        expect(res.body.id).toEqual(TEST_AUTOMATION._id)
    })

    it("should apply authorization to endpoint", async () => {
      await createAutomation()
      await builderEndpointShouldBlockNormalUsers({
        request,
        method: "DELETE",
        url: `/api/automations/${automation.id}/${automation._rev}`,
        instanceId: instance._id,
        appId: app._id,
      })
    })
  })
})
