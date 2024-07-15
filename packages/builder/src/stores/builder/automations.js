import { writable, get, derived } from "svelte/store"
import { API } from "api"
import { cloneDeep } from "lodash/fp"
import { generate } from "shortid"
import { createHistoryStore } from "stores/builder/history"
import { notifications } from "@budibase/bbui"
import { updateReferencesInObject } from "dataBinding"

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

// If this functions, remove the actions elements
export const createAutomationStore = () => {
  const store = writable(initialAutomationState)

  store.actions = automationActions(store)

  // Setup history for automations
  const history = createHistoryStore({
    getDoc: store.actions.getDefinition,
    selectDoc: store.actions.select,
  })

  store.actions.save = history.wrapSaveDoc(store.actions.save)
  store.actions.delete = history.wrapDeleteDoc(store.actions.delete)
  return { store, history }
}

const updateStepReferences = (steps, modifiedIndex, action) => {
  steps.forEach(step => {
    updateReferencesInObject({
      obj: step.inputs,
      modifiedIndex,
      action,
      label: "steps",
    })
  })
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
      disabled: false,
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
  toggleDisabled: async automationId => {
    let automation
    try {
      automation = store.actions.getDefinition(automationId)
      if (!automation) {
        return
      }
      automation.disabled = !automation.disabled
      await store.actions.save(automation)
      notifications.success(
        `Automation ${
          automation.disabled ? "disabled" : "enabled"
        } successfully`
      )
    } catch (error) {
      notifications.error(
        `Error ${
          automation && automation.disabled ? "disabling" : "enabling"
        } automation`
      )
    }
  },

  processBlockInputs: async (block, data) => {
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
      return false
    }

    return newAutomation
  },
  updateBlockInputs: async (block, data) => {
    const newAutomation = await store.actions.processBlockInputs(block, data)
    if (newAutomation === false) {
      return
    }
    await store.actions.save(newAutomation)
  },
  test: async (automation, testData) => {
    let result
    try {
      result = await API.testAutomation({
        automationId: automation?._id,
        testData,
      })
    } catch (err) {
      const message = err.message || err.status || JSON.stringify(err)
      throw `Automation test failed - ${message}`
    }
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

    try {
      updateStepReferences(newAutomation.definition.steps, blockIdx, "add")
    } catch (e) {
      notifications.error("Error adding automation block")
    }
    newAutomation.definition.steps.splice(blockIdx, 0, block)
    await store.actions.save(newAutomation)
  },
  saveAutomationName: async (blockId, name) => {
    const automation = get(selectedAutomation)
    let newAutomation = cloneDeep(automation)
    if (!automation) {
      return
    }
    newAutomation.definition.stepNames = {
      ...newAutomation.definition.stepNames,
      [blockId]: name.trim(),
    }

    await store.actions.save(newAutomation)
  },
  deleteAutomationName: async blockId => {
    const automation = get(selectedAutomation)
    let newAutomation = cloneDeep(automation)
    if (!automation) {
      return
    }
    delete newAutomation.definition.stepNames[blockId]

    await store.actions.save(newAutomation)
  },

  deleteAutomationBlock: async (block, blockIdx) => {
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
      delete newAutomation.definition.stepNames?.[block.id]
    }
    try {
      updateStepReferences(newAutomation.definition.steps, blockIdx, "delete")
    } catch (e) {
      notifications.error("Error deleting automation block")
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

const automations = createAutomationStore()

export const automationStore = automations.store

export const automationHistoryStore = automations.history

// Derived automation state
export const selectedAutomation = derived(automationStore, $automationStore => {
  if (!$automationStore.selectedAutomationId) {
    return null
  }
  return $automationStore.automations?.find(
    x => x._id === $automationStore.selectedAutomationId
  )
})
