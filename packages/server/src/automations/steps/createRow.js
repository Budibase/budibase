const rowController = require("../../api/controllers/row")
const automationUtils = require("../automationUtils")
const env = require("../../environment")
const usage = require("../../utilities/usageQuota")

module.exports.definition = {
  name: "Create Row",
  tagline: "Create a {{inputs.enriched.table.name}} row",
  icon: "ri-save-3-line",
  description: "Add a row to your database",
  type: "ACTION",
  stepId: "CREATE_ROW",
  inputs: {},
  schema: {
    inputs: {
      properties: {
        row: {
          type: "object",
          properties: {
            tableId: {
              type: "string",
              customType: "table",
            },
          },
          customType: "row",
          title: "Table",
          required: ["tableId"],
        },
      },
      required: ["row"],
    },
    outputs: {
      properties: {
        row: {
          type: "object",
          customType: "row",
          description: "The new row",
        },
        response: {
          type: "object",
          description: "The response from the table",
        },
        success: {
          type: "boolean",
          description: "Whether the action was successful",
        },
        id: {
          type: "string",
          description: "The identifier of the new row",
        },
        revision: {
          type: "string",
          description: "The revision of the new row",
        },
      },
      required: ["success", "id", "revision"],
    },
  },
}

module.exports.run = async function({ inputs, appId, apiKey }) {
  // TODO: better logging of when actions are missed due to missing parameters
  if (inputs.row == null || inputs.row.tableId == null) {
    return
  }
  inputs.row = await automationUtils.cleanUpRow(
    appId,
    inputs.row.tableId,
    inputs.row
  )
  // have to clean up the row, remove the table from it
  const ctx = {
    params: {
      tableId: inputs.row.tableId,
    },
    request: {
      body: inputs.row,
    },
    user: { appId },
  }

  try {
    if (env.CLOUD) {
      await usage.update(apiKey, usage.Properties.ROW, 1)
    }
    await rowController.save(ctx)
    return {
      row: inputs.row,
      response: ctx.body,
      id: ctx.body._id,
      revision: ctx.body._rev,
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
