import {
  AutomationActionStepId,
  AutomationStepDefinition,
  AutomationStepType,
  AutomationIOType,
  AutomationFeature,
  ServerLogStepInputs,
  ServerLogStepOutputs,
} from "@budibase/types"

/**
 * Note, there is some functionality in this that is not currently exposed as it
 * is complex and maybe better to be opinionated here.
 * GET/DELETE requests cannot handle body elements so they will not be sent if configured.
 */

export const definition: AutomationStepDefinition = {
  name: "Backend log",
  tagline: "Console log a value in the backend",
  icon: "Monitoring",
  description: "Logs the given text to the server (using console.log)",
  type: AutomationStepType.ACTION,
  internal: true,
  features: {
    [AutomationFeature.LOOPING]: true,
  },
  stepId: AutomationActionStepId.SERVER_LOG,
  inputs: {
    text: "",
  },
  schema: {
    inputs: {
      properties: {
        text: {
          type: AutomationIOType.STRING,
          title: "Log",
        },
      },
      required: ["text"],
    },
    outputs: {
      properties: {
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the action was successful",
        },
        message: {
          type: AutomationIOType.STRING,
          description: "What was output",
        },
      },
      required: ["success", "message"],
    },
  },
}

export async function run({
  inputs,
  appId,
}: {
  inputs: ServerLogStepInputs
  appId: string
}): Promise<ServerLogStepOutputs> {
  if (typeof inputs.text !== "string") {
    inputs.text = JSON.stringify(inputs.text)
  }
  const message = `App ${appId} - ${inputs.text}`
  console.log(message)
  return {
    success: true,
    message,
  }
}
