let { wait } = require("../../utilities")

exports.definition = {
  name: "Delay",
  icon: "Clock",
  tagline: "Delay for {{inputs.time}} milliseconds",
  description: "Delay the automation until an amount of time has passed",
  stepId: "DELAY",
  internal: true,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        time: {
          type: "number",
          title: "Delay in milliseconds",
        },
      },
      required: ["time"],
    },
    outputs: {
      properties: {
        success: {
          type: "boolean",
          description: "Whether the delay was successful",
        },
      },
      required: ["success"],
    },
  },
  type: "LOGIC",
}

exports.run = async function delay({ inputs }) {
  await wait(inputs.time)
  return {
    success: true,
  }
}
