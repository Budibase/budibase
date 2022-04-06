const {
  checkBuilderEndpoint,
  getAllTableRows,
  clearAllAutomations,
  testAutomation,
} = require("./utilities/TestFunctions")
const setup = require("./utilities")
const { basicAutomation, newAutomation, automationTrigger, automationStep } = setup.structures
const { mocks } = require("@budibase/backend-core/testUtils")
mocks.date.mock()
const MAX_RETRIES = 4
const { TRIGGER_DEFINITIONS, ACTION_DEFINITIONS } = require("../../../automations")

describe("/automations", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
  })

  describe("get definitions", () => {
    it("returns a list of definitions for actions", async () => {
      const res = await request
        .get(`/api/automations/action/list`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)

      expect(Object.keys(res.body).length).not.toEqual(0)
    })

    it("returns a list of definitions for triggerInfo", async () => {
      const res = await request
        .get(`/api/automations/trigger/list`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)

      expect(Object.keys(res.body).length).not.toEqual(0)
    })

    it("returns all of the definitions in one", async () => {
      const res = await request
        .get(`/api/automations/definitions/list`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)

      let definitionsLength = Object.keys(ACTION_DEFINITIONS).length
      definitionsLength-- // OUTGOING_WEBHOOK is deprecated

      expect(Object.keys(res.body.action).length).toBeGreaterThanOrEqual(definitionsLength)
      expect(Object.keys(res.body.trigger).length).toEqual(Object.keys(TRIGGER_DEFINITIONS).length)
    })
  })

  describe("create", () => {
    it("returns a success message when the automation is successfully created", async () => {
      const automation = newAutomation()

      const res = await request
        .post(`/api/automations`)
        .set(config.defaultHeaders())
        .send(automation)
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.message).toEqual("Automation created successfully")
      expect(res.body.automation.name).toEqual("My Automation")
      expect(res.body.automation._id).not.toEqual(null)
    })

    it("should apply authorization to endpoint", async () => {
      const automation = newAutomation()
      await checkBuilderEndpoint({
        config,
        method: "POST",
        url: `/api/automations`,
        body: automation
      })
    })
  })

  describe("find", () => {
    it("should be able to find the automation", async () => {
      const automation = await config.createAutomation()
      const res = await request
        .get(`/api/automations/${automation._id}`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.body._id).toEqual(automation._id)
      expect(res.body._rev).toEqual(automation._rev)
    })
  })

  describe("trigger", () => {
    it("trigger the automation successfully", async () => {
      let table = await config.createTable()
      let automation = newAutomation()
      automation.definition.trigger.inputs.tableId = table._id
      automation.definition.steps[0].inputs = {
        row: {
          name: "{{trigger.row.name}}",
          description: "{{trigger.row.description}}",
          tableId: table._id
        }
      }
      automation.appId = config.appId
      automation = await config.createAutomation(automation)
      await setup.delay(500)
      const res = await testAutomation(config, automation)
      // this looks a bit mad but we don't actually have a way to wait for a response from the automation to
      // know that it has finished all of its actions - this is currently the best way
      // also when this runs in CI it is very temper-mental so for now trying to make run stable by repeating until it works
      // TODO: update when workflow logs are a thing
      for (let tries = 0; tries < MAX_RETRIES; tries++) {
        expect(res.body).toBeDefined()
        await setup.delay(500)
        let elements = await getAllTableRows(config)
        // don't test it unless there are values to test
        if (elements.length > 1) {
          expect(elements.length).toEqual(5)
          expect(elements[0].name).toEqual("Test")
          expect(elements[0].description).toEqual("TEST")
          return
        }
      }
      throw "Failed to find the rows"
    })
  })

  describe("update", () => {
    it("updates a automations data", async () => {
      let automation = newAutomation()
      await config.createAutomation(automation)
      automation.name = "Updated Name"

      const res = await request
        .put(`/api/automations`)
        .set(config.defaultHeaders())
        .send(automation)
        .expect('Content-Type', /json/)
        .expect(200)

        expect(res.body.message).toEqual(`Automation ${automation._id} updated successfully.`)
        expect(res.body.automation.name).toEqual("Updated Name")
    })

    it("should be able to update an automation trigger", async () => {
      // create webhook automation
      const webhookTrigger = automationTrigger(TRIGGER_DEFINITIONS.WEBHOOK)
      let automation = newAutomation({ trigger: webhookTrigger })

      let res = await request
        .post(`/api/automations`)
        .set(config.defaultHeaders())
        .send(automation)
        .expect('Content-Type', /json/)
        .expect(200)

      automation = res.body.automation
      expect(automation._id).toBeDefined()
      expect(automation._rev).toBeDefined()

      // change the trigger
      automation.trigger = automationTrigger(TRIGGER_DEFINITIONS.ROW_SAVED)

      // check the post request honours updates with same id
      res = await request
        .post(`/api/automations`)
        .set(config.defaultHeaders())
        .send(automation)
        .expect('Content-Type', /json/)
        .expect(200)

      const automationRes = res.body.automation
      expect(automationRes._id).toEqual(automation._id)
      expect(automationRes._rev).toBeDefined()
      expect(automationRes._rev).not.toEqual(automation._rev)
    })
  })

  describe("fetch", () => {
    it("return all the automations for an instance", async () => {
      await clearAllAutomations(config)
      const autoConfig = basicAutomation()
      automation = await config.createAutomation(autoConfig)
      const res = await request
        .get(`/api/automations`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)

        expect(res.body[0]).toEqual(expect.objectContaining(autoConfig))
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "GET",
        url: `/api/automations`,
      })
    })
  })

  describe("destroy", () => {
    it("deletes a automation by its ID", async () => {
      const automation = await config.createAutomation()
      const res = await request
        .delete(`/api/automations/${automation.id}/${automation.rev}`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)

        expect(res.body.id).toEqual(automation._id)
    })

    it("should apply authorization to endpoint", async () => {
      const automation = await config.createAutomation()
      await checkBuilderEndpoint({
        config,
        method: "DELETE",
        url: `/api/automations/${automation.id}/${automation._rev}`,
      })
    })
  })
})
