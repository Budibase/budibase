import { writable, get } from "svelte/store"
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
      state.automations.sort((a, b) => {
        return a.name < b.name ? -1 : 1
      })
      state.blockDefinitions = {
        TRIGGER: responses[1].trigger,
        ACTION: responses[1].action,
      }
      return state
    })
  },
  create: async (name, trigger) => {
    const automation = {
      name,
      type: "automation",
      definition: {
        steps: [],
        trigger,
      },
    }
    const response = await store.actions.save(automation)
    await store.actions.fetch()
    store.actions.select(response._id)
    return response
  },
  duplicate: async automation => {
    const response = await store.actions.save({
      ...automation,
      name: `${automation.name} - copy`,
      _id: undefined,
      _ref: undefined,
    })
    await store.actions.fetch()
    store.actions.select(response._id)
    return response
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
      // Remove the automation
      state.automations = state.automations.filter(
        x => x._id !== automation._id
      )
      // Select a new automation if required
      if (automation._id === state.selectedAutomationId) {
        store.actions.select(state.automations[0]?._id)
      }
      return state
    })
    await store.actions.fetch()
  },
  updateBlockInputs: async (block, data) => {
    // Create new modified block
    let newBlock = {
      ...block,
      inputs: {
        ...block.inputs,
        ...data,
      },
    }

    // Remove any nullish or empty string values
    Object.keys(newBlock.inputs).forEach(key => {
      const val = newBlock.inputs[key]
      if (val == null || val === "") {
        delete newBlock.inputs[key]
      }
    })

    // Create new modified automation
    const automation = get(selectedAutomation)
    const newAutomation = store.actions.getUpdatedDefinition(
      automation,
      newBlock
    )

    // Don't save if no changes were made
    if (JSON.stringify(newAutomation) === JSON.stringify(automation)) {
      return
    }
    await store.actions.save(newAutomation)
  },
  test: async (automation, testData) => {
    const result = await API.testAutomation({
      automationId: automation?._id,
      testData,
    })
    if (!result?.trigger && !result?.steps?.length) {
      if (result?.err?.code === "usage_limit_exceeded") {
        throw "You have exceeded your automation quota"
      }
      throw "Something went wrong testing your automation"
    }
    store.update(state => {
      state.testResults = result
      return state
    })
  },
  getDefinition: id => {
    return get(store).automations?.find(x => x._id === id)
  },
  getUpdatedDefinition: (automation, block) => {
    let newAutomation = cloneDeep(automation)
    if (automation.definition.trigger?.id === block.id) {
      newAutomation.definition.trigger = block
    } else {
      const idx = automation.definition.steps.findIndex(x => x.id === block.id)
      newAutomation.definition.steps.splice(idx, 1, block)
    }
    return newAutomation
  },
  select: id => {
    if (!id || id === get(store).selectedAutomationId) {
      return
    }
    store.update(state => {
      state.selectedAutomationId = id
      state.testResults = null
      state.showTestPanel = false
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
  addTestDataToAutomation: async data => {
    let newAutomation = cloneDeep(get(selectedAutomation))
    newAutomation.testData = {
      ...newAutomation.testData,
      ...data,
    }
    await store.actions.save(newAutomation)
  },
  constructBlock(type, stepId, blockDefinition) {
    return {
      ...blockDefinition,
      inputs: blockDefinition.inputs || {},
      stepId,
      type,
      id: generate(),
    }
  },
  addBlockToAutomation: async (block, blockIdx) => {
    const automation = get(selectedAutomation)
    let newAutomation = cloneDeep(automation)
    if (!automation) {
      return
    }
    newAutomation.definition.steps.splice(blockIdx, 0, block)
    await store.actions.save(newAutomation)
  },
  deleteAutomationBlock: async block => {
    const automation = get(selectedAutomation)
    let newAutomation = cloneDeep(automation)

    // Delete trigger if required
    if (newAutomation.definition.trigger?.id === block.id) {
      delete newAutomation.definition.trigger
    } else {
      // Otherwise remove step
      newAutomation.definition.steps = newAutomation.definition.steps.filter(
        step => step.id !== block.id
      )
    }
    await store.actions.save(newAutomation)
  },
  replace: async (automationId, automation) => {
    if (!automation) {
      store.update(state => {
        // Remove the automation
        state.automations = state.automations.filter(
          x => x._id !== automationId
        )
        // Select a new automation if required
        if (automationId === state.selectedAutomationId) {
          store.actions.select(state.automations[0]?._id)
        }
        return state
      })
    } else {
      const index = get(store).automations.findIndex(
        x => x._id === automation._id
      )
      if (index === -1) {
        // Automation addition
        store.update(state => ({
          ...state,
          automations: [...state.automations, automation],
        }))
      } else {
        // Automation update
        store.update(state => {
          state.automations[index] = automation
          return state
        })
      }
    }
  },
})
