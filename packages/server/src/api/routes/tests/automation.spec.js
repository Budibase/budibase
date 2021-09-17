const {
  checkBuilderEndpoint,
  getAllTableRows,
  clearAllAutomations,
  testAutomation,
} = require("./utilities/TestFunctions")
const setup = require("./utilities")
const { basicAutomation } = setup.structures

const MAX_RETRIES = 4

let ACTION_DEFINITIONS = {}
let TRIGGER_DEFINITIONS = {}

describe("/automations", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let automation

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
      ACTION_DEFINITIONS = res.body
    })

    it("returns a list of definitions for triggerInfo", async () => {
      const res = await request
        .get(`/api/automations/trigger/list`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)

      expect(Object.keys(res.body).length).not.toEqual(0)
      TRIGGER_DEFINITIONS = res.body
    })

    it("returns all of the definitions in one", async () => {
      const res = await request
        .get(`/api/automations/definitions/list`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)

      expect(Object.keys(res.body.action).length).toBeGreaterThanOrEqual(Object.keys(ACTION_DEFINITIONS).length)
      expect(Object.keys(res.body.trigger).length).toEqual(Object.keys(TRIGGER_DEFINITIONS).length)
    })
  })

  describe("create", () => {
    const autoConfig = basicAutomation()
    it("should setup the automation fully", () => {
      let trigger = TRIGGER_DEFINITIONS["ROW_SAVED"]
      trigger.id = "wadiawdo34"
      let createAction = ACTION_DEFINITIONS["CREATE_ROW"]
      createAction.inputs.row = {
        name: "{{trigger.row.name}}",
        description: "{{trigger.row.description}}"
      }
      createAction.id = "awde444wk"

      autoConfig.definition.steps.push(createAction)
      autoConfig.definition.trigger = trigger
    })

    it("returns a success message when the automation is successfully created", async () => {
      const res = await request
        .post(`/api/automations`)
        .set(config.defaultHeaders())
        .send(autoConfig)
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.message).toEqual("Automation created successfully")
      expect(res.body.automation.name).toEqual("My Automation")
      expect(res.body.automation._id).not.toEqual(null)
      automation = res.body.automation
    })

    it("should be able to create an automation with a webhook trigger", async () => {
      const autoConfig = basicAutomation()
      autoConfig.definition.trigger = TRIGGER_DEFINITIONS["WEBHOOK"]
      autoConfig.definition.trigger.id = "webhook_trigger_id"
      const res = await request
        .post(`/api/automations`)
        .set(config.defaultHeaders())
        .send(autoConfig)
        .expect('Content-Type', /json/)
        .expect(200)
      const originalAuto = res.body.automation
      expect(originalAuto._id).toBeDefined()
      expect(originalAuto._rev).toBeDefined()
      // try removing the webhook trigger
      const newConfig = originalAuto
      newConfig.definition.trigger = TRIGGER_DEFINITIONS["ROW_SAVED"]
      newConfig.definition.trigger.id = "row_saved_id"
      const newRes = await request
        .post(`/api/automations`)
        .set(config.defaultHeaders())
        .send(newConfig)
        .expect('Content-Type', /json/)
        .expect(200)
      const newAuto = newRes.body.automation
      expect(newAuto._id).toEqual(originalAuto._id)
      expect(newAuto._rev).toBeDefined()
      expect(newAuto._rev).not.toEqual(originalAuto._rev)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "POST",
        url: `/api/automations`,
        body: autoConfig
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
      automation.definition.trigger.inputs.tableId = table._id
      automation.definition.steps[0].inputs.row.tableId = table._id
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
      automation = await config.createAutomation(automation)
      automation.name = "Updated Name"
      automation.type = "automation"

      const res = await request
        .put(`/api/automations`)
        .set(config.defaultHeaders())
        .send(automation)
        .expect('Content-Type', /json/)
        .expect(200)

        expect(res.body.message).toEqual(`Automation ${automation._id} updated successfully.`)
        expect(res.body.automation.name).toEqual("Updated Name")
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
