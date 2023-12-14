import { writable, get } from "svelte/store"
import { API } from "api"
import { devToolsStore } from "./devTools.js"
import { eventStore } from "./events.js"

const createBuilderStore = () => {
  const initialState = {
    inBuilder: false,
    screen: null,
    selectedComponentId: null,
    editMode: false,
    previewId: null,
    theme: null,
    customTheme: null,
    previewDevice: "desktop",
    navigation: null,
    hiddenComponentIds: [],
    usedPlugins: null,
    eventResolvers: {},

    // Legacy - allow the builder to specify a layout
    layout: null,
  }
  const store = writable(initialState)
  const actions = {
    selectComponent: id => {
      if (id === get(store).selectedComponentId) {
        return
      }
      store.update(state => ({
        ...state,
        editMode: false,
        selectedComponentId: id,
      }))
      devToolsStore.actions.setAllowSelection(false)
      eventStore.actions.dispatchEvent("select-component", { id })
    },
    updateProp: (prop, value) => {
      eventStore.actions.dispatchEvent("update-prop", { prop, value })
    },
    updateStyles: async (styles, id) => {
      await eventStore.actions.dispatchEvent("update-styles", { styles, id })
    },
    keyDown: (key, ctrlKey) => {
      eventStore.actions.dispatchEvent("key-down", { key, ctrlKey })
    },
    duplicateComponent: id => {
      eventStore.actions.dispatchEvent("duplicate-component", { id })
    },
    deleteComponent: id => {
      eventStore.actions.dispatchEvent("delete-component", { id })
    },
    notifyLoaded: () => {
      eventStore.actions.dispatchEvent("preview-loaded")
    },
    analyticsPing: async ({ embedded }) => {
      try {
        await API.analyticsPing({ source: "app", embedded })
      } catch (error) {
        // Do nothing
      }
    },
    moveComponent: async (componentId, destinationComponentId, mode) => {
      await eventStore.actions.dispatchEvent("move-component", {
        componentId,
        destinationComponentId,
        mode,
      })
    },
    dropNewComponent: (component, parent, index) => {
      eventStore.actions.dispatchEvent("drop-new-component", {
        component,
        parent,
        index,
      })
    },
    setEditMode: enabled => {
      if (enabled === get(store).editMode) {
        return
      }
      store.update(state => ({ ...state, editMode: enabled }))
    },
    requestAddComponent: () => {
      eventStore.actions.dispatchEvent("request-add-component")
    },
    highlightSetting: setting => {
      eventStore.actions.dispatchEvent("highlight-setting", { setting })
    },
    ejectBlock: (id, definition) => {
      eventStore.actions.dispatchEvent("eject-block", { id, definition })
    },
    updateUsedPlugin: (name, hash) => {
      // Check if we used this plugin
      const used = get(store)?.usedPlugins?.find(x => x.name === name)
      if (used) {
        store.update(state => {
          state.usedPlugins = state.usedPlugins.filter(x => x.name !== name)
          state.usedPlugins.push({
            ...used,
            hash,
          })
          return state
        })
      }

      // Notify the builder so we can reload component definitions
      eventStore.actions.dispatchEvent("reload-plugin")
    },
    addParentComponent: (componentId, parentType) => {
      eventStore.actions.dispatchEvent("add-parent-component", {
        componentId,
        parentType,
      })
    },
  }
  return {
    ...store,
    set: state => store.set({ ...initialState, ...state }),
    actions,
  }
}

export const builderStore = createBuilderStore()
