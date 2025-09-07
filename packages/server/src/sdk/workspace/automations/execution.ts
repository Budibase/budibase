import { context } from "@budibase/backend-core"
import { features } from "@budibase/pro"
import { Automation, AutomationActionStepId } from "@budibase/types"
import sdk from "../.."
import * as triggers from "../../../automations/triggers"
import env from "../../../environment"

export async function trigger(
  automationId: string,
  fields: Record<string, any> = {},
  timeout?: number
) {
  const db = context.getWorkspaceDB()
  const automation = await db.get<Automation>(automationId)

  if (!automation) {
    throw new Error(`Automation with ID ${automationId} not found`)
  }

  // Check if automation has APP trigger (required for manual triggering)
  const triggerType = automation.definition?.trigger?.stepId
  if (triggerType !== "APP") {
    throw new Error(
      `Cannot manually trigger automation '${automation.name}'. Only automations with APP trigger type can be manually triggered. This automation has trigger type: ${triggerType}`
    )
  }

  let hasCollectStep = sdk.automations.utils.checkForCollectStep(automation)
  if (hasCollectStep && (await features.isSyncAutomationsEnabled())) {
    const response = await triggers.externalTrigger(
      automation,
      {
        fields,
        timeout: timeout ? timeout * 1000 : env.AUTOMATION_THREAD_TIMEOUT,
      },
      { getResponses: true }
    )

    if (!("steps" in response)) {
      throw new Error("Unable to collect response")
    }

    let collectedValue = response.steps.find(
      step => step.stepId === AutomationActionStepId.COLLECT
    )
    return collectedValue?.outputs
  } else {
    const appId = context.getWorkspaceId()
    await triggers.externalTrigger(automation, {
      fields,
      appId,
    })

    return {
      message: `Automation ${automation._id} has been triggered.`,
      automation,
    }
  }
}
