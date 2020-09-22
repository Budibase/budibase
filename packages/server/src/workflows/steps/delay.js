const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports.definition = {
  name: "Delay",
  icon: "ri-time-fill",
  tagline: "Delay for {{inputs.time}} milliseconds",
  description: "Delay the workflow until an amount of time has passed",
  stepId: "DELAY",
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
  },
  type: "LOGIC",
}

module.exports.run = async function delay({ inputs }) {
  await wait(inputs.time)
}
