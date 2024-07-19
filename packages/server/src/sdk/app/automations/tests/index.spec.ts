import _ from "lodash/fp"
import { Automation } from "@budibase/types"
import automationSdk from "../"
import { structures } from "../../../../api/routes/tests/utilities"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

describe("automation sdk", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  describe("update", () => {
    it("can update input fields", async () => {
      await config.doInContext(config.getAppId(), async () => {
        const automation: Automation = structures.newAutomation()
        const keyToUse = _.sample(
          Object.keys(automation.definition.trigger.inputs)
        )!
        automation.definition.trigger.inputs[keyToUse] = "anyValue"

        const response = await automationSdk.create(automation)

        const update = { ...response }
        update.definition.trigger.inputs[keyToUse] = "anyUpdatedValue"
        const result = await automationSdk.update(update)
        expect(result.definition.trigger.inputs[keyToUse]).toEqual(
          "anyUpdatedValue"
        )
      })
    })

    it("cannot update readonly fields", async () => {
      await config.doInContext(config.getAppId(), async () => {
        const automation: Automation = { ...structures.newAutomation() }
        automation.definition.trigger.schema.inputs.properties[
          "readonlyProperty"
        ] = {
          readonly: true,
        }
        automation.definition.trigger.inputs["readonlyProperty"] = "anyValue"

        const response = await automationSdk.create(automation)

        const update = { ...response }
        update.definition.trigger.inputs["readonlyProperty"] = "anyUpdatedValue"
        await expect(automationSdk.update(update)).rejects.toThrow(
          "Field readonlyProperty is readonly and it cannot be modified"
        )
      })
    })
  })
})
