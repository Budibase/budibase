import * as queryController from "../../api/controllers/query"
import { buildCtx } from "./utils"
import * as automationUtils from "../automationUtils"
import {
  AutomationActionStepId,
  AutomationCustomIOType,
  AutomationFeature,
  AutomationIOType,
  AutomationStepInput,
  AutomationStepSchema,
  AutomationStepType,
} from "@budibase/types"

export const definition: AutomationStepSchema = {
  name: "External Data Connector",
  tagline: "Execute Data Connector",
  icon: "Data",
  description: "Execute a query in an external data connector",
  type: AutomationStepType.ACTION,
  stepId: AutomationActionStepId.EXECUTE_QUERY,
  internal: true,
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
              customType: AutomationCustomIOType.QUERY,
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

export async function run({ inputs, appId, emitter }: AutomationStepInput) {
  if (inputs.query == null) {
    return {
      success: false,
      response: {
        message: "Invalid inputs",
      },
    }
  }

  const { queryId, ...rest } = inputs.query

  const ctx: any = buildCtx(appId, emitter, {
    body: {
      parameters: rest,
    },
    params: {
      queryId,
    },
  })

  try {
    await queryController.executeV2(ctx, { isAutomation: true })
    const { data, ...rest } = ctx.body

    return {
      response: data,
      info: rest,
      success: true,
    }
  } catch (err) {
    return {
      success: false,
      info: {},
      response: automationUtils.getError(err),
    }
  }
}
