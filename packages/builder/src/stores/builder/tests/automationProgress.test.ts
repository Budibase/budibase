import { get } from "svelte/store"
import { automationStore } from "../automations"
import {
  AutomationActionStepId,
  AutomationTriggerStepId,
} from "@budibase/types"

const automation: any = {
  _id: "auto1",
  name: "Auto",
  definition: {
    trigger: {
      id: "trigger1",
      stepId: AutomationTriggerStepId.APP,
      inputs: {},
      schema: {
        outputs: {
          required: [],
          properties: {},
        },
      },
    },
    steps: [],
  },
}

describe("automation test progress handling", () => {
  beforeEach(() => {
    automationStore.update(state => {
      state.automations = [automation]
      state.selectedAutomationId = automation._id
      state.testProgress = {}
      state.inProgressTest = undefined
      state.testResults = undefined
      return state
    })
  })

  afterEach(() => {
    automationStore.update(state => {
      state.automations = []
      state.selectedAutomationId = null
      state.testProgress = {}
      state.inProgressTest = undefined
      state.testResults = undefined
      return state
    })
  })

  it("marks a step as running", () => {
    automationStore.actions.handleTestProgress({
      automationId: automation._id,
      blockId: "step1",
      stepId: AutomationActionStepId.SERVER_LOG,
      status: "running",
      occurredAt: Date.now(),
    } as any)

    const state = get(automationStore)
    expect(state.testProgress?.["step1"]?.status).toEqual("running")
  })

  it("stores completion results and clears in-progress state", () => {
    const result: any = {
      status: "success",
      trigger: {},
      steps: [],
    }
    automationStore.actions.handleTestProgress({
      automationId: automation._id,
      status: "complete",
      occurredAt: Date.now(),
      result,
    } as any)

    const state = get(automationStore)
    expect(state.testResults).toBe(result)
    expect(state.inProgressTest).toBeUndefined()
    expect(state.testProgress).toEqual({})
  })
})
