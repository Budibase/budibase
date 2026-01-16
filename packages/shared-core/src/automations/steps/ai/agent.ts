import {
  AutomationActionStepId,
  AutomationCustomIOType,
  AutomationFeature,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "Agent",
  icon: "Effect",
  tagline: "Run an AI agent with tools",
  description:
    "Execute a pre-configured AI agent that can use tools to accomplish tasks",
  stepId: AutomationActionStepId.AGENT,
  internal: true,
  inputs: {},
  features: {
    [AutomationFeature.LOOPING]: true,
  },
  schema: {
    inputs: {
      properties: {
        agentId: {
          customType: AutomationCustomIOType.AGENT,
          title: "Agent",
          description: "Select the agent to run",
        },
        prompt: {
          type: AutomationIOType.LONGFORM,
          title: "Prompt",
          description: "The task or question to send to the agent",
        },
        useStructuredOutput: {
          type: AutomationIOType.BOOLEAN,
          title: "Use structured output",
          description:
            "Constrain the agent response to a specific JSON structure",
        },
        outputSchema: {
          type: AutomationIOType.OBJECT,
          customType: AutomationCustomIOType.OUTPUT_SCHEMA,
          title: "Output Schema",
          description: "Define the structure of the agent's output",
          dependsOn: "useStructuredOutput",
        },
      },
      required: ["agentId", "prompt"],
    },
    outputs: {
      properties: {
        response: {
          type: AutomationIOType.STRING,
          description: "The agent's response",
        },
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the agent completed successfully",
        },
        steps: {
          type: AutomationIOType.ARRAY,
          description: "The steps taken by the agent",
        },
        output: {
          type: AutomationIOType.OBJECT,
          description:
            "Structured output from the agent (when output schema is defined)",
        },
      },
      required: ["response", "success"],
    },
  },
  type: AutomationStepType.ACTION,
}
