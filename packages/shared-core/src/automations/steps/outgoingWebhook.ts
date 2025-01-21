import {
  AutomationActionStepId,
  AutomationCustomIOType,
  AutomationFeature,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
} from "@budibase/types"

enum RequestType {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

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
