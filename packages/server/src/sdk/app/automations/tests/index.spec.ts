import { sample } from "lodash/fp"
import { Automation } from "@budibase/types"
import { generator } from "@budibase/backend-core/tests"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import automationSdk from "../"
import { structures } from "../../../../api/routes/tests/utilities"

describe("automation sdk", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  describe("update", () => {
    it("can rename existing automations", async () => {
      await config.doInContext(config.getAppId(), async () => {
        const automation = structures.newAutomation()

        const response = await automationSdk.create(automation)

        const newName = generator.guid()
        const update = { ...response, name: newName }
        const result = await automationSdk.update(update)
        expect(result.name).toEqual(newName)
      })
    })

    it.each([
      ["trigger", (a: Automation) => a.definition.trigger],
      ["step", (a: Automation) => a.definition.steps[0]],
    ])("can update input fields (for a %s)", async (_, getStep) => {
      await config.doInContext(config.getAppId(), async () => {
        const automation = structures.newAutomation()

        const keyToUse = sample(Object.keys(getStep(automation).inputs))!
        getStep(automation).inputs[keyToUse] = "anyValue"

        const response = await automationSdk.create(automation)

        const update = { ...response }
        getStep(update).inputs[keyToUse] = "anyUpdatedValue"
        const result = await automationSdk.update(update)
        expect(getStep(result).inputs[keyToUse]).toEqual("anyUpdatedValue")
      })
    })

    it.each([
      ["trigger", (a: Automation) => a.definition.trigger],
      ["step", (a: Automation) => a.definition.steps[0]],
    ])("cannot update readonly fields (for a %s)", async (_, getStep) => {
      await config.doInContext(config.getAppId(), async () => {
        const automation = structures.newAutomation()
        getStep(automation).schema.inputs.properties["readonlyProperty"] = {
          readonly: true,
        }
        getStep(automation).inputs["readonlyProperty"] = "anyValue"

        const response = await automationSdk.create(automation)

        const update = { ...response }
        getStep(update).inputs["readonlyProperty"] = "anyUpdatedValue"
        await expect(automationSdk.update(update)).rejects.toThrow(
          "Field readonlyProperty is readonly and it cannot be modified"
        )
      })
    })
  })
})
