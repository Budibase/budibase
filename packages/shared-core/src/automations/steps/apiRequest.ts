import {
  AutomationActionStepId,
  AutomationCustomIOType,
  AutomationFeature,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "API Request",
  tagline: "Execute a REST request",
  icon: "globe",
  description: "Execute a HTTP query from a REST datasource",
  type: AutomationStepType.ACTION,
  stepId: AutomationActionStepId.API_REQUEST,
  internal: true,
  new: true,
  features: {
    [AutomationFeature.LOOPING]: true,
  },
  inputs: {},
  schema: {
    inputs: {
      properties: {
        query: {
          type: AutomationIOType.OBJECT,
          properties: {
            queryId: {
              type: AutomationIOType.STRING,
            },
          },
          customType: AutomationCustomIOType.QUERY_PARAMS,
          title: "Parameters",
          required: ["queryId"],
        },
      },
      required: ["query"],
    },
    outputs: {
      properties: {
        response: {
          type: AutomationIOType.OBJECT,
          description: "The response from the datasource execution",
        },
        info: {
          type: AutomationIOType.OBJECT,
          description:
            "Some query types may return extra data, like headers from a REST query",
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
