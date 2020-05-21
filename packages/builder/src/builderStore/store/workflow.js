import { writable } from "svelte/store"
import api from "../api"

export const getWorkflowStore = () => {
  const INITIAL_WORKFLOW_STATE = {
    workflows: []
  }

  const store = writable(INITIAL_WORKFLOW_STATE)

  store.actions = {
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
        return state
      })
    },
  }

  return store
}