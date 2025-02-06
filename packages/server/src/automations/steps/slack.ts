import fetch from "node-fetch"
import { getFetchResponse } from "./utils"
import { ExternalAppStepOutputs, SlackStepInputs } from "@budibase/types"

export async function run({
  inputs,
}: {
  inputs: SlackStepInputs
}): Promise<ExternalAppStepOutputs> {
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
