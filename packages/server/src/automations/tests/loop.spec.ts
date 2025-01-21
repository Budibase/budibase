import * as automation from "../index"
import * as triggers from "../triggers"
import { loopAutomation } from "../../tests/utilities/structures"
import { context } from "@budibase/backend-core"
import * as setup from "./utilities"
import { Table, LoopStepType, AutomationResults } from "@budibase/types"
import * as loopUtils from "../loopUtils"
import { LoopInput } from "../../definitions/automations"

describe("Attempt to run a basic loop automation", () => {
  let config = setup.getConfig(),
    table: Table

  beforeEach(async () => {
    await automation.init()
    await config.init()
    table = await config.createTable()
    await config.createRow()
  })

  afterAll(setup.afterAll)

  async function runLoop(loopOpts?: LoopInput): Promise<AutomationResults> {
    const appId = config.getAppId()
    return await context.doInAppContext(appId, async () => {
      const params = { fields: { appId } }
      const result = await triggers.externalTrigger(
        loopAutomation(table._id!, loopOpts),
        params,
        { getResponses: true }
      )
      if ("outputs" in result && !result.outputs.success) {
        throw new Error("Unable to proceed - failed to return anything.")
      }
      return result as AutomationResults
    })
  }

  it("attempt to run a basic loop", async () => {
    const resp = await runLoop()
    expect(resp.steps[2].outputs.iterations).toBe(1)
  })

  it("test a loop with a string", async () => {
    const resp = await runLoop({
      option: LoopStepType.STRING,
      binding: "a,b,c",
    })
    expect(resp.steps[2].outputs.iterations).toBe(3)
  })

  it("test a loop with a binding that returns an integer", async () => {
    const resp = await runLoop({
      option: LoopStepType.ARRAY,
      binding: "{{ 1 }}",
    })
    expect(resp.steps[2].outputs.iterations).toBe(1)
  })

  describe("replaceFakeBindings", () => {
    it("should replace loop bindings in nested objects", () => {
      const originalStepInput = {
        schema: {
          name: {
            type: "string",
            constraints: {
              type: "string",
              length: { maximum: null },
              presence: false,
            },
            name: "name",
            display: { type: "Text" },
          },
        },
        row: {
          tableId: "ta_aaad4296e9f74b12b1b90ef7a84afcad",
          name: "{{ loop.currentItem.pokemon }}",
        },
      }

      const loopStepNumber = 3

      const result = loopUtils.replaceFakeBindings(
        originalStepInput,
        loopStepNumber
      )

      expect(result).toEqual({
        schema: {
          name: {
            type: "string",
            constraints: {
              type: "string",
              length: { maximum: null },
              presence: false,
            },
            name: "name",
            display: { type: "Text" },
          },
        },
        row: {
          tableId: "ta_aaad4296e9f74b12b1b90ef7a84afcad",
          name: "{{ steps.3.currentItem.pokemon }}",
        },
      })
    })

    it("should handle null values in nested objects", () => {
      const originalStepInput = {
        nullValue: null,
        nestedNull: {
          someKey: null,
        },
        validValue: "{{ loop.someValue }}",
      }

      const loopStepNumber = 2

      const result = loopUtils.replaceFakeBindings(
        originalStepInput,
        loopStepNumber
      )

      expect(result).toEqual({
        nullValue: null,
        nestedNull: {
          someKey: null,
        },
        validValue: "{{ steps.2.someValue }}",
      })
    })

    it("should handle empty objects and arrays", () => {
      const originalStepInput = {
        emptyObject: {},
        emptyArray: [],
        nestedEmpty: {
          emptyObj: {},
          emptyArr: [],
        },
      }

      const loopStepNumber = 1

      const result = loopUtils.replaceFakeBindings(
        originalStepInput,
        loopStepNumber
      )

      expect(result).toEqual(originalStepInput)
    })
  })
})
