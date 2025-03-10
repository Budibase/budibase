import { writable, get } from "svelte/store"
import { API } from "@/api"
import { devToolsStore } from "./devTools.js"
import { eventStore } from "./events.js"
import {
  ComponentDefinition,
  DropPosition,
  PingSource,
  PreviewDevice,
  Screen,
  Theme,
  AppCustomTheme,
  AppNavigation,
  Plugin,
  Snippet,
  UIComponentError,
} from "@budibase/types"

interface BuilderStore {
  inBuilder: boolean
  screen?: Screen | null
  selectedComponentId?: string | null
  editMode: boolean
  previewId?: number | null
  theme?: Theme | null
  customTheme?: AppCustomTheme | null
  previewDevice?: PreviewDevice
  navigation?: AppNavigation | null
  hiddenComponentIds?: string[]
  usedPlugins?: Plugin[] | null
  metadata: { componentId: string; step: number } | null
  snippets?: Snippet[] | null
  componentErrors?: Record<string, UIComponentError[]>
}

const createBuilderStore = () => {
  const initialState: BuilderStore = {
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
    metadata: null,
    snippets: null,
    componentErrors: {},
  }
  const store = writable(initialState)
  const actions = {
    selectComponent: (id: string) => {
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
    updateProp: (prop: string, value: any) => {
      eventStore.actions.dispatchEvent("update-prop", { prop, value })
    },
    updateStyles: async (styles: Record<string, any>, id: string) => {
      await eventStore.actions.dispatchEvent("update-styles", {
        styles,
        id,
      })
    },
    keyDown: (key: string, ctrlKey: boolean) => {
      eventStore.actions.dispatchEvent("key-down", { key, ctrlKey })
    },
    duplicateComponent: (
      id: string,
      mode = DropPosition.BELOW,
      selectComponent = true
    ) => {
      eventStore.actions.dispatchEvent("duplicate-component", {
        id,
        mode,
        selectComponent,
      })
    },
    deleteComponent: (id: string) => {
      eventStore.actions.dispatchEvent("delete-component", { id })
    },
    notifyLoaded: () => {
      eventStore.actions.dispatchEvent("preview-loaded")
    },
    analyticsPing: async ({ embedded }: { embedded: boolean }) => {
      try {
        await API.analyticsPing({ source: PingSource.APP, embedded })
      } catch (error) {
        // Do nothing
      }
    },
    moveComponent: async (
      componentId: string,
      destinationComponentId: string,
      mode: DropPosition
    ) => {
      await eventStore.actions.dispatchEvent("move-component", {
        componentId,
        destinationComponentId,
        mode,
      })
    },
    dropNewComponent: (
      component: string,
      parent: string,
      index: number,
      props?: Record<string, any>
    ) => {
      eventStore.actions.dispatchEvent("drop-new-component", {
        component,
        parent,
        index,
        props,
      })
    },
    setEditMode: (enabled: boolean) => {
      if (enabled === get(store).editMode) {
        return
      }
      store.update(state => ({ ...state, editMode: enabled }))
    },
    requestAddComponent: () => {
      eventStore.actions.dispatchEvent("request-add-component")
    },
    highlightSetting: (setting: string) => {
      eventStore.actions.dispatchEvent("highlight-setting", { setting })
    },
    ejectBlock: (id: string, definition: ComponentDefinition) => {
      eventStore.actions.dispatchEvent("eject-block", { id, definition })
    },
    updateUsedPlugin: (name: string, hash: string) => {
      // Check if we used this plugin
      const used = get(store)?.usedPlugins?.find(x => x.name === name)
      if (used) {
        store.update(state => {
          state.usedPlugins = state.usedPlugins!.filter(x => x.name !== name)
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
    addParentComponent: (componentId: string, parentType: string) => {
      eventStore.actions.dispatchEvent("add-parent-component", {
        componentId,
        parentType,
      })
    },
    setMetadata: (metadata: { componentId: string; step: number }) => {
      store.update(state => ({
        ...state,
        metadata,
      }))
    },
  }
  return {
    ...store,
    set: (state: BuilderStore) => store.set({ ...initialState, ...state }),
    actions,
  }
}

export const builderStore = createBuilderStore()
