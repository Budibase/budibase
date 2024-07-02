import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { getAction } from "../../actions"
import emitter from "../../../events/index"
import { AutomationActionStepId, AutomationStepInput } from "@budibase/types"

export async function runStep(
  config: TestConfiguration,
  stepId: AutomationActionStepId,
  inputs: AutomationStepInput["inputs"],
  stepContext?: AutomationStepInput["context"]
) {
  async function run() {
    return await config.doInContext(config.getAppId(), async () => {
      let step = await getAction(stepId)
      if (!step) {
        throw new Error("No step found")
      }
      return step({
        context: stepContext || {},
        inputs,
        appId: config.getAppId(),
        // don't really need an API key, mocked out usage quota, not being tested here
        apiKey: "test",
        emitter,
      })
    })
  }
  return run()
}
