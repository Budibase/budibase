import fetch, { HeadersInit } from "node-fetch"
import { getFetchResponse } from "./utils"
import {
  HttpMethod,
  ExternalAppStepOutputs,
  n8nStepInputs,
} from "@budibase/types"

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
