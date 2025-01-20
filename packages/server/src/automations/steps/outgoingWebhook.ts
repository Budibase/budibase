import fetch from "node-fetch"
import { getFetchResponse } from "./utils"
import * as automationUtils from "../automationUtils"
import {
  ExternalAppStepOutputs,
  OutgoingWebhookStepInputs,
} from "@budibase/types"

enum RequestType {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

const BODY_REQUESTS = [RequestType.POST, RequestType.PUT, RequestType.PATCH]

/**
 * NOTE: this functionality is deprecated - it no longer should be used.
 */

export async function run({
  inputs,
}: {
  inputs: OutgoingWebhookStepInputs
}): Promise<
  Omit<ExternalAppStepOutputs, "httpStatus"> | ExternalAppStepOutputs
> {
  let { requestMethod, url, requestBody, headers } = inputs
  if (!url.startsWith("http")) {
    url = `http://${url}`
  }
  const request: any = {
    method: requestMethod,
  }
  if (headers) {
    try {
      const customHeaders =
        typeof headers === "string" ? JSON.parse(headers) : headers
      request.headers = { ...request.headers, ...customHeaders }
    } catch (err) {
      return {
        success: false,
        response: "Unable to process headers, must be a JSON object.",
      }
    }
  }
  if (
    requestBody &&
    requestBody.length !== 0 &&
    BODY_REQUESTS.indexOf(requestMethod) !== -1
  ) {
    request.body =
      typeof requestBody === "string"
        ? requestBody
        : JSON.stringify(requestBody)
    request.headers = {
      ...request.headers,
      "Content-Type": "application/json",
    }
  }

  try {
    // do a quick JSON parse if there is a body, to generate an error if its invalid
    if (request.body) {
      JSON.parse(request.body)
    }
    const response = await fetch(url, request)
    const { status, message } = await getFetchResponse(response)
    return {
      httpStatus: status,
      response: message,
      success: status >= 200 && status <= 206,
    }
  } catch (err) {
    /* istanbul ignore next */
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
