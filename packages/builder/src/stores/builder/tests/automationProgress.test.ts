import { beforeEach, afterEach, describe, it, vi } from "vitest"
import { get, writable } from "svelte/store"
import { API } from "@/api"
import { automationStore } from "../automations"
import {
  type Automation,
  AutomationActionStepId,
  AutomationTriggerStepId,
  AutomationStatus,
  type AutomationResults,
  AutomationStepType,
} from "@budibase/types"
import { type AutomationTestProgressEvent } from "@budibase/types"

vi.mock("@/stores/builder", () => {
  return {
    appStore: writable({}),
    deploymentStore: writable({}),
    permissions: writable({}),
    tables: writable({ list: [] }),
    workspaceDeploymentStore: writable({ automations: {} }),
  }
})

vi.mock("@/api", () => {
  return {
    API: {
      testAutomation: vi.fn(),
    },
  }
})

const automation: Automation = {
  _id: "auto1",
  name: "Auto",
  appId: "app1",
  definition: {
    trigger: {
      id: "trigger1",
      stepId: AutomationTriggerStepId.APP,
      type: AutomationStepType.TRIGGER,
      name: "App trigger",
      tagline: "",
      icon: "",
      description: "",
      inputs: {},
      schema: {
        inputs: {
          required: [],
          properties: {},
        },
        outputs: {
          required: [],
          properties: {},
        },
      },
    },
    steps: [],
  },
}

const testAutomationResponse: AutomationResults = {
  status: AutomationStatus.SUCCESS,
  trigger: {
    id: "trigger1",
    stepId: AutomationTriggerStepId.APP,
    outputs: {},
  },
  steps: [
    {
      id: "trigger1",
      stepId: AutomationTriggerStepId.APP,
      outputs: {},
    },
  ],
}

describe("automation test progress handling", () => {
  beforeEach(() => {
    vi.mocked(API.testAutomation).mockResolvedValue(testAutomationResponse)
    automationStore.update(state => {
      state.automations = [automation]
      state.selectedAutomationId = automation._id!
      state.testProgress = {}
      state.inProgressTest = undefined
      state.testResults = undefined
      state.selectedNodeId = undefined
      state.selectedBranchNode = undefined
      return state
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    automationStore.update(state => {
      state.automations = []
      state.selectedAutomationId = null
      state.testProgress = {}
      state.inProgressTest = undefined
      state.testResults = undefined
      state.selectedNodeId = undefined
      state.selectedBranchNode = undefined
      return state
    })
  })

  it("marks a step as running", () => {
    const event: AutomationTestProgressEvent = {
      automationId: automation._id!,
      blockId: "step1",
      stepId: AutomationActionStepId.SERVER_LOG,
      status: "running",
      occurredAt: Date.now(),
    }
    automationStore.actions.handleTestProgress(event)

    const state = get(automationStore)
    expect(state.testProgress?.["step1"]?.status).toEqual("running")
  })

  it("preserves loop iteration metadata on running events", () => {
    const event: AutomationTestProgressEvent = {
      automationId: automation._id!,
      blockId: "step1",
      stepId: AutomationActionStepId.SERVER_LOG,
      status: "running",
      occurredAt: Date.now(),
      loop: { current: 2, total: 5 },
    }
    automationStore.actions.handleTestProgress(event)

    const state = get(automationStore)
    expect(state.testProgress?.["step1"]?.loop).toEqual({
      current: 2,
      total: 5,
    })
  })

  it("stores completion results and clears in-progress state", () => {
    const triggerResult = {
      id: "trigger1",
      stepId: AutomationTriggerStepId.APP,
      outputs: {},
    }
    const result: AutomationResults = {
      status: AutomationStatus.SUCCESS,
      trigger: triggerResult,
      steps: [triggerResult],
    }
    const event: AutomationTestProgressEvent = {
      automationId: automation._id!,
      status: "complete",
      occurredAt: Date.now(),
      result,
    }
    automationStore.actions.handleTestProgress(event)

    const state = get(automationStore)
    expect(state.testResults).toBe(result)
    expect(state.inProgressTest).toBeUndefined()
    expect(state.testProgress).toEqual({})
  })

  it("clears selected nodes when starting a test run", async () => {
    automationStore.update(state => {
      state.selectedNodeId = "step1"
      state.selectedBranchNode = {
        nodeId: "branch-step1-0-branch1",
        stepId: "step1",
        branchIdx: 0,
      }
      return state
    })

    await automationStore.actions.test(automation, {})

    const state = get(automationStore)
    expect(state.selectedNodeId).toBeUndefined()
    expect(state.selectedBranchNode).toBeUndefined()
  })
})
