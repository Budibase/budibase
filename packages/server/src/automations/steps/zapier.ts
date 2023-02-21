import fetch from "node-fetch"
import { getFetchResponse } from "./utils"
import {
  AutomationActionStepId,
  AutomationStepSchema,
  AutomationStepInput,
} from "@budibase/types"

export const definition: AutomationStepSchema = {
  name: "Zapier Webhook",
  stepId: AutomationActionStepId.zapier,
  type: "ACTION",
  internal: false,
  description: "Trigger a Zapier Zap via webhooks",
  tagline: "Trigger a Zapier Zap",
  icon: "ri-flashlight-line",
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
          title: "Payload Value 1",
        },
        value2: {
          type: "string",
          title: "Payload Value 2",
        },
        value3: {
          type: "string",
          title: "Payload Value 3",
        },
        value4: {
          type: "string",
          title: "Payload Value 4",
        },
        value5: {
          type: "string",
          title: "Payload Value 5",
        },
      },
      required: ["url"],
    },
    outputs: {
      properties: {
        httpStatus: {
          type: "number",
          description: "The HTTP status code of the request",
        },
        response: {
          type: "string",
          description: "The response from Zapier",
        },
      },
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
  // send the platform to make sure zaps always work, even
  // if no values supplied
  let response
  try {
    response = await fetch(url, {
      method: "post",
      body: JSON.stringify({
        platform: "budibase",
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
    success: status === 200,
    httpStatus: status,
    response: message,
  }
}
