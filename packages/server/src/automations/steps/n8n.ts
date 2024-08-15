import fetch, { HeadersInit } from "node-fetch"
import { getFetchResponse } from "./utils"
import {
  AutomationActionStepId,
  AutomationStepDefinition,
  AutomationStepType,
  AutomationIOType,
  AutomationFeature,
  HttpMethod,
  ExternalAppStepOutputs,
  n8nStepInputs,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "n8n Integration",
  stepTitle: "n8n",
  tagline: "Trigger an n8n workflow",
  description:
    "Performs a webhook call to n8n and gets the response (if configured)",
  icon: "ri-shut-down-line",
  stepId: AutomationActionStepId.n8n,
  type: AutomationStepType.ACTION,
  internal: false,
  features: {
    [AutomationFeature.LOOPING]: true,
  },
  inputs: {},
  schema: {
    inputs: {
      properties: {
        url: {
          type: AutomationIOType.STRING,
          title: "Webhook URL",
        },
        method: {
          type: AutomationIOType.STRING,
          title: "Method",
          enum: Object.values(HttpMethod),
        },
        authorization: {
          type: AutomationIOType.STRING,
          title: "Authorization",
        },
        body: {
          type: AutomationIOType.JSON,
          title: "Payload",
        },
      },
      required: ["url", "method"],
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

export async function run({
  inputs,
}: {
  inputs: n8nStepInputs
}): Promise<ExternalAppStepOutputs> {
  const { url, body, method, authorization } = inputs

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
  let response
  let request: {
    method: string
    headers: HeadersInit
    body?: string
  } = {
    method: method || HttpMethod.GET,
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
    },
  }
  if (!["GET", "HEAD"].includes(request.method)) {
    request.body = JSON.stringify({
      ...payload,
    })
  }

  try {
    response = await fetch(url, request)
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
