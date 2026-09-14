import { writable } from "svelte/store"
import type { WorkspaceTemplate } from "../../types/workspace"

export interface WorkspaceCreationState {
  showCreateModal: boolean
  showTemplatesModal: boolean
  showImportModal: boolean
  template: WorkspaceTemplate | null
}

const initialState: WorkspaceCreationState = {
  showCreateModal: false,
  showTemplatesModal: false,
  showImportModal: false,
  template: null,
}

function createWorkspaceCreationStore() {
  const { subscribe, set, update } =
    writable<WorkspaceCreationState>(initialState)

  return {
    subscribe,
    reset: () => set(initialState),

    showCreateModal: () =>
      update(state => ({
        ...state,
        showCreateModal: true,
        template: null,
      })),
    hideCreateModal: () =>
      update(state => ({ ...state, showCreateModal: false })),

    showTemplatesModal: () =>
      update(state => ({ ...state, showTemplatesModal: true })),
    hideTemplatesModal: () =>
      update(state => ({ ...state, showTemplatesModal: false })),

    showImportModal: () =>
      update(state => ({
        ...state,
        showImportModal: true,
        template: { fromFile: true },
      })),
    hideImportModal: () =>
      update(state => ({
        ...state,
        showImportModal: false,
        template: null,
      })),

    setTemplate: (template: WorkspaceTemplate) =>
      update(state => ({ ...state, template })),
    clearTemplate: () => update(state => ({ ...state, template: null })),
  }
}

export const appCreationStore = createWorkspaceCreationStore()
