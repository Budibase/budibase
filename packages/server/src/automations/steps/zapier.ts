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
  name: "Zapier Webhook",
  stepId: AutomationActionStepId.zapier,
  type: AutomationStepType.ACTION,
  internal: false,
  description: "Trigger a Zapier Zap via webhooks",
  tagline: "Trigger a Zapier Zap",
  icon: "ri-flashlight-line",
  inputs: {},
  schema: {
    inputs: {
      properties: {
        url: {
          type: AutomationIOType.STRING,
          title: "Webhook URL",
        },
        body: {
          type: AutomationIOType.JSON,
          title: "Payload",
        },
        value1: {
          type: AutomationIOType.STRING,
          title: "Payload Value 1",
        },
        value2: {
          type: AutomationIOType.STRING,
          title: "Payload Value 2",
        },
        value3: {
          type: AutomationIOType.STRING,
          title: "Payload Value 3",
        },
        value4: {
          type: AutomationIOType.STRING,
          title: "Payload Value 4",
        },
        value5: {
          type: AutomationIOType.STRING,
          title: "Payload Value 5",
        },
      },
      required: ["url"],
    },
    outputs: {
      properties: {
        httpStatus: {
          type: AutomationIOType.NUMBER,
          description: "The HTTP status code of the request",
        },
        response: {
          type: AutomationIOType.STRING,
          description: "The response from Zapier",
        },
      },
    },
  },
}

export async function run({ inputs }: AutomationStepInput) {
  //TODO - Remove deprecated values 1,2,3,4,5 after November 2023
  const { url, value1, value2, value3, value4, value5, body } = inputs

  let payload = {}
  try {
    payload = body?.value ? JSON.parse(body?.value) : {}
  } catch (err) {
    return {
      httpStatus: 400,
      response: "Invalid payload JSON",
      success: false,
    }
  }

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
        ...payload,
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
