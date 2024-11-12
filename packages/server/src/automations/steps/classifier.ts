import {
  AutomationActionStepId,
  AutomationStepDefinition,
  AutomationStepType,
  AutomationIOType,
  ClassifierStepInputs,
  ClassifierStepOutputs,
} from "@budibase/types"
import * as automationUtils from "../automationUtils"
import fetch from "node-fetch"

export const definition: AutomationStepDefinition = {
  name: "Bug Classifier",
  tagline: "Query your knowlege base",
  icon: "Bug",
  description: "Query your knowlege base",
  type: AutomationStepType.ACTION,
  internal: true,
  features: {},
  stepId: AutomationActionStepId.CLASSIFIER,
  inputs: {
    prompt: "",
  },
  schema: {
    inputs: {
      properties: {
        prompt: {
          type: AutomationIOType.STRING,
          title: "Prompt",
        },
      },
      required: ["prompt", "model"],
    },
    outputs: {
      properties: {
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the action was successful",
        },
        response: {
          type: AutomationIOType.STRING,
          description: "What was output",
        },
        items: {
          type: AutomationIOType.ARRAY,
          description: "An array of classifers",
        },
      },
      required: ["success", "response", "items"],
    },
  },
}

export async function run({
  inputs,
}: {
  inputs: ClassifierStepInputs
}): Promise<ClassifierStepOutputs> {
  if (inputs.prompt == null) {
    return {
      success: false,
      response: "Classifier Failed: No prompt supplied",
    }
  }

  try {
    let response

    return {
      response: "",
      success: true,
      items: ["alpha", "beta", "gamma"],
    }
  } catch (err) {
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
