import { AutomationTestProgressEvent } from "@budibase/types"
import cloneDeep from "lodash/cloneDeep"

type AutomationOutputs = Record<string, unknown>

interface OAuth2UserOutput {
  user: {
    oauth2?: unknown
  }
}

function hasOAuth2UserOutput(
  outputs?: AutomationOutputs | null
): outputs is AutomationOutputs & OAuth2UserOutput {
  return (
    !!outputs &&
    typeof outputs.user === "object" &&
    outputs.user !== null &&
    "oauth2" in outputs.user
  )
}

function stripOAuth2FromOutputs(outputs?: AutomationOutputs | null) {
  if (hasOAuth2UserOutput(outputs)) {
    delete outputs.user.oauth2
  }
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
