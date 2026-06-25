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
  type MergeStep,
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

interface BranchStepOptions {
  id?: string
  branches?: Array<{
    id: string
    name: string
    children?: AutomationStep[]
  }>
}

export const branchStep = (
  children: AutomationStep[] = [],
  options: BranchStepOptions = {}
): BranchStep => {
  const branches = options.branches || [
    {
      id: "matched",
      name: "Matched",
      children,
    },
    {
      id: "fallback",
      name: "Fallback",
      children: [],
    },
  ]

  return {
    id: options.id || "branch",
    stepId: AutomationActionStepId.BRANCH,
    type: AutomationStepType.LOGIC,
    name: "Branch",
    tagline: "",
    icon: "",
    description: "",
    inputs: {
      branches: branches.map(branch => ({
        id: branch.id,
        name: branch.name,
        condition: {},
      })),
      children: branches.reduce<Record<string, AutomationStep[]>>(
        (acc, branch) => {
          acc[branch.id] = branch.children || []
          return acc
        },
        {}
      ),
    },
    schema: automationSchema,
  }
}

export const loopStep = (
  children: AutomationStep[] = [],
  id = "loop"
): LoopV2Step => ({
  id,
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

export const mergeStep = (id = "merge"): MergeStep => ({
  id,
  stepId: AutomationActionStepId.MERGE,
  type: AutomationStepType.LOGIC,
  name: "Merge",
  tagline: "",
  icon: "",
  description: "",
  inputs: {},
  schema: automationSchema,
})

export const automationWithSteps = (steps: AutomationStep[]): Automation => ({
  name: "Automation",
  appId: "app",
  type: "automation",
  definition: {
    trigger: automationTrigger,
    steps,
  },
})

export const linearAutomationSteps = () => [
  serverLogStep("step-1"),
  serverLogStep("step-2"),
  serverLogStep("step-3"),
]

export const branchWithManyLanesStep = () =>
  branchStep([], {
    id: "branch-many",
    branches: [
      {
        id: "alpha",
        name: "Alpha",
        children: [serverLogStep("alpha-1"), serverLogStep("alpha-2")],
      },
      {
        id: "beta",
        name: "Beta",
        children: [],
      },
      {
        id: "gamma",
        name: "Gamma",
        children: [serverLogStep("gamma-1")],
      },
      {
        id: "delta",
        name: "Delta",
        children: [loopStep([serverLogStep("delta-loop-child")], "delta-loop")],
      },
    ],
  })

export const loopWithLinearChildrenStep = () =>
  loopStep(
    [
      serverLogStep("loop-child-1"),
      serverLogStep("loop-child-2"),
      serverLogStep("loop-child-3"),
    ],
    "linear-loop"
  )

export const loopWithBranchChildStep = () =>
  loopStep(
    [
      serverLogStep("loop-before-branch"),
      branchStep([], {
        id: "loop-branch",
        branches: [
          {
            id: "first",
            name: "First",
            children: [serverLogStep("loop-branch-first-child")],
          },
          {
            id: "second",
            name: "Second",
            children: [
              serverLogStep("loop-branch-second-child-1"),
              serverLogStep("loop-branch-second-child-2"),
            ],
          },
          {
            id: "empty",
            name: "Empty",
            children: [],
          },
        ],
      }),
      serverLogStep("loop-after-branch"),
    ],
    "loop-with-branch"
  )

export const automationBlockDefinitions: BlockDefinitions = {
  TRIGGER: {},
  CREATABLE_TRIGGER: {},
  ACTION: {
    [AutomationActionStepId.LOOP_V2]: loopStep(),
    [AutomationActionStepId.BRANCH]: branchStep(),
    [AutomationActionStepId.MERGE]: mergeStep(),
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
