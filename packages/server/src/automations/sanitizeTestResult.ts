import { AutomationTestProgressEvent } from "@budibase/types"
import cloneDeep from "lodash/cloneDeep"

function stripOAuth2FromOutputs(
  outputs?: Record<string, any> | null
): Record<string, any> | undefined | null {
  if (outputs?.user?.oauth2) {
    delete outputs.user.oauth2
  }
  return outputs
}

export function sanitizeAutomationTestResult(
  result: AutomationTestProgressEvent["result"]
): AutomationTestProgressEvent["result"] {
  if (!result) {
    return result
  }

  const sanitized: NonNullable<AutomationTestProgressEvent["result"]> =
    cloneDeep(result)
  if ("trigger" in sanitized) {
    stripOAuth2FromOutputs(sanitized.trigger.outputs)
    for (const step of sanitized.steps || []) {
      stripOAuth2FromOutputs(step.outputs)
    }
  } else if ("outputs" in sanitized) {
    stripOAuth2FromOutputs(sanitized.outputs)
  }
  return sanitized
}
