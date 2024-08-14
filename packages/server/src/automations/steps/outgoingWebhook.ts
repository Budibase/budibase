import fetch from "node-fetch"
import { getFetchResponse } from "./utils"
import * as automationUtils from "../automationUtils"
import {
  AutomationActionStepId,
  AutomationCustomIOType,
  AutomationFeature,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
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

export const definition: AutomationStepDefinition = {
  deprecated: true,
  name: "Outgoing webhook",
  tagline: "Send a {{inputs.requestMethod}} request",
  icon: "Send",
  description: "Send a request of specified method to a URL",
  type: AutomationStepType.ACTION,
  internal: true,
  features: {
    [AutomationFeature.LOOPING]: true,
  },
  stepId: AutomationActionStepId.OUTGOING_WEBHOOK,
  inputs: {
    requestMethod: "POST",
    url: "http://",
    requestBody: "{}",
    headers: "{}",
  },
  schema: {
    inputs: {
      properties: {
        requestMethod: {
          type: AutomationIOType.STRING,
          enum: Object.values(RequestType),
          title: "Request method",
        },
        url: {
          type: AutomationIOType.STRING,
          title: "URL",
        },
        requestBody: {
          type: AutomationIOType.STRING,
          title: "JSON Body",
          customType: AutomationCustomIOType.WIDE,
        },
        headers: {
          type: AutomationIOType.STRING,
          title: "Headers",
          customType: AutomationCustomIOType.WIDE,
        },
      },
      required: ["requestMethod", "url"],
    },
    outputs: {
      properties: {
        response: {
          type: AutomationIOType.OBJECT,
          description: "The response from the webhook",
        },
        httpStatus: {
          type: AutomationIOType.NUMBER,
          description: "The HTTP status code returned",
        },
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the action was successful",
        },
      },
      required: ["response", "success"],
    },
  },
}

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
