import { writable } from "svelte/store"
import type { AppTemplate } from "../../types/app"

export interface AppCreationState {
  showCreateModal: boolean
  showTemplatesModal: boolean
  showImportModal: boolean
  template: AppTemplate | null
}

const initialState: AppCreationState = {
  showCreateModal: false,
  showTemplatesModal: false,
  showImportModal: false,
  template: null,
}

function createAppCreationStore() {
  const { subscribe, set, update } = writable<AppCreationState>(initialState)

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

    setTemplate: (template: AppTemplate) =>
      update(state => ({ ...state, template })),
    clearTemplate: () => update(state => ({ ...state, template: null })),
  }
}

export const appCreationStore = createAppCreationStore()
