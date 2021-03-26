const scriptController = require("../../api/controllers/script")

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
          type: "string",
          customType: "code",
          title: "Code",
        },
      },
      required: ["code"],
    },
    outputs: {
      properties: {
        success: {
          type: "boolean",
          description: "Whether the action was successful",
        },
      },
    },
    required: ["success"],
  },
}

module.exports.run = async function({ inputs, appId, context, emitter }) {
  if (inputs.code == null) {
    return {
      success: false,
      response: {
        message: "Invalid inputs",
      },
    }
  }

  const ctx = {
    request: {
      body: {
        script: inputs.code,
        context,
      },
    },
    user: { appId },
    eventEmitter: emitter,
  }

  try {
    await scriptController.execute(ctx)
    return {
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
