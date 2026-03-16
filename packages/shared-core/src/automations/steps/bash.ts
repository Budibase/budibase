import {
  AutomationActionStepId,
  AutomationFeature,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "Bash Scripting",
  tagline: "Execute a system command",
  icon: "git-branch",
  description: "Run a command with explicit arguments",
  type: AutomationStepType.ACTION,
  internal: true,
  features: {
    [AutomationFeature.LOOPING]: true,
  },
  stepId: AutomationActionStepId.EXECUTE_BASH,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        command: {
          type: AutomationIOType.STRING,
          title: "Command",
          description:
            "The executable to run. Bindings are not supported in this field.",
        },
        args: {
          type: AutomationIOType.JSON,
          title: "Arguments",
          description:
            "A JSON array of string arguments. Bindings are supported in each string item.",
        },
      },
      required: ["command"],
    },
    outputs: {
      properties: {
        stdout: {
          type: AutomationIOType.STRING,
          description: "Standard output of the executed command",
        },
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the command was successful",
        },
      },
      required: ["stdout"],
    },
  },
}
