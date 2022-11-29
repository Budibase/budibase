import fetch from "node-fetch"
import { getFetchResponse } from "./utils"
import {
  AutomationActionStepId,
  AutomationStepSchema,
  AutomationStepInput,
} from "@budibase/types"

export const definition: AutomationStepSchema = {
  name: "Integromat Integration",
  tagline: "Trigger an Integromat scenario",
  description:
    "Performs a webhook call to Integromat and gets the response (if configured)",
  icon: "ri-shut-down-line",
  stepId: AutomationActionStepId.integromat,
  type: "ACTION",
  internal: false,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        url: {
          type: "string",
          title: "Webhook URL",
        },
        value1: {
          type: "string",
          title: "Input Value 1",
        },
        value2: {
          type: "string",
          title: "Input Value 2",
        },
        value3: {
          type: "string",
          title: "Input Value 3",
        },
        value4: {
          type: "string",
          title: "Input Value 4",
        },
        value5: {
          type: "string",
          title: "Input Value 5",
        },
      },
      required: ["url", "value1", "value2", "value3", "value4", "value5"],
    },
    outputs: {
      properties: {
        success: {
          type: "boolean",
          description: "Whether call was successful",
        },
        httpStatus: {
          type: "number",
          description: "The HTTP status code returned",
        },
        response: {
          type: "object",
          description: "The webhook response - this can have properties",
        },
      },
      required: ["success", "response"],
    },
  },
}

export async function run({ inputs }: AutomationStepInput) {
  const { url, value1, value2, value3, value4, value5 } = inputs

  const response = await fetch(url, {
    method: "post",
    body: JSON.stringify({
      value1,
      value2,
      value3,
      value4,
      value5,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })

  const { status, message } = await getFetchResponse(response)
  return {
    httpStatus: status,
    success: status === 200,
    response: message,
  }
}
