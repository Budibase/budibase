const TestConfig = require("./utilities/TestConfiguration")
const {
  checkBuilderEndpoint,
  getAllTableRows,
  clearAllAutomations,
} = require("./utilities/TestFunctions")
const { basicAutomation } = require("./utilities/structures")

const { delay } = require("./testUtils")

const MAX_RETRIES = 4

let ACTION_DEFINITIONS = {}
let TRIGGER_DEFINITIONS = {}
let LOGIC_DEFINITIONS = {}

describe("/automations", () => {
  let request
  let config
  let automation

  beforeAll(async () => {
    config = new TestConfig()
    request = config.request
  })

  beforeEach(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  const triggerWorkflow = async automation => {
    return await request
      .post(`/api/automations/${automation._id}/trigger`)
      .send({ name: "Test", description: "TEST" })
      .set(config.defaultHeaders())
      .expect('Content-Type', /json/)
      .expect(200)
  }

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

    it("returns a list of definitions for triggers", async () => {
      const res = await request
        .get(`/api/automations/trigger/list`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)

      expect(Object.keys(res.body).length).not.toEqual(0)
      TRIGGER_DEFINITIONS = res.body
    })

    it("returns a list of definitions for actions", async () => {
      const res = await request
        .get(`/api/automations/logic/list`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)

      expect(Object.keys(res.body).length).not.toEqual(0)
      LOGIC_DEFINITIONS = res.body
    })

    it("returns all of the definitions in one", async () => {
      const res = await request
        .get(`/api/automations/definitions/list`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)

      expect(Object.keys(res.body.action).length).toEqual(Object.keys(ACTION_DEFINITIONS).length)
      expect(Object.keys(res.body.trigger).length).toEqual(Object.keys(TRIGGER_DEFINITIONS).length)
      expect(Object.keys(res.body.logic).length).toEqual(Object.keys(LOGIC_DEFINITIONS).length)
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

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "POST",
        url: `/api/automations`,
        body: autoConfig
      })
    })
  })

  describe("trigger", () => {
    it("trigger the automation successfully", async () => {
      let table = await config.createTable()
      automation.definition.trigger.inputs.tableId = table._id
      automation.definition.steps[0].inputs.row.tableId = table._id
      automation = await config.createAutomation(automation)
      await delay(500)
      const res = await triggerWorkflow(automation)
      // this looks a bit mad but we don't actually have a way to wait for a response from the automation to
      // know that it has finished all of its actions - this is currently the best way
      // also when this runs in CI it is very temper-mental so for now trying to make run stable by repeating until it works
      // TODO: update when workflow logs are a thing
      for (let tries = 0; tries < MAX_RETRIES; tries++) {
        expect(res.body.message).toEqual(`Automation ${automation._id} has been triggered.`)
        expect(res.body.automation.name).toEqual(automation.name)
        await delay(500)
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
