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
import { configs, context, events } from "@budibase/backend-core"
import sdk from "../../../sdk"
import {
  Automation,
  ConfigType,
  FieldType,
  SettingsConfig,
  Table,
} from "@budibase/types"
import { mocks } from "@budibase/backend-core/tests"
import { FilterConditions } from "../../../automations/steps/filter"
import { removeDeprecated } from "../../../automations/utils"
import { createAutomationBuilder } from "../../../automations/tests/utilities/AutomationTestBuilder"

const MAX_RETRIES = 4
let {
  basicAutomation,
  newAutomation,
  automationTrigger,
  automationStep,
  collectAutomation,
  filterAutomation,
  updateRowAutomationWithFilters,
} = setup.structures

describe("/automations", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(() => {
    jest.clearAllMocks()
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

      let definitionsLength = Object.keys(
        removeDeprecated(BUILTIN_ACTION_DEFINITIONS)
      ).length

      expect(Object.keys(res.body.action).length).toBeGreaterThanOrEqual(
        definitionsLength
      )
      expect(Object.keys(res.body.trigger).length).toEqual(
        Object.keys(removeDeprecated(TRIGGER_DEFINITIONS)).length
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
      expect(events.automation.created).toHaveBeenCalledTimes(1)
      expect(events.automation.stepCreated).not.toHaveBeenCalled()
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
      expect(events.automation.created).toHaveBeenCalledTimes(1)
      expect(events.automation.stepCreated).toHaveBeenCalledTimes(2)
    })

    it("Should ensure you can't have a branch as not a last step", async () => {
      const automation = createAutomationBuilder({
        name: "String Equality Branching",
        appId: config.getAppId(),
      })
        .appAction({ fields: { status: "active" } })
        .branch({
          activeBranch: {
            steps: stepBuilder =>
              stepBuilder.serverLog({ text: "Active user" }),
            condition: {
              equal: { "trigger.fields.status": "active" },
            },
          },
        })
        .serverLog({ text: "Inactive user" })
        .build()

      await config.api.automation.post(automation, {
        status: 400,
        body: {
          message:
            "Invalid body - Branch steps are only allowed as the last step",
        },
      })
    })

    it("Should check validation on an automation that has a branch step with no children", async () => {
      const automation = createAutomationBuilder({
        name: "String Equality Branching",
        appId: config.getAppId(),
      })
        .appAction({ fields: { status: "active" } })
        .branch({})
        .serverLog({ text: "Inactive user" })
        .build()

      await config.api.automation.post(automation, {
        status: 400,
        body: {
          message:
            'Invalid body - "definition.steps[0].inputs.branches" must contain at least 1 items',
        },
      })
    })

    it("Should check validation on a branch step with empty conditions", async () => {
      const automation = createAutomationBuilder({
        name: "String Equality Branching",
        appId: config.getAppId(),
      })
        .appAction({ fields: { status: "active" } })
        .branch({
          activeBranch: {
            steps: stepBuilder =>
              stepBuilder.serverLog({ text: "Active user" }),
            condition: {},
          },
        })
        .build()

      await config.api.automation.post(automation, {
        status: 400,
        body: {
          message:
            'Invalid body - "definition.steps[0].inputs.branches[0].condition" must have at least 1 key',
        },
      })
    })

    it("Should check validation on an branch that has a condition that is not valid", async () => {
      const automation = createAutomationBuilder({
        name: "String Equality Branching",
        appId: config.getAppId(),
      })
        .appAction({ fields: { status: "active" } })
        .branch({
          activeBranch: {
            steps: stepBuilder =>
              stepBuilder.serverLog({ text: "Active user" }),
            condition: {
              //@ts-ignore
              INCORRECT: { "trigger.fields.status": "active" },
            },
          },
        })
        .serverLog({ text: "Inactive user" })
        .build()

      await config.api.automation.post(automation, {
        status: 400,
        body: {
          message:
            'Invalid body - "definition.steps[0].inputs.branches[0].condition.INCORRECT" is not allowed',
        },
      })
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

  describe("run", () => {
    let oldConfig: SettingsConfig
    beforeAll(async () => {
      await context.doInTenant(config.getTenantId(), async () => {
        oldConfig = await configs.getSettingsConfigDoc()

        const settings: SettingsConfig = {
          _id: oldConfig._id,
          _rev: oldConfig._rev,
          type: ConfigType.SETTINGS,
          config: {
            platformUrl: "https://example.com",
            logoUrl: "https://example.com/logo.png",
            company: "Test Company",
          },
        }
        const saved = await configs.save(settings)
        oldConfig._rev = saved.rev
      })
    })

    afterAll(async () => {
      await context.doInTenant(config.getTenantId(), async () => {
        await configs.save(oldConfig)
      })
    })

    it("should be able to access platformUrl, logoUrl and company in the automation", async () => {
      const result = await createAutomationBuilder({
        name: "Test Automation",
        appId: config.getAppId(),
        config,
      })
        .appAction({ fields: {} })
        .serverLog({
          text: "{{ settings.url }}",
        })
        .serverLog({
          text: "{{ settings.logo }}",
        })
        .serverLog({
          text: "{{ settings.company }}",
        })
        .run()

      expect(result.steps[0].outputs.message).toEndWith("https://example.com")
      expect(result.steps[1].outputs.message).toEndWith(
        "https://example.com/logo.png"
      )
      expect(result.steps[2].outputs.message).toEndWith("Test Company")
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
      automation.appId = config.getAppId()
      automation = await config.createAutomation(automation)
      await setup.delay(500)
      const res = await testAutomation(config, automation, {
        row: {
          name: "Test",
          description: "TEST",
        },
      })
      expect(events.automation.tested).toHaveBeenCalledTimes(1)
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

    it("should throw an error when attempting to trigger a disabled automation", async () => {
      mocks.licenses.useSyncAutomations()
      let automation = collectAutomation()
      automation = await config.createAutomation({
        ...automation,
        disabled: true,
      })

      const res = await request
        .post(`/api/automations/${automation._id}/trigger`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(400)

      expect(res.body.message).toEqual("Automation is disabled")
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
      const automation = await config.createAutomation(newAutomation())
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
      expect(events.automation.created).not.toHaveBeenCalled()
      expect(events.automation.stepCreated).not.toHaveBeenCalled()
      expect(events.automation.stepDeleted).not.toHaveBeenCalled()
      expect(events.automation.triggerUpdated).not.toHaveBeenCalled()
    })

    it("updates a automations name using POST request", async () => {
      const automation = await config.createAutomation(newAutomation())
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
      expect(events.automation.created).not.toHaveBeenCalled()
      expect(events.automation.stepCreated).not.toHaveBeenCalled()
      expect(events.automation.stepDeleted).not.toHaveBeenCalled()
      expect(events.automation.triggerUpdated).not.toHaveBeenCalled()
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
      expect(events.automation.created).not.toHaveBeenCalled()
      expect(events.automation.stepCreated).not.toHaveBeenCalled()
      expect(events.automation.stepDeleted).not.toHaveBeenCalled()
      expect(events.automation.triggerUpdated).toHaveBeenCalledTimes(1)
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
      expect(events.automation.stepCreated).toHaveBeenCalledTimes(2)
      expect(events.automation.created).not.toHaveBeenCalled()
      expect(events.automation.stepDeleted).not.toHaveBeenCalled()
      expect(events.automation.triggerUpdated).not.toHaveBeenCalled()
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
      expect(events.automation.stepDeleted).toHaveBeenCalledTimes(2)
      expect(events.automation.stepCreated).not.toHaveBeenCalled()
      expect(events.automation.created).not.toHaveBeenCalled()
      expect(events.automation.triggerUpdated).not.toHaveBeenCalled()
    })

    it("adds and removes automation steps", async () => {
      let automation = newAutomation()
      automation = await config.createAutomation(automation)
      automation.definition.steps = [automationStep(), automationStep()]
      jest.clearAllMocks()

      // check the post request honours updates with same id
      await update(automation)

      // events
      expect(events.automation.stepCreated).toHaveBeenCalledTimes(2)
      expect(events.automation.stepDeleted).toHaveBeenCalledTimes(1)
      expect(events.automation.created).not.toHaveBeenCalled()
      expect(events.automation.triggerUpdated).not.toHaveBeenCalled()
    })
  })

  describe("fetch", () => {
    it("return all the automations for an instance", async () => {
      await clearAllAutomations(config)
      const autoConfig = await config.createAutomation(basicAutomation())
      const res = await request
        .get(`/api/automations`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.automations[0]).toEqual(
        expect.objectContaining(autoConfig)
      )
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
        .delete(`/api/automations/${automation._id}/${automation._rev}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.id).toEqual(automation._id)
      expect(events.automation.deleted).toHaveBeenCalledTimes(1)
    })

    it("cannot delete a row action automation", async () => {
      const automation = await config.createAutomation(
        setup.structures.rowActionAutomation()
      )
      await request
        .delete(`/api/automations/${automation._id}/${automation._rev}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(422, {
          message: "Row actions automations cannot be deleted",
          status: 422,
        })

      expect(events.automation.deleted).not.toHaveBeenCalled()
    })

    it("should apply authorization to endpoint", async () => {
      const automation = await config.createAutomation()
      await checkBuilderEndpoint({
        config,
        method: "DELETE",
        url: `/api/automations/${automation._id}/${automation._rev}`,
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

  describe("Update Row Old / New Row comparison", () => {
    it.each([
      { oldCity: "asdsadsadsad", newCity: "new" },
      { oldCity: "Belfast", newCity: "Belfast" },
    ])(
      "triggers an update row automation and compares new to old rows with old city '%s' and new city '%s'",
      async ({ oldCity, newCity }) => {
        const expectedResult = oldCity === newCity

        let table = await config.createTable()

        let automation = await filterAutomation(config.getAppId())
        automation.definition.trigger.inputs.tableId = table._id
        automation.definition.steps[0].inputs = {
          condition: FilterConditions.EQUAL,
          field: "{{ trigger.row.City }}",
          value: "{{ trigger.oldRow.City }}",
        }
        automation = await config.createAutomation(automation)
        let triggerInputs = {
          oldRow: {
            City: oldCity,
          },
          row: {
            City: newCity,
          },
        }
        const res = await testAutomation(config, automation, triggerInputs)
        expect(res.body.steps[1].outputs.result).toEqual(expectedResult)
      }
    )
  })
  describe("Automation Update / Creator row trigger filtering", () => {
    let table: Table

    beforeAll(async () => {
      table = await config.createTable({
        name: "table",
        type: "table",
        schema: {
          Approved: {
            name: "Approved",
            type: FieldType.BOOLEAN,
          },
        },
      })
    })

    const testCases = [
      {
        description: "should run when Approved changes from false to true",
        filters: {
          equal: { "1:Approved": true },
        },
        row: { Approved: "true" },
        oldRow: { Approved: "false" },
        expectToRun: true,
      },
      {
        description: "should run when Approved is true in both old and new row",
        filters: { equal: { "1:Approved": true } },
        row: { Approved: "true" },
        oldRow: { Approved: "true" },
        expectToRun: true,
      },

      {
        description:
          "should run when a contains filter matches the correct options",
        filters: {
          contains: { "1:opts": ["Option 1", "Option 3"] },
        },
        row: { opts: ["Option 1", "Option 3"] },
        oldRow: { opts: ["Option 3"] },
        expectToRun: true,
      },
      {
        description:
          "should not run when opts doesn't contain any specified option",
        filters: {
          contains: { "1:opts": ["Option 1", "Option 2"] },
        },
        row: { opts: ["Option 3", "Option 4"] },
        oldRow: { opts: ["Option 3", "Option 4"] },
        expectToRun: false,
      },
    ]

    it.each(testCases)(
      "$description",
      async ({ filters, row, oldRow, expectToRun }) => {
        let automation = await updateRowAutomationWithFilters(
          config.getAppId(),
          table._id!
        )
        automation.definition.trigger.inputs = {
          tableId: table._id,
          filters,
        }
        automation = await config.createAutomation(automation)

        const inputs = {
          row: {
            tableId: table._id,
            ...row,
          },
          oldRow: {
            tableId: table._id,
            ...oldRow,
          },
        }

        const res = await testAutomation(config, automation, inputs)

        if (expectToRun) {
          expect(res.body.steps[1].outputs.success).toEqual(true)
        } else {
          expect(res.body.outputs.success).toEqual(false)
        }
      }
    )
  })
})
