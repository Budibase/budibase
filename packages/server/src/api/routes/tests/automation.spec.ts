import {
  checkBuilderEndpoint,
  getAllTableRows,
  clearAllAutomations,
  testAutomation,
} from "./utilities/TestFunctions"
import * as setup from "./utilities"
import {
  TRIGGER_DEFINITIONS,
  BUILTIN_ACTION_DEFINITIONS,
} from "../../../automations"
import { events } from "@budibase/backend-core"
import sdk from "../../../sdk"
import { Automation } from "@budibase/types"
import { mocks } from "@budibase/backend-core/tests"

const MAX_RETRIES = 4
let {
  basicAutomation,
  newAutomation,
  automationTrigger,
  automationStep,
  collectAutomation,
} = setup.structures

jest.setTimeout(30000)

describe("/automations", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(() => {
    // @ts-ignore
    events.automation.deleted.mockClear()
  })

  describe("get definitions", () => {
    it("returns a list of definitions for actions", async () => {
      const res = await request
        .get(`/api/automations/action/list`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(Object.keys(res.body).length).not.toEqual(0)
    })

    it("returns a list of definitions for triggerInfo", async () => {
      const res = await request
        .get(`/api/automations/trigger/list`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(Object.keys(res.body).length).not.toEqual(0)
    })

    it("returns all of the definitions in one", async () => {
      const res = await request
        .get(`/api/automations/definitions/list`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      let definitionsLength = Object.keys(BUILTIN_ACTION_DEFINITIONS).length
      definitionsLength-- // OUTGOING_WEBHOOK is deprecated

      expect(Object.keys(res.body.action).length).toBeGreaterThanOrEqual(
        definitionsLength
      )
      expect(Object.keys(res.body.trigger).length).toEqual(
        Object.keys(TRIGGER_DEFINITIONS).length
      )
    })
  })

  describe("create", () => {
    it("creates an automation with no steps", async () => {
      const automation = newAutomation()
      automation.definition.steps = []

      const res = await request
        .post(`/api/automations`)
        .set(config.defaultHeaders())
        .send(automation)
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.message).toEqual("Automation created successfully")
      expect(res.body.automation.name).toEqual("My Automation")
      expect(res.body.automation._id).not.toEqual(null)
      expect(events.automation.created).toBeCalledTimes(1)
      expect(events.automation.stepCreated).not.toBeCalled()
    })

    it("creates an automation with steps", async () => {
      const automation = newAutomation()
      automation.definition.steps.push(automationStep())
      jest.clearAllMocks()

      const res = await request
        .post(`/api/automations`)
        .set(config.defaultHeaders())
        .send(automation)
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.message).toEqual("Automation created successfully")
      expect(res.body.automation.name).toEqual("My Automation")
      expect(res.body.automation._id).not.toEqual(null)
      expect(events.automation.created).toBeCalledTimes(1)
      expect(events.automation.stepCreated).toBeCalledTimes(2)
    })

    it("should apply authorization to endpoint", async () => {
      const automation = newAutomation()
      await checkBuilderEndpoint({
        config,
        method: "POST",
        url: `/api/automations`,
        body: automation,
      })
    })
  })

  describe("find", () => {
    it("should be able to find the automation", async () => {
      const automation = await config.createAutomation()
      const res = await request
        .get(`/api/automations/${automation._id}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body._id).toEqual(automation._id)
      expect(res.body._rev).toEqual(automation._rev)
    })
  })

  describe("test", () => {
    it("tests the automation successfully", async () => {
      let table = await config.createTable()
      let automation = newAutomation()
      automation.definition.trigger.inputs.tableId = table._id
      automation.definition.steps[0].inputs = {
        row: {
          name: "{{trigger.row.name}}",
          description: "{{trigger.row.description}}",
          tableId: table._id,
        },
      }
      automation.appId = config.appId
      automation = await config.createAutomation(automation)
      await setup.delay(500)
      const res = await testAutomation(config, automation)
      expect(events.automation.tested).toBeCalledTimes(1)
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
          expect(elements.length).toBeGreaterThanOrEqual(MAX_RETRIES)
          expect(elements[0].name).toEqual("Test")
          expect(elements[0].description).toEqual("TEST")
          return
        }
      }
      throw "Failed to find the rows"
    })
  })

  describe("trigger", () => {
    it("does not trigger an automation when not synchronous and in dev", async () => {
      let automation = newAutomation()
      automation = await config.createAutomation(automation)
      const res = await request
        .post(`/api/automations/${automation._id}/trigger`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(400)

      expect(res.body.message).toEqual(
        "Only apps in production support this endpoint"
      )
    })

    it("triggers a synchronous automation", async () => {
      mocks.licenses.useSyncAutomations()
      let automation = collectAutomation()
      automation = await config.createAutomation(automation)
      const res = await request
        .post(`/api/automations/${automation._id}/trigger`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.success).toEqual(true)
      expect(res.body.value).toEqual([1, 2, 3])
    })

    it("triggers an asynchronous automation", async () => {
      let automation = newAutomation()
      automation = await config.createAutomation(automation)
      await config.publish()

      const res = await request
        .post(`/api/automations/${automation._id}/trigger`)
        .set(config.defaultHeaders({}, true))
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.message).toEqual(
        `Automation ${automation._id} has been triggered.`
      )
    })
  })

  describe("update", () => {
    const update = async (automation: Automation) => {
      return request
        .put(`/api/automations`)
        .set(config.defaultHeaders())
        .send(automation)
        .expect("Content-Type", /json/)
        .expect(200)
    }

    const updateWithPost = async (automation: Automation) => {
      return request
        .post(`/api/automations`)
        .set(config.defaultHeaders())
        .send(automation)
        .expect("Content-Type", /json/)
        .expect(200)
    }

    it("updates a automations name", async () => {
      let automation = newAutomation()
      await config.createAutomation(automation)
      automation.name = "Updated Name"
      jest.clearAllMocks()

      const res = await update(automation)

      const automationRes = res.body.automation
      const message = res.body.message

      // doc attributes
      expect(automationRes._id).toEqual(automation._id)
      expect(automationRes._rev).toBeDefined()
      expect(automationRes._rev).not.toEqual(automation._rev)
      // content updates
      expect(automationRes.name).toEqual("Updated Name")
      expect(message).toEqual(
        `Automation ${automation._id} updated successfully.`
      )
      // events
      expect(events.automation.created).not.toBeCalled()
      expect(events.automation.stepCreated).not.toBeCalled()
      expect(events.automation.stepDeleted).not.toBeCalled()
      expect(events.automation.triggerUpdated).not.toBeCalled()
    })

    it("updates a automations name using POST request", async () => {
      let automation = newAutomation()
      await config.createAutomation(automation)
      automation.name = "Updated Name"
      jest.clearAllMocks()

      // the POST request will defer to the update
      // when an id has been supplied.
      const res = await updateWithPost(automation)

      const automationRes = res.body.automation
      const message = res.body.message
      // doc attributes
      expect(automationRes._id).toEqual(automation._id)
      expect(automationRes._rev).toBeDefined()
      expect(automationRes._rev).not.toEqual(automation._rev)
      // content updates
      expect(automationRes.name).toEqual("Updated Name")
      expect(message).toEqual(
        `Automation ${automation._id} updated successfully.`
      )
      // events
      expect(events.automation.created).not.toBeCalled()
      expect(events.automation.stepCreated).not.toBeCalled()
      expect(events.automation.stepDeleted).not.toBeCalled()
      expect(events.automation.triggerUpdated).not.toBeCalled()
    })

    it("updates an automation trigger", async () => {
      let automation = newAutomation()
      automation = await config.createAutomation(automation)
      automation.definition.trigger = automationTrigger(
        TRIGGER_DEFINITIONS.WEBHOOK
      )
      jest.clearAllMocks()

      await update(automation)

      // events
      expect(events.automation.created).not.toBeCalled()
      expect(events.automation.stepCreated).not.toBeCalled()
      expect(events.automation.stepDeleted).not.toBeCalled()
      expect(events.automation.triggerUpdated).toBeCalledTimes(1)
    })

    it("adds automation steps", async () => {
      let automation = newAutomation()
      automation = await config.createAutomation(automation)
      automation.definition.steps.push(automationStep())
      automation.definition.steps.push(automationStep())
      jest.clearAllMocks()

      // check the post request honours updates with same id
      await update(automation)

      // events
      expect(events.automation.stepCreated).toBeCalledTimes(2)
      expect(events.automation.created).not.toBeCalled()
      expect(events.automation.stepDeleted).not.toBeCalled()
      expect(events.automation.triggerUpdated).not.toBeCalled()
    })

    it("removes automation steps", async () => {
      let automation = newAutomation()
      automation.definition.steps.push(automationStep())
      automation = await config.createAutomation(automation)
      automation.definition.steps = []
      jest.clearAllMocks()

      // check the post request honours updates with same id
      await update(automation)

      // events
      expect(events.automation.stepDeleted).toBeCalledTimes(2)
      expect(events.automation.stepCreated).not.toBeCalled()
      expect(events.automation.created).not.toBeCalled()
      expect(events.automation.triggerUpdated).not.toBeCalled()
    })

    it("adds and removes automation steps", async () => {
      let automation = newAutomation()
      automation = await config.createAutomation(automation)
      automation.definition.steps = [automationStep(), automationStep()]
      jest.clearAllMocks()

      // check the post request honours updates with same id
      await update(automation)

      // events
      expect(events.automation.stepCreated).toBeCalledTimes(2)
      expect(events.automation.stepDeleted).toBeCalledTimes(1)
      expect(events.automation.created).not.toBeCalled()
      expect(events.automation.triggerUpdated).not.toBeCalled()
    })
  })

  describe("fetch", () => {
    it("return all the automations for an instance", async () => {
      await clearAllAutomations(config)
      const autoConfig = basicAutomation()
      await config.createAutomation(autoConfig)
      const res = await request
        .get(`/api/automations`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
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
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.id).toEqual(automation._id)
      expect(events.automation.deleted).toBeCalledTimes(1)
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

  describe("checkForCollectStep", () => {
    it("should return true if a collect step exists in an automation", async () => {
      let automation = collectAutomation()
      await config.createAutomation(automation)
      let res = await sdk.automations.utils.checkForCollectStep(automation)
      expect(res).toEqual(true)
    })
  })
})
