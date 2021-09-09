const scriptController = require("../../api/controllers/script")
const { buildCtx } = require("./utils")

exports.definition = {
  name: "JS Scripting",
  tagline: "Execute JavaScript Code",
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
        value: {
          type: "string",
          description: "The result of the return statement",
        },
        success: {
          type: "boolean",
          description: "Whether the action was successful",
        },
      },
    },
    required: ["success"],
  },
}

exports.run = async function ({ inputs, appId, context, emitter }) {
  if (inputs.code == null) {
    return {
      success: false,
      response: {
        message: "Invalid inputs",
      },
    }
  }

  const ctx = buildCtx(appId, emitter, {
    body: {
      script: inputs.code,
      context,
    },
  })

  try {
    await scriptController.execute(ctx)
    return {
      success: true,
      value: ctx.body,
    }
  } catch (err) {
    return {
      success: false,
      response: err,
    }
  }
}
