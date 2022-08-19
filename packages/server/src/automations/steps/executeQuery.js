const queryController = require("../../api/controllers/query")
const { buildCtx } = require("./utils")
const automationUtils = require("../automationUtils")

exports.definition = {
  name: "External Data Connector",
  tagline: "Execute Data Connector",
  icon: "Data",
  description: "Execute a query in an external data connector",
  type: "ACTION",
  stepId: "EXECUTE_QUERY",
  internal: true,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        query: {
          type: "object",
          properties: {
            queryId: {
              type: "string",
              customType: "query",
            },
          },
          customType: "queryParams",
          title: "Parameters",
          required: ["queryId"],
        },
      },
      required: ["query"],
    },
    outputs: {
      properties: {
        response: {
          type: "object",
          description: "The response from the datasource execution",
        },
        info: {
          type: "object",
          description:
            "Some query types may return extra data, like headers from a REST query",
        },
        success: {
          type: "boolean",
          description: "Whether the action was successful",
        },
      },
    },
    required: ["response", "success"],
  },
}

exports.run = async function ({ inputs, appId, emitter }) {
  if (inputs.query == null) {
    return {
      success: false,
      response: {
        message: "Invalid inputs",
      },
    }
  }

  const { queryId, ...rest } = inputs.query

  const ctx = buildCtx(appId, emitter, {
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
