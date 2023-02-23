import fetch from "node-fetch"
import { getFetchResponse } from "./utils"
import {
  AutomationActionStepId,
  AutomationStepSchema,
  AutomationStepInput,
} from "@budibase/types"

export const definition: AutomationStepSchema = {
  name: "Slack Message",
  tagline: "Send a message to Slack",
  description: "Send a message to Slack",
  icon: "ri-slack-line",
  stepId: AutomationActionStepId.slack,
  type: "ACTION",
  internal: false,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        url: {
          type: "string",
          title: "Incoming Webhook URL",
        },
        text: {
          type: "string",
          title: "Message",
        },
      },
      required: ["url", "text"],
    },
    outputs: {
      properties: {
        httpStatus: {
          type: "number",
          description: "The HTTP status code of the request",
        },
        success: {
          type: "boolean",
          description: "Whether the message sent successfully",
        },
        response: {
          type: "string",
          description: "The response from the Slack Webhook",
        },
      },
    },
  },
}

export async function run({ inputs }: AutomationStepInput) {
  let { url, text } = inputs
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
        text,
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
    response: message,
    success: status === 200,
  }
}
