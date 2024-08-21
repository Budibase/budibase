import fetch from "node-fetch"
import { getFetchResponse } from "./utils"
import {
  AutomationActionStepId,
  AutomationStepDefinition,
  AutomationStepType,
  AutomationIOType,
  AutomationFeature,
  ZapierStepInputs,
  ZapierStepOutputs,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "Zapier Webhook",
  stepId: AutomationActionStepId.zapier,
  type: AutomationStepType.ACTION,
  internal: false,
  features: {
    [AutomationFeature.LOOPING]: true,
  },
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

export async function run({
  inputs,
}: {
  inputs: ZapierStepInputs
}): Promise<ZapierStepOutputs> {
  const { url, body } = inputs

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
