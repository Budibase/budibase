import {
  checkBuilderEndpoint,
  getAllTableRows,
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
  ConfigType,
  FieldType,
  FilterCondition,
  isDidNotTriggerResponse,
  SettingsConfig,
  Table,
} from "@budibase/types"
import { mocks } from "@budibase/backend-core/tests"
import { createAutomationBuilder } from "../../../automations/tests/utilities/AutomationTestBuilder"
import { basicTable } from "../../../tests/utilities/structures"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"

const MAX_RETRIES = 4
const {
  basicAutomation,
  newAutomation,
  automationTrigger,
  automationStep,
  collectAutomation,
  filterAutomation,
  updateRowAutomationWithFilters,
} = setup.structures

describe("/automations", () => {
  const config = new TestConfiguration()

  afterAll(() => {
    config.end()
  })

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("get definitions", () => {
    it("returns a list of definitions for actions", async () => {
      const res = await config.api.automation.getActions()
      expect(Object.keys(res).length).not.toEqual(0)
    })

    it("returns a list of definitions for triggerInfo", async () => {
      const res = await config.api.automation.getTriggers()
      expect(Object.keys(res).length).not.toEqual(0)
    })

    it("returns all of the definitions in one", async () => {
      const { action, trigger } = await config.api.automation.getDefinitions()

      expect(Object.keys(action).length).toBeGreaterThanOrEqual(
        Object.keys(BUILTIN_ACTION_DEFINITIONS).length
      )
      expect(Object.keys(trigger).length).toEqual(
        Object.keys(TRIGGER_DEFINITIONS).length
      )
    })
  })

  describe("create", () => {
    it("creates an automation with no steps", async () => {
      const { message, automation } = await config.api.automation.post(
        newAutomation({ steps: [] })
      )

      expect(message).toEqual("Automation created successfully")
      expect(automation.name).toEqual("My Automation")
      expect(automation._id).not.toEqual(null)
      expect(events.automation.created).toHaveBeenCalledTimes(1)
      expect(events.automation.stepCreated).not.toHaveBeenCalled()
    })

    it("creates an automation with steps", async () => {
      jest.clearAllMocks()

      const { message, automation } = await config.api.automation.post(
        newAutomation({ steps: [automationStep(), automationStep()] })
      )

      expect(message).toEqual("Automation created successfully")
      expect(automation.name).toEqual("My Automation")
      expect(automation._id).not.toEqual(null)
      expect(events.automation.created).toHaveBeenCalledTimes(1)
      expect(events.automation.stepCreated).toHaveBeenCalledTimes(2)
    })

    it("Should ensure you can't have a branch as not a last step", async () => {
      const automation = createAutomationBuilder(config)
        .onAppAction()
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
      const automation = createAutomationBuilder(config)
        .onAppAction()
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
      const automation = createAutomationBuilder(config)
        .onAppAction()
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
      const automation = createAutomationBuilder(config)
        .onAppAction()
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
      const { _id, _rev } = await config.api.automation.get(automation._id!)
      expect(_id).toEqual(automation._id)
      expect(_rev).toEqual(automation._rev)
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
      const result = await createAutomationBuilder(config)
        .onAppAction()
        .serverLog({
          text: "{{ settings.url }}",
        })
        .serverLog({
          text: "{{ settings.logo }}",
        })
        .serverLog({
          text: "{{ settings.company }}",
        })
        .test({ fields: {} })

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
      const { automation } = await config.api.automation.post(newAutomation())
      await config.api.automation.trigger(
        automation._id!,
        {
          fields: {},
          timeout: 1000,
        },
        {
          status: 400,
          body: {
            message: "Only apps in production support this endpoint",
          },
        }
      )
    })

    it("triggers a synchronous automation", async () => {
      mocks.licenses.useSyncAutomations()
      const { automation } = await config.api.automation.post(
        collectAutomation()
      )
      await config.api.automation.trigger(
        automation._id!,
        {
          fields: {},
          timeout: 1000,
        },
        {
          status: 200,
          body: {
            success: true,
            value: [1, 2, 3],
          },
        }
      )
    })

    it("should throw an error when attempting to trigger a disabled automation", async () => {
      mocks.licenses.useSyncAutomations()
      const { automation } = await config.api.automation.post(
        collectAutomation({ disabled: true })
      )

      await config.api.automation.trigger(
        automation._id!,
        {
          fields: {},
          timeout: 1000,
        },
        {
          status: 400,
          body: {
            message: "Automation is disabled",
          },
        }
      )
    })

    it("triggers an asynchronous automation", async () => {
      const { automation } = await config.api.automation.post(newAutomation())
      await config.publish()

      await config.withProdApp(() =>
        config.api.automation.trigger(
          automation._id!,
          {
            fields: {},
            timeout: 1000,
          },
          {
            status: 200,
            body: {
              message: `Automation ${automation._id} has been triggered.`,
            },
          }
        )
      )
    })
  })

  describe("update", () => {
    it("updates a automations name", async () => {
      const { automation } = await config.api.automation.post(basicAutomation())
      automation.name = "Updated Name"
      jest.clearAllMocks()

      const { automation: updatedAutomation, message } =
        await config.api.automation.update(automation)

      expect(updatedAutomation._id).toEqual(automation._id)
      expect(updatedAutomation._rev).toBeDefined()
      expect(updatedAutomation._rev).not.toEqual(automation._rev)

      expect(updatedAutomation.name).toEqual("Updated Name")
      expect(message).toEqual(
        `Automation ${automation._id} updated successfully.`
      )

      expect(events.automation.created).not.toHaveBeenCalled()
      expect(events.automation.stepCreated).not.toHaveBeenCalled()
      expect(events.automation.stepDeleted).not.toHaveBeenCalled()
      expect(events.automation.triggerUpdated).not.toHaveBeenCalled()
    })

    it("updates a automations name using POST request", async () => {
      const { automation } = await config.api.automation.post(basicAutomation())
      automation.name = "Updated Name"
      jest.clearAllMocks()

      // the POST request will defer to the update when an id has been supplied.
      const { automation: updatedAutomation, message } =
        await config.api.automation.post(automation)

      expect(updatedAutomation._id).toEqual(automation._id)
      expect(updatedAutomation._rev).toBeDefined()
      expect(updatedAutomation._rev).not.toEqual(automation._rev)

      expect(updatedAutomation.name).toEqual("Updated Name")
      expect(message).toEqual(
        `Automation ${automation._id} updated successfully.`
      )

      expect(events.automation.created).not.toHaveBeenCalled()
      expect(events.automation.stepCreated).not.toHaveBeenCalled()
      expect(events.automation.stepDeleted).not.toHaveBeenCalled()
      expect(events.automation.triggerUpdated).not.toHaveBeenCalled()
    })

    it("updates an automation trigger", async () => {
      const { automation } = await config.api.automation.post(newAutomation())
      automation.definition.trigger = automationTrigger(
        TRIGGER_DEFINITIONS.WEBHOOK
      )
      jest.clearAllMocks()

      await config.api.automation.update(automation)

      expect(events.automation.created).not.toHaveBeenCalled()
      expect(events.automation.stepCreated).not.toHaveBeenCalled()
      expect(events.automation.stepDeleted).not.toHaveBeenCalled()
      expect(events.automation.triggerUpdated).toHaveBeenCalledTimes(1)
    })

    it("adds automation steps", async () => {
      const { automation } = await config.api.automation.post(newAutomation())
      automation.definition.steps.push(automationStep())
      automation.definition.steps.push(automationStep())
      jest.clearAllMocks()

      await config.api.automation.update(automation)

      expect(events.automation.stepCreated).toHaveBeenCalledTimes(2)
      expect(events.automation.created).not.toHaveBeenCalled()
      expect(events.automation.stepDeleted).not.toHaveBeenCalled()
      expect(events.automation.triggerUpdated).not.toHaveBeenCalled()
    })

    it("removes automation steps", async () => {
      const { automation } = await config.api.automation.post(newAutomation())
      automation.definition.steps = []
      jest.clearAllMocks()

      await config.api.automation.update(automation)

      expect(events.automation.stepDeleted).toHaveBeenCalledTimes(1)
      expect(events.automation.stepCreated).not.toHaveBeenCalled()
      expect(events.automation.created).not.toHaveBeenCalled()
      expect(events.automation.triggerUpdated).not.toHaveBeenCalled()
    })

    it("adds and removes automation steps", async () => {
      const { automation } = await config.api.automation.post(newAutomation())
      automation.definition.steps = [automationStep(), automationStep()]
      jest.clearAllMocks()

      await config.api.automation.update(automation)

      expect(events.automation.stepCreated).toHaveBeenCalledTimes(2)
      expect(events.automation.stepDeleted).toHaveBeenCalledTimes(1)
      expect(events.automation.created).not.toHaveBeenCalled()
      expect(events.automation.triggerUpdated).not.toHaveBeenCalled()
    })

    it("can update an input field", async () => {
      const { automation } = await createAutomationBuilder(config)
        .onRowDeleted({ tableId: "tableId" })
        .serverLog({ text: "test" })
        .save()

      automation.definition.trigger.inputs.tableId = "newTableId"
      const { automation: updatedAutomation } =
        await config.api.automation.update(automation)

      expect(updatedAutomation.definition.trigger.inputs.tableId).toEqual(
        "newTableId"
      )
    })

    it("cannot update a readonly field", async () => {
      const { automation } = await createAutomationBuilder(config)
        .onRowAction({ tableId: "tableId" })
        .serverLog({ text: "test" })
        .save()

      automation.definition.trigger.inputs.tableId = "newTableId"
      await config.api.automation.update(automation, {
        status: 400,
        body: {
          message: "Field tableId is readonly and it cannot be modified",
        },
      })
    })
  })

  describe("fetch", () => {
    it("return all the automations for an instance", async () => {
      const { automation: automation1 } = await config.api.automation.post(
        newAutomation()
      )
      const { automation: automation2 } = await config.api.automation.post(
        newAutomation()
      )
      const { automation: automation3 } = await config.api.automation.post(
        newAutomation()
      )

      const { automations } = await config.api.automation.fetch()
      expect(automations).toEqual(
        expect.arrayContaining([automation1, automation2, automation3])
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
      const { automation } = await config.api.automation.post(newAutomation())
      const { id } = await config.api.automation.delete(automation)

      expect(id).toEqual(automation._id)
      expect(events.automation.deleted).toHaveBeenCalledTimes(1)
    })

    it("cannot delete a row action automation", async () => {
      const { automation } = await config.api.automation.post(
        setup.structures.rowActionAutomation()
      )

      await config.api.automation.delete(automation, {
        status: 422,
        body: {
          message: "Row actions automations cannot be deleted",
          status: 422,
        },
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
      const { automation } = await config.api.automation.post(
        collectAutomation()
      )
      expect(sdk.automations.utils.checkForCollectStep(automation)).toEqual(
        true
      )
    })

    it("should return false if a collect step does not exist in an automation", async () => {
      const { automation } = await config.api.automation.post(newAutomation())
      expect(sdk.automations.utils.checkForCollectStep(automation)).toEqual(
        false
      )
    })
  })

  describe("Update Row Old / New Row comparison", () => {
    it.each([
      { oldCity: "asdsadsadsad", newCity: "new" },
      { oldCity: "Belfast", newCity: "Belfast" },
    ])(
      "triggers an update row automation and compares new to old rows with old city '%s' and new city '%s'",
      async ({ oldCity, newCity }) => {
        let table = await config.api.table.save(basicTable())

        const { automation } = await config.api.automation.post(
          filterAutomation({
            definition: {
              trigger: {
                inputs: {
                  tableId: table._id,
                },
              },
              steps: [
                {
                  inputs: {
                    condition: FilterCondition.EQUAL,
                    field: "{{ trigger.row.City }}",
                    value: "{{ trigger.oldRow.City }}",
                  },
                },
              ],
            },
          })
        )

        const res = await config.api.automation.test(automation._id!, {
          fields: {},
          oldRow: {
            City: oldCity,
          },
          row: {
            City: newCity,
          },
        })

        if (isDidNotTriggerResponse(res)) {
          throw new Error("Automation did not trigger")
        }

        const expectedResult = oldCity === newCity
        expect(res.steps[1].outputs.result).toEqual(expectedResult)
      }
    )
  })
  describe("Automation Update / Creator row trigger filtering", () => {
    let table: Table

    beforeAll(async () => {
      table = await config.api.table.save(
        basicTable(undefined, {
          name: "table",
          type: "table",
          schema: {
            Approved: {
              name: "Approved",
              type: FieldType.BOOLEAN,
            },
          },
        })
      )
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
        let req = updateRowAutomationWithFilters(config.getAppId(), table._id!)
        req.definition.trigger.inputs = {
          tableId: table._id,
          filters,
        }

        const { automation } = await config.api.automation.post(req)
        const res = await config.api.automation.test(automation._id!, {
          fields: {},
          oldRow: {
            tableId: table._id,
            ...oldRow,
          },
          row: {
            tableId: table._id,
            ...row,
          },
        })

        if (isDidNotTriggerResponse(res)) {
          expect(expectToRun).toEqual(false)
        } else {
          expect(res.steps[1].outputs.success).toEqual(expectToRun)
        }
      }
    )
  })
})
