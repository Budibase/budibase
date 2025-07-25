import fetch from "node-fetch"
import { getFetchResponse } from "./utils"
import {
  ExternalAppStepOutputs,
  JSONValue,
  MakeIntegrationInputs,
} from "@budibase/types"

export async function run({
  inputs,
}: {
  inputs: MakeIntegrationInputs
}): Promise<ExternalAppStepOutputs> {
  const { url, body } = inputs

  let payload: Record<string, JSONValue> = {}
  try {
    if (body?.value) {
      if (typeof body.value === "string") {
        payload = JSON.parse(body.value)
      } else {
        payload = body.value
      }

      // Handle double-encoded strings in nested properties
      Object.keys(payload).forEach(key => {
        if (typeof payload[key] === "string") {
          try {
            const parsed = JSON.parse(payload[key])
            payload[key] = parsed
          } catch {
            // If parsing fails, keep the original string value
          }
        }
      })
    }
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
