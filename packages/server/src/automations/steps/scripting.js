const scriptController = require("../../api/controllers/script")
const automationUtils = require("../automationUtils")
const env = require("../../environment")

module.exports.definition = {
  name: "Scripting",
  tagline: "Execute code",
  icon: "ri-terminal-box-line",
  description: "Run a piece of JavaScript code in your automation",
  type: "ACTION",
  stepId: "EXECUTE_SCRIPT",
  inputs: {},
  schema: {
    inputs: {
      properties: {
        code: {
          type: "code",
          title: "Code",
        },
      },
      required: ["code"],
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

module.exports.run = async function({ inputs, appId, emitter }) {
  if (inputs.code == null) {
    return {
      success: false,
      response: {
        message: "Invalid inputs",
      },
    }
  }

  const ctx = {
    params: {
      tableId: inputs.row.tableId,
    },
    request: {
      body: {
        script: inputs.script,
      },
    },
    user: { appId },
    eventEmitter: emitter,
  }

  try {
    // inputs.row = await automationUtils.cleanUpRow(appId, inputs.script)
    await scriptController.execute(ctx)
    return {
      // row: inputs.row,
      response: ctx.body,
      // id: ctx.body._id,
      // revision: ctx.body._rev,
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
