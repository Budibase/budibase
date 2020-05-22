import { writable } from "svelte/store"
import api from "../api"

const workflowActions = store => ({
  fetch: async instanceId => {
    const WORKFLOWS_URL = `/api/${instanceId}/workflows`;
    const workflowResponse = await api.get(WORKFLOWS_URL);
    const json = await workflowResponse.json();
    store.update(state => {
      state.workflows = json
      return state
    })
  },
  create: async ({ instanceId, name }) => {
    const workflow = { name }
    const CREATE_WORKFLOW_URL = `/api/${instanceId}/workflows`;
    const response = await api.post(CREATE_WORKFLOW_URL, workflow)
    const json = await response.json();
    store.update(state => {
      state.workflows = state.workflows.concat(json.workflow)
      state.selectedWorkflowId = json.workflow._id
      return state
    })
  },
  update: async ({ instanceId, workflow }) => {
    const UPDATE_WORKFLOW_URL = `/api/${instanceId}/workflows`;
    const response = await api.put(UPDATE_WORKFLOW_URL, workflow)
    const json = await response.json();
    store.update(state => {
      const existingIdx = state.workflows.findIndex(existing => existing._id === workflow._id);
      state.workflows.splice(existingIdx, 1, json.workflow);
      state.workflows = state.workflows
      return state
    })
  },
  select: workflow => {
    store.update(state => {
      state.selectedWorkflowId = workflow._id
      return state;
    })
  } 
});

export const getWorkflowStore = () => {
  const INITIAL_WORKFLOW_STATE = {
    workflows: []
  }

  const store = writable(INITIAL_WORKFLOW_STATE)

  store.actions = workflowActions(store);

  return store
}