import { AutomationActionStepId, AutomationStepSchema } from "@budibase/types"

export const definition: AutomationStepSchema = {
  name: "Looping",
  icon: "Reuse",
  tagline: "Loop the block",
  description: "Loop",
  stepId: AutomationActionStepId.LOOP,
  internal: true,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        option: {
          customType: "loopOption",
          title: "Input type",
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
        items: {
          customType: "item",
          description: "The item currently being executed",
        },
        success: {
          type: "boolean",
          description: "Whether the message loop was successfully",
        },
        iterations: {
          type: "number",
          descriptions: "The amount of times the block ran",
        },
      },
      required: ["success", "items", "iterations"],
    },
  },
  type: "LOGIC",
}
