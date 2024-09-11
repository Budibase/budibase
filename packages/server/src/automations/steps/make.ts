import fetch from "node-fetch"
import { getFetchResponse } from "./utils"
import {
  AutomationActionStepId,
  AutomationStepDefinition,
  AutomationStepType,
  AutomationIOType,
  AutomationFeature,
  ExternalAppStepOutputs,
  MakeIntegrationInputs,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "Make Integration",
  stepTitle: "Make",
  tagline: "Trigger a Make scenario",
  description:
    "Performs a webhook call to Make and gets the response (if configured)",
  icon: "ri-shut-down-line",
  stepId: AutomationActionStepId.integromat,
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
        body: {
          type: AutomationIOType.JSON,
          title: "Payload",
        },
      },
      required: ["url", "body"],
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
  inputs: MakeIntegrationInputs
}): Promise<ExternalAppStepOutputs> {
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
  let response
  try {
    response = await fetch(url, {
      method: "post",
      body: JSON.stringify({
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
    httpStatus: status,
    success: status === 200,
    response: message,
  }
}
