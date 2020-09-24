import { writable } from "svelte/store"
import api from "../../api"
import Automation from "./Automation"
import { cloneDeep } from "lodash/fp"

const automationActions = store => ({
  fetch: async () => {
    const responses = await Promise.all([
      api.get(`/api/automations`),
      api.get(`/api/automations/definitions/list`),
    ])
    const jsonResponses = await Promise.all(responses.map(x => x.json()))
    store.update(state => {
      state.automations = jsonResponses[0]
      state.blockDefinitions = {
        TRIGGER: jsonResponses[1].trigger,
        ACTION: jsonResponses[1].action,
        LOGIC: jsonResponses[1].logic,
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
    const CREATE_AUTOMATION_URL = `/api/automations`
    const response = await api.post(CREATE_AUTOMATION_URL, automation)
    const json = await response.json()
    store.update(state => {
      state.automations = [...state.automations, json.automation]
      store.actions.select(json.automation)
      return state
    })
  },
  save: async ({ automation }) => {
    const UPDATE_AUTOMATION_URL = `/api/automations`
    const response = await api.put(UPDATE_AUTOMATION_URL, automation)
    const json = await response.json()
    store.update(state => {
      const existingIdx = state.automations.findIndex(
        existing => existing._id === automation._id
      )
      state.automations.splice(existingIdx, 1, json.automation)
      state.automations = state.automations
      store.actions.select(json.automation)
      return state
    })
  },
  delete: async ({ automation }) => {
    const { _id, _rev } = automation
    const DELETE_AUTOMATION_URL = `/api/automations/${_id}/${_rev}`
    await api.delete(DELETE_AUTOMATION_URL)

    store.update(state => {
      const existingIdx = state.automations.findIndex(
        existing => existing._id === _id
      )
      state.automations.splice(existingIdx, 1)
      state.automations = state.automations
      state.selectedAutomation = null
      state.selectedBlock = null
      return state
    })
  },
  trigger: async ({ automation }) => {
    const { _id } = automation
    const TRIGGER_AUTOMATION_URL = `/api/automations/${_id}/trigger`
    return await api.post(TRIGGER_AUTOMATION_URL)
  },
  select: automation => {
    store.update(state => {
      state.selectedAutomation = new Automation(cloneDeep(automation))
      state.selectedBlock = null
      return state
    })
  },
  addBlockToAutomation: block => {
    store.update(state => {
      const newBlock = state.selectedAutomation.addBlock(cloneDeep(block))
      state.selectedBlock = newBlock
      return state
    })
  },
  deleteAutomationBlock: block => {
    store.update(state => {
      const idx = state.selectedAutomation.automation.definition.steps.findIndex(
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

export const getAutomationStore = () => {
  const INITIAL_AUTOMATION_STATE = {
    automations: [],
    blockDefinitions: {
      TRIGGER: [],
      ACTION: [],
      LOGIC: [],
    },
    selectedAutomation: null,
  }
  const store = writable(INITIAL_AUTOMATION_STATE)
  store.actions = automationActions(store)
  return store
}
