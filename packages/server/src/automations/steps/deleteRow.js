const rowController = require("../../api/controllers/row")
const env = require("../../environment")
const usage = require("../../utilities/usageQuota")

module.exports.definition = {
  description: "Delete a row from your database",
  icon: "ri-delete-bin-line",
  name: "Delete Row",
  tagline: "Delete a {{inputs.enriched.table.name}} row",
  type: "ACTION",
  stepId: "DELETE_ROW",
  inputs: {},
  schema: {
    inputs: {
      properties: {
        tableId: {
          type: "string",
          customType: "table",
          title: "Table",
        },
        id: {
          type: "string",
          title: "Row ID",
        },
        revision: {
          type: "string",
          title: "Row Revision",
        },
      },
      required: ["tableId", "id", "revision"],
    },
    outputs: {
      properties: {
        row: {
          type: "object",
          customType: "row",
          description: "The deleted row",
        },
        response: {
          type: "object",
          description: "The response from the table",
        },
        success: {
          type: "boolean",
          description: "Whether the action was successful",
        },
      },
      required: ["row", "success"],
    },
  },
}

module.exports.run = async function({ inputs, appId, apiKey, emitter }) {
  if (inputs.id == null || inputs.revision == null) {
    return {
      success: false,
      response: {
        message: "Invalid inputs",
      },
    }
  }
  let ctx = {
    params: {
      tableId: inputs.tableId,
      rowId: inputs.id,
      revId: inputs.revision,
    },
    user: { appId },
    eventEmitter: emitter,
  }

  try {
    if (env.isProd()) {
      await usage.update(apiKey, usage.Properties.ROW, -1)
    }
    await rowController.destroy(ctx)
    return {
      response: ctx.body,
      row: ctx.row,
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
