const fetch = require("node-fetch")
const { getFetchResponse } = require("./utils")
const automationUtils = require("../automationUtils")

const RequestType = {
  POST: "POST",
  GET: "GET",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
}

const BODY_REQUESTS = [RequestType.POST, RequestType.PUT, RequestType.PATCH]

/**
 * NOTE: this functionality is deprecated - it no longer should be used.
 */

exports.definition = {
  deprecated: true,
  name: "Outgoing webhook",
  tagline: "Send a {{inputs.requestMethod}} request",
  icon: "Send",
  description: "Send a request of specified method to a URL",
  type: "ACTION",
  internal: true,
  stepId: "OUTGOING_WEBHOOK",
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
          type: "string",
          enum: Object.values(RequestType),
          title: "Request method",
        },
        url: {
          type: "string",
          title: "URL",
        },
        requestBody: {
          type: "string",
          title: "JSON Body",
          customType: "wide",
        },
        headers: {
          type: "string",
          title: "Headers",
          customType: "wide",
        },
      },
      required: ["requestMethod", "url"],
    },
    outputs: {
      properties: {
        response: {
          type: "object",
          description: "The response from the webhook",
        },
        httpStatus: {
          type: "number",
          description: "The HTTP status code returned",
        },
        success: {
          type: "boolean",
          description: "Whether the action was successful",
        },
      },
      required: ["response", "success"],
    },
  },
}

exports.run = async function ({ inputs }) {
  let { requestMethod, url, requestBody, headers } = inputs
  if (!url.startsWith("http")) {
    url = `http://${url}`
  }
  const request = {
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
