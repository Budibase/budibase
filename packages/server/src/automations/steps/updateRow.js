const rowController = require("../../api/controllers/row")
const automationUtils = require("../automationUtils")

exports.definition = {
  name: "Update Row",
  tagline: "Update a {{inputs.enriched.table.name}} row",
  icon: "ri-refresh-line",
  description: "Update a row in your database",
  type: "ACTION",
  internal: true,
  stepId: "UPDATE_ROW",
  inputs: {},
  schema: {
    inputs: {
      properties: {
        row: {
          type: "object",
          customType: "row",
          title: "Table",
        },
        rowId: {
          type: "string",
          title: "Row ID",
        },
      },
      required: ["row", "rowId"],
    },
    outputs: {
      properties: {
        row: {
          type: "object",
          customType: "row",
          description: "The updated row",
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
          description: "The identifier of the updated row",
        },
        revision: {
          type: "string",
          description: "The revision of the updated row",
        },
      },
      required: ["success", "id", "revision"],
    },
  },
}

exports.run = async function ({ inputs, appId, emitter }) {
  if (inputs.rowId == null || inputs.row == null) {
    return {
      success: false,
      response: {
        message: "Invalid inputs",
      },
    }
  }

  // clear any falsy properties so that they aren't updated
  for (let propKey of Object.keys(inputs.row)) {
    if (!inputs.row[propKey] || inputs.row[propKey] === "") {
      delete inputs.row[propKey]
    }
  }

  // have to clean up the row, remove the table from it
  const ctx = {
    params: {
      rowId: inputs.rowId,
    },
    request: {
      body: {
        ...inputs.row,
        _id: inputs.rowId,
      },
    },
    appId,
    eventEmitter: emitter,
  }

  try {
    inputs.row = await automationUtils.cleanUpRowById(
      appId,
      inputs.rowId,
      inputs.row
    )
    await rowController.patch(ctx)
    return {
      row: ctx.body,
      response: ctx.message,
      id: ctx.body._id,
      revision: ctx.body._rev,
      success: ctx.status === 200,
    }
  } catch (err) {
    return {
      success: false,
      response: err,
    }
  }
}
