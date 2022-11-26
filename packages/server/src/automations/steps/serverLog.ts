import {
  AutomationActionStepId,
  AutomationStepSchema,
  AutomationStepInput,
} from "@budibase/types"

/**
 * Note, there is some functionality in this that is not currently exposed as it
 * is complex and maybe better to be opinionated here.
 * GET/DELETE requests cannot handle body elements so they will not be sent if configured.
 */

export const definition: AutomationStepSchema = {
  name: "Backend log",
  tagline: "Console log a value in the backend",
  icon: "Monitoring",
  description: "Logs the given text to the server (using console.log)",
  type: "ACTION",
  internal: true,
  stepId: AutomationActionStepId.SERVER_LOG,
  inputs: {
    text: "",
  },
  schema: {
    inputs: {
      properties: {
        text: {
          type: "string",
          title: "Log",
        },
      },
      required: ["text"],
    },
    outputs: {
      properties: {
        success: {
          type: "boolean",
          description: "Whether the action was successful",
        },
        message: {
          type: "string",
          description: "What was output",
        },
      },
      required: ["success", "message"],
    },
  },
}

export async function run({ inputs, appId }: AutomationStepInput) {
  const message = `App ${appId} - ${inputs.text}`
  console.log(message)
  return {
    success: true,
    message,
  }
}
