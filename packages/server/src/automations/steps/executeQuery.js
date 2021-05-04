const queryController = require("../../api/controllers/query")

module.exports.definition = {
  name: "External Data Connector",
  tagline: "Execute Data Connector",
  icon: "ri-database-2-line",
  description: "Execute a query in an external data connector",
  type: "ACTION",
  stepId: "EXECUTE_QUERY",
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
        success: {
          type: "boolean",
          description: "Whether the action was successful",
        },
      },
    },
    required: ["response", "success"],
  },
}

module.exports.run = async function ({ inputs, appId, emitter }) {
  if (inputs.query == null) {
    return {
      success: false,
      response: {
        message: "Invalid inputs",
      },
    }
  }

  const { queryId, ...rest } = inputs.query

  const ctx = {
    params: {
      queryId,
    },
    request: {
      body: {
        parameters: rest,
      },
    },
    appId,
    eventEmitter: emitter,
  }

  await queryController.execute(ctx)

  try {
    return {
      response: ctx.body,
      success: ctx.status === 200,
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      response: err,
    }
  }
}
