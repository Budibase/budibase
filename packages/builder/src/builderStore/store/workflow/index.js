import { writable } from "svelte/store"
import api from "../../api"
import Workflow from "./Workflow"
import { cloneDeep } from "lodash/fp"

const workflowActions = store => ({
  fetch: async () => {
    const responses = await Promise.all([
      api.get(`/api/workflows`),
      api.get(`/api/workflows/trigger/list`),
      api.get(`/api/workflows/action/list`),
      api.get(`/api/workflows/logic/list`),
    ])
    const jsonResponses = await Promise.all(responses.map(x => x.json()))
    store.update(state => {
      state.workflows = jsonResponses[0]
      state.blockDefinitions = {
        TRIGGER: jsonResponses[1],
        ACTION: jsonResponses[2],
        LOGIC: jsonResponses[3],
      }
      return state
    })
  },
  create: async ({ name }) => {
    const workflow = {
      name,
      definition: {
        steps: [],
      },
    }
    const CREATE_WORKFLOW_URL = `/api/workflows`
    const response = await api.post(CREATE_WORKFLOW_URL, workflow)
    const json = await response.json()
    store.update(state => {
      state.workflows = [...state.workflows, json.workflow]
      store.actions.select(json.workflow)
      return state
    })
  },
  save: async ({ workflow }) => {
    const UPDATE_WORKFLOW_URL = `/api/workflows`
    const response = await api.put(UPDATE_WORKFLOW_URL, workflow)
    const json = await response.json()
    store.update(state => {
      const existingIdx = state.workflows.findIndex(
        existing => existing._id === workflow._id
      )
      state.workflows.splice(existingIdx, 1, json.workflow)
      state.workflows = state.workflows
      store.actions.select(json.workflow)
      return state
    })
  },
  delete: async ({ workflow }) => {
    const { _id, _rev } = workflow
    const DELETE_WORKFLOW_URL = `/api/workflows/${_id}/${_rev}`
    await api.delete(DELETE_WORKFLOW_URL)

    store.update(state => {
      const existingIdx = state.workflows.findIndex(
        existing => existing._id === _id
      )
      state.workflows.splice(existingIdx, 1)
      state.workflows = state.workflows
      state.selectedWorkflow = null
      state.selectedBlock = null
      return state
    })
  },
  trigger: async ({ workflow }) => {
    const { _id } = workflow
    const TRIGGER_WORKFLOW_URL = `/api/workflows/${_id}/trigger`
    return await api.post(TRIGGER_WORKFLOW_URL)
  },
  select: workflow => {
    store.update(state => {
      state.selectedWorkflow = new Workflow(cloneDeep(workflow))
      state.selectedBlock = null
      return state
    })
  },
  addBlockToWorkflow: block => {
    store.update(state => {
      const newBlock = state.selectedWorkflow.addBlock(block)
      state.selectedBlock = newBlock
      return state
    })
  },
  deleteWorkflowBlock: block => {
    store.update(state => {
      const idx = state.selectedWorkflow.workflow.definition.steps.findIndex(
        x => x.id === block.id
      )
      state.selectedWorkflow.deleteBlock(block.id)

      // Select next closest step
      const steps = state.selectedWorkflow.workflow.definition.steps
      let nextSelectedBlock
      if (steps[idx] != null) {
        nextSelectedBlock = steps[idx]
      } else if (steps[idx - 1] != null) {
        nextSelectedBlock = steps[idx - 1]
      } else {
        nextSelectedBlock =
          state.selectedWorkflow.workflow.definition.trigger || null
      }
      state.selectedBlock = nextSelectedBlock
      return state
    })
  },
})

export const getWorkflowStore = () => {
  const INITIAL_WORKFLOW_STATE = {
    workflows: [],
    blockDefinitions: {
      TRIGGER: [],
      ACTION: [],
      LOGIC: [],
    },
    selectedWorkflow: null,
  }
  const store = writable(INITIAL_WORKFLOW_STATE)
  store.actions = workflowActions(store)
  return store
}
