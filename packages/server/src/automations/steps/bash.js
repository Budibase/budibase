const scriptController = require("../../api/controllers/script")
const { execSync } = require("child_process")
const { processStringSync } = require("@budibase/string-templates")

module.exports.definition = {
  name: "Bash Scripting",
  tagline: "Execute a bash command",
  icon: "ri-terminal-box-line",
  description: "Run a bash script",
  type: "ACTION",
  stepId: "EXECUTE_BASH",
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
        stdout: {
          type: "string",
          description: "Standard output of your bash command or script.",
        },
      },
    },
    required: ["stdout"],
  },
}

module.exports.run = async function ({ inputs, context }) {
  if (inputs.code == null) {
    return {
      stdout: "Budibase bash automation failed: Invalid inputs",
    }
  }

  try {
    const command = processStringSync(inputs.code, context)

    let stdout
    try {
      stdout = execSync(command, { timeout: 500 })
    } catch (err) {
      stdout = err.message
    }

    return {
      stdout,
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      response: err,
    }
  }
}
