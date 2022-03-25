exports.definition = {
  name: "Looping",
  icon: "Reuse",
  tagline: "Loop the block",
  description: "Loop",
  stepId: "LOOP",
  internal: true,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        option: {
          customType: "loopOption",
          title: "Whether it's an array or a string",
        },
        binding: {
          type: "string",
          title: "Binding / Value",
        },
        iterations: {
          type: "number",
          title: "Max loop iterations",
        },
        failure: {
          type: "string",
          title: "Failure Condition",
        },
      },
      required: ["type", "value", "iterations", "failure"],
    },
    outputs: {
      properties: {
        currentItem: {
          customType: "item",
          description: "the item currently being executed",
        },
      },
      required: ["success"],
    },
  },
  type: "LOGIC",
}

exports.run = async function filter({ inputs }) {
  let currentItem = inputs.binding
  return { currentItem }
}
