const rowController = require("../../api/controllers/row")
const usage = require("../../utilities/usageQuota")
const { buildCtx } = require("./utils")
const automationUtils = require("../automationUtils")

exports.definition = {
  description: "Delete a row from your database",
  icon: "TableRowRemoveCenter",
  name: "Delete Row",
  tagline: "Delete a {{inputs.enriched.table.name}} row",
  type: "ACTION",
  stepId: "DELETE_ROW",
  internal: true,
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
          description: "Whether the deletion was successful",
        },
      },
      required: ["row", "success"],
    },
  },
}

exports.run = async function ({ inputs, appId, emitter }) {
  if (inputs.id == null || inputs.revision == null) {
    return {
      success: false,
      response: {
        message: "Invalid inputs",
      },
    }
  }

  let ctx = buildCtx(appId, emitter, {
    body: {
      _id: inputs.id,
      _rev: inputs.revision,
    },
    params: {
      tableId: inputs.tableId,
    },
  })

  try {
    await usage.update(usage.Properties.ROW, -1)
    await rowController.destroy(ctx)
    return {
      response: ctx.body,
      row: ctx.row,
      success: ctx.status === 200,
    }
  } catch (err) {
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
