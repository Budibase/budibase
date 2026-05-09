import {
  AutomationActionStepId,
  AutomationStatus,
  AutomationStepType,
  AutomationTriggerStepId,
  LoopStepType,
  type Automation,
  type AutomationLog,
  type AutomationStep,
  type AutomationStepResultOutputs,
  type AutomationTrigger,
  type BlockDefinitions,
  type BranchStep,
  type LoopV2Step,
  type ServerLogStep,
} from "@budibase/types"

export const automationSchema = {
  inputs: {
    required: [],
    properties: {},
  },
  outputs: {
    required: [],
    properties: {},
  },
}

export const automationTrigger: AutomationTrigger = {
  id: "trigger",
  stepId: AutomationTriggerStepId.APP,
  type: AutomationStepType.TRIGGER,
  name: "App trigger",
  tagline: "",
  icon: "",
  description: "",
  inputs: {},
  schema: automationSchema,
}

export const serverLogStep = (id: string): ServerLogStep => ({
  id,
  stepId: AutomationActionStepId.SERVER_LOG,
  type: AutomationStepType.ACTION,
  name: "Server log",
  tagline: "",
  icon: "",
  description: "",
  inputs: {
    text: "Log",
  },
  schema: automationSchema,
})

export const branchStep = (children: AutomationStep[] = []): BranchStep => ({
  id: "branch",
  stepId: AutomationActionStepId.BRANCH,
  type: AutomationStepType.LOGIC,
  name: "Branch",
  tagline: "",
  icon: "",
  description: "",
  inputs: {
    branches: [
      {
        id: "matched",
        name: "Matched",
        condition: {},
      },
      {
        id: "fallback",
        name: "Fallback",
        condition: {},
      },
    ],
    children: {
      matched: children,
      fallback: [],
    },
  },
  schema: automationSchema,
})

export const loopStep = (children: AutomationStep[] = []): LoopV2Step => ({
  id: "loop",
  stepId: AutomationActionStepId.LOOP_V2,
  type: AutomationStepType.LOGIC,
  name: "Loop",
  tagline: "",
  icon: "",
  description: "",
  inputs: {
    option: LoopStepType.ARRAY,
    binding: "[1,2]",
    children,
  },
  schema: automationSchema,
})

export const automationBlockDefinitions: BlockDefinitions = {
  TRIGGER: {},
  CREATABLE_TRIGGER: {},
  ACTION: {
    [AutomationActionStepId.LOOP_V2]: loopStep(),
    [AutomationActionStepId.BRANCH]: branchStep(),
  },
}

export const nestedLoopBranchAutomation = () => {
  const branchChild = serverLogStep("branch-child")
  const branch = branchStep([branchChild])
  const loop = loopStep([branch])
  const automation: Automation = {
    name: "Automation",
    appId: "app",
    type: "automation",
    definition: {
      trigger: automationTrigger,
      steps: [loop],
    },
  }

  return {
    automation,
    branch,
    branchChild,
    loop,
  }
}

export const automationLog = (
  loopOutputs: AutomationStepResultOutputs & Record<string, any> = {
    success: true,
    iterations: 2,
  }
): AutomationLog => ({
  _id: "log",
  automationName: "Automation",
  status: AutomationStatus.SUCCESS,
  trigger: {
    id: "trigger",
    stepId: AutomationTriggerStepId.APP,
    outputs: {},
  },
  steps: [
    {
      id: "trigger",
      stepId: AutomationTriggerStepId.APP,
      outputs: {},
    },
    {
      id: "loop",
      stepId: AutomationActionStepId.LOOP_V2,
      inputs: {
        option: LoopStepType.ARRAY,
        binding: "[1,2]",
      },
      outputs: loopOutputs,
    },
  ],
})
