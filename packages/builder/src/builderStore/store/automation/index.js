import { writable } from "svelte/store"
import { API } from "api"
import Automation from "./Automation"
import { cloneDeep } from "lodash/fp"

const initialAutomationState = {
  automations: [],
  showTestPanel: false,
  blockDefinitions: {
    TRIGGER: [],
    ACTION: [],
  },
  selectedAutomation: null,
}

export const getAutomationStore = () => {
  const store = writable(initialAutomationState)
  store.actions = automationActions(store)
  return store
}

const automationActions = store => ({
  definitions: async () => {
    const response = await API.getAutomationDefinitions()
    store.update(state => {
      state.blockDefinitions = {
        TRIGGER: response.trigger,
        ACTION: response.action,
      }
      return state
    })
    return response
  },
  fetch: async () => {
    const responses = await Promise.all([
      API.getAutomations(),
      API.getAutomationDefinitions(),
    ])
    store.update(state => {
      let selected = state.selectedAutomation?.automation
      state.automations = responses[0]
      state.blockDefinitions = {
        TRIGGER: responses[1].trigger,
        ACTION: responses[1].action,
      }
      // If previously selected find the new obj and select it
      if (selected) {
        selected = responses[0].filter(
          automation => automation._id === selected._id
        )
        state.selectedAutomation = new Automation(selected[0])
      }
      return state
    })
  },
  create: async ({ name }) => {
    const automation = {
      name,
      type: "automation",
      definition: {
        steps: [],
      },
    }
    const response = await API.createAutomation(automation)
    store.update(state => {
      state.automations = [...state.automations, response.automation]
      store.actions.select(response.automation)
      return state
    })
  },
  duplicate: async automation => {
    const response = await API.createAutomation({
      ...automation,
      name: `${automation.name} - copy`,
      _id: undefined,
      _ref: undefined,
    })
    store.update(state => {
      state.automations = [...state.automations, response.automation]
      store.actions.select(response.automation)
      return state
    })
  },
  save: async automation => {
    const response = await API.updateAutomation(automation)
    store.update(state => {
      const updatedAutomation = response.automation
      const existingIdx = state.automations.findIndex(
        existing => existing._id === automation._id
      )
      if (existingIdx !== -1) {
        state.automations.splice(existingIdx, 1, updatedAutomation)
        state.automations = [...state.automations]
        store.actions.select(updatedAutomation)
        return state
      }
    })
  },
  delete: async automation => {
    await API.deleteAutomation({
      automationId: automation?._id,
      automationRev: automation?._rev,
    })
    store.update(state => {
      const existingIdx = state.automations.findIndex(
        existing => existing._id === automation?._id
      )
      state.automations.splice(existingIdx, 1)
      state.automations = [...state.automations]
      state.selectedAutomation = null
      state.selectedBlock = null
      return state
    })
  },
  test: async (automation, testData) => {
    store.update(state => {
      state.selectedAutomation.testResults = null
      return state
    })
    const result = await API.testAutomation({
      automationId: automation?._id,
      testData,
    })
    store.update(state => {
      state.selectedAutomation.testResults = result
      return state
    })
  },
  select: automation => {
    store.update(state => {
      state.selectedAutomation = new Automation(cloneDeep(automation))
      state.selectedBlock = null
      return state
    })
  },
  getLogs: async ({ automationId, startDate, status, page } = {}) => {
    return await API.getAutomationLogs({
      automationId,
      startDate,
      status,
      page,
    })
  },
  clearLogErrors: async ({ automationId, appId } = {}) => {
    return await API.clearAutomationLogErrors({
      automationId,
      appId,
    })
  },
  addTestDataToAutomation: data => {
    store.update(state => {
      state.selectedAutomation.addTestData(data)
      return state
    })
  },
  addBlockToAutomation: (block, blockIdx) => {
    store.update(state => {
      state.selectedBlock = state.selectedAutomation.addBlock(
        cloneDeep(block),
        blockIdx
      )
      return state
    })
  },
  toggleFieldControl: value => {
    store.update(state => {
      state.selectedBlock.rowControl = value
      return state
    })
  },
  deleteAutomationBlock: block => {
    store.update(state => {
      const idx =
        state.selectedAutomation.automation.definition.steps.findIndex(
          x => x.id === block.id
        )
      state.selectedAutomation.deleteBlock(block.id)

      // Select next closest step
      const steps = state.selectedAutomation.automation.definition.steps
      let nextSelectedBlock
      if (steps[idx] != null) {
        nextSelectedBlock = steps[idx]
      } else if (steps[idx - 1] != null) {
        nextSelectedBlock = steps[idx - 1]
      } else {
        nextSelectedBlock =
          state.selectedAutomation.automation.definition.trigger || null
      }
      state.selectedBlock = nextSelectedBlock
      return state
    })
  },
})
