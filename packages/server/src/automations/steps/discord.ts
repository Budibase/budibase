import fetch from "node-fetch"
import { getFetchResponse } from "./utils"
import {
  AutomationActionStepId,
  AutomationStepSchema,
  AutomationStepInput,
} from "@budibase/types"

const DEFAULT_USERNAME = "Budibase Automate"
const DEFAULT_AVATAR_URL = "https://i.imgur.com/a1cmTKM.png"

export const definition: AutomationStepSchema = {
  name: "Discord Message",
  tagline: "Send a message to a Discord server",
  description: "Send a message to a Discord server",
  icon: "ri-discord-line",
  stepId: AutomationActionStepId.discord,
  type: "ACTION",
  internal: false,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        url: {
          type: "string",
          title: "Discord Webhook URL",
        },
        username: {
          type: "string",
          title: "Bot Name",
        },
        avatar_url: {
          type: "string",
          title: "Bot Avatar URL",
        },
        content: {
          type: "string",
          title: "Message",
        },
      },
      required: ["url", "content"],
    },
    outputs: {
      properties: {
        httpStatus: {
          type: "number",
          description: "The HTTP status code of the request",
        },
        response: {
          type: "string",
          description: "The response from the Discord Webhook",
        },
        success: {
          type: "boolean",
          description: "Whether the message sent successfully",
        },
      },
    },
  },
}

export async function run({ inputs }: AutomationStepInput) {
  let { url, username, avatar_url, content } = inputs
  if (!username) {
    username = DEFAULT_USERNAME
  }
  if (!avatar_url) {
    avatar_url = DEFAULT_AVATAR_URL
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
        username,
        avatar_url,
        content,
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
    success: status === 200 || status === 204,
    response: message,
  }
}
