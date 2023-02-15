import { writable, get, derived } from "svelte/store"
import { API } from "api"
import { cloneDeep } from "lodash/fp"
import { generate } from "shortid"
import { selectedAutomation } from "builderStore"

const initialAutomationState = {
  automations: [],
  testResults: null,
  showTestPanel: false,
  blockDefinitions: {
    TRIGGER: [],
    ACTION: [],
  },
  selectedAutomationId: null,
  selectedBlockId: null,
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
      state.automations = responses[0]
      state.blockDefinitions = {
        TRIGGER: responses[1].trigger,
        ACTION: responses[1].action,
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
    const response = await store.actions.save(automation)
    store.update(state => {
      state.automations = [...state.automations, response.automation]
      return state
    })
    store.actions.select(response.automation)
  },
  duplicate: async automation => {
    const response = await store.actions.save({
      ...automation,
      name: `${automation.name} - copy`,
      _id: undefined,
      _ref: undefined,
    })
    store.update(state => {
      state.automations = [...state.automations, response.automation]
      return state
    })
    store.actions.select(response.automation)
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
        return state
      } else {
        state.automations = [...state.automations, updatedAutomation]
      }
      return state
    })
    return response.automation
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
      state.selectedAutomationId = state.automations[0]?._id
      state.selectedBlockId = null
      return state
    })
  },
  test: async (automation, testData) => {
    const result = await API.testAutomation({
      automationId: automation?._id,
      testData,
    })
    store.update(state => {
      state.testResults = result
      return state
    })
  },
  getDefinition: id => {
    return get(store).automations?.find(x => x._id === id)
  },
  select: id => {
    if (!id) {
      return
    }
    store.update(state => {
      state.selectedAutomationId = id
      state.selectedBlockId = null
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
    const hasTrigger = $selectedAutomation.definition.trigger

    // Make sure to add trigger if doesn't exist
    if (!this.hasTrigger() && block.type === "TRIGGER") {
      const trigger = { id: generate(), ...block }
      this.automation.definition.trigger = trigger
      return trigger
    }

    const newBlock = { id: generate(), ...block }
    this.automation.definition.steps.splice(idx, 0, newBlock)
    return newBlock

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
