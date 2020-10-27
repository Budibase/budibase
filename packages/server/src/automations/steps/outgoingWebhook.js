const axios = require("axios")

const RequestType = {
  POST: "POST",
  GET: "GET",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
}

const BODY_REQUESTS = [RequestType.POST, RequestType.PUT, RequestType.PATCH]

/**
 * Note, there is some functionality in this that is not currently exposed as it
 * is complex and maybe better to be opinionated here.
 * GET/DELETE requests cannot handle body elements so they will not be sent if configured.
 */

module.exports.definition = {
  name: "Outgoing webhook",
  tagline: "Send a {{inputs.requestMethod}} request",
  icon: "ri-send-plane-line",
  description: "Send a request of specified method to a URL",
  type: "ACTION",
  stepId: "OUTGOING_WEBHOOK",
  inputs: {
    requestMethod: "POST",
    url: "http://",
    requestBody: "{}",
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
      },
      required: ["requestMethod", "url"],
    },
    outputs: {
      properties: {
        response: {
          type: "object",
          description: "The response from the webhook",
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

module.exports.run = async function({ inputs }) {
  let { requestMethod, url, requestBody } = inputs
  if (!url.startsWith("http")) {
    url = `http://${url}`
  }
  const request = {
    method: requestMethod,
    url,
  }
  if (
    requestBody &&
    requestBody.length !== 0 &&
    BODY_REQUESTS.indexOf(requestMethod) !== -1
  ) {
    request.data = JSON.parse(requestBody)
  }

  try {
    const response = await axios(request)
    return {
      response: response.data,
      success: response.status === 200,
    }
  } catch (err) {
    return {
      success: false,
      response: err,
    }
  }
}
