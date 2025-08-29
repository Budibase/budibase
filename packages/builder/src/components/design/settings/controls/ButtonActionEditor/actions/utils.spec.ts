import { describe, it, expect } from "vitest"
import { filterTriggerableAutomations } from "./utils"
import { TriggerStepID } from "@/constants/backend/automations"

const makeAutomation = (id: string, stepId: TriggerStepID) => ({
  _id: id,
  definition: { trigger: { stepId, inputs: { fields: {} } }, steps: [] },
  disabled: false,
  name: `auto-${id}`,
})

describe("filterTriggerableAutomations", () => {
  it("deduplicates app trigger automations", () => {
    const automations = [
      makeAutomation("1", TriggerStepID.APP),
      makeAutomation("1", TriggerStepID.APP),
      makeAutomation("2", TriggerStepID.APP),
      makeAutomation("3", TriggerStepID.TABLE),
    ] as any

    const result = filterTriggerableAutomations(automations)
    expect(result.map(a => a._id)).toEqual(["1", "2"])
  })
})
