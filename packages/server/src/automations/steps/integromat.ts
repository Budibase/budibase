import fetch from "node-fetch"
import { getFetchResponse } from "./utils"
import {
  AutomationActionStepId,
  AutomationStepSchema,
  AutomationStepInput,
  AutomationStepType,
  AutomationIOType,
} from "@budibase/types"

export const definition: AutomationStepSchema = {
  name: "Integromat Integration",
  tagline: "Trigger an Integromat scenario",
  description:
    "Performs a webhook call to Integromat and gets the response (if configured)",
  icon: "ri-shut-down-line",
  stepId: AutomationActionStepId.integromat,
  type: AutomationStepType.ACTION,
  internal: false,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        url: {
          type: AutomationIOType.STRING,
          title: "Webhook URL",
        },
        value1: {
          type: AutomationIOType.STRING,
          title: "Input Value 1",
        },
        value2: {
          type: AutomationIOType.STRING,
          title: "Input Value 2",
        },
        value3: {
          type: AutomationIOType.STRING,
          title: "Input Value 3",
        },
        value4: {
          type: AutomationIOType.STRING,
          title: "Input Value 4",
        },
        value5: {
          type: AutomationIOType.STRING,
          title: "Input Value 5",
        },
      },
      required: ["url", "value1", "value2", "value3", "value4", "value5"],
    },
    outputs: {
      properties: {
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether call was successful",
        },
        httpStatus: {
          type: AutomationIOType.NUMBER,
          description: "The HTTP status code returned",
        },
        response: {
          type: AutomationIOType.OBJECT,
          description: "The webhook response - this can have properties",
        },
      },
      required: ["success", "response"],
    },
  },
}

export async function run({ inputs }: AutomationStepInput) {
  const { url, value1, value2, value3, value4, value5 } = inputs

  if (!url?.trim()?.length) {
    return {
      httpStatus: 400,
      response: "Missing Webhook URL",
      success: false,
    }
  }
  let response
  try {
    response = await fetch(url, {
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
  } catch (err: any) {
    return {
      httpStatus: 400,
      response: err.message,
      success: false,
    }
  }

  const { status, message } = await getFetchResponse(response)
  return {
    httpStatus: status,
    success: status === 200,
    response: message,
  }
}
