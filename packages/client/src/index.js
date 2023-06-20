import ClientApp from "./components/ClientApp.svelte"
import {
  builderStore,
  appStore,
  blockStore,
  componentStore,
  environmentStore,
  dndStore,
  eventStore,
} from "./stores"
import loadSpectrumIcons from "@budibase/bbui/spectrum-icons-rollup.js"
import { get } from "svelte/store"
import { initWebsocket } from "./websocket.js"

// Provide svelte and svelte/internal as globals for custom components
import * as svelte from "svelte"
import * as internal from "svelte/internal"
window.svelte_internal = internal
window.svelte = svelte

// Initialise spectrum icons
loadSpectrumIcons()

let app

const loadBudibase = async () => {
  // Update builder store with any builder flags
  builderStore.set({
    ...get(builderStore),
    inBuilder: !!window["##BUDIBASE_IN_BUILDER##"],
    layout: window["##BUDIBASE_PREVIEW_LAYOUT##"],
    screen: window["##BUDIBASE_PREVIEW_SCREEN##"],
    selectedComponentId: window["##BUDIBASE_SELECTED_COMPONENT_ID##"],
    previewId: window["##BUDIBASE_PREVIEW_ID##"],
    theme: window["##BUDIBASE_PREVIEW_THEME##"],
    customTheme: window["##BUDIBASE_PREVIEW_CUSTOM_THEME##"],
    previewDevice: window["##BUDIBASE_PREVIEW_DEVICE##"],
    navigation: window["##BUDIBASE_PREVIEW_NAVIGATION##"],
    hiddenComponentIds: window["##BUDIBASE_HIDDEN_COMPONENT_IDS##"],
    usedPlugins: window["##BUDIBASE_USED_PLUGINS##"],
    location: window["##BUDIBASE_LOCATION##"],
  })

  // Set app ID - this window flag is set by both the preview and the real
  // server rendered app HTML
  appStore.actions.setAppId(window["##BUDIBASE_APP_ID##"])

  // Fetch environment info
  if (!get(environmentStore)?.loaded) {
    await environmentStore.actions.fetchEnvironment()
  }

  // Register handler for runtime events from the builder
  window.handleBuilderRuntimeEvent = (type, data) => {
    if (!window["##BUDIBASE_IN_BUILDER##"]) {
      return
    }
    if (type === "event-completed") {
      eventStore.actions.resolveEvent(data)
    } else if (type === "eject-block") {
      const block = blockStore.actions.getBlock(data)
      block?.eject()
    } else if (type === "dragging-new-component") {
      const { dragging, component } = data
      if (dragging) {
        const definition =
          componentStore.actions.getComponentDefinition(component)
        dndStore.actions.startDraggingNewComponent({ component, definition })
      } else {
        dndStore.actions.reset()
      }
    }
  }

  // Register any custom components
  if (window["##BUDIBASE_CUSTOM_COMPONENTS##"]) {
    window["##BUDIBASE_CUSTOM_COMPONENTS##"].forEach(component => {
      componentStore.actions.registerCustomComponent(component)
    })
  }

  // Make a callback available for custom component bundles to register
  // themselves at runtime
  window.registerCustomComponent =
    componentStore.actions.registerCustomComponent

  // Initialise websocket
  initWebsocket()

  // Create app if one hasn't been created yet
  if (!app) {
    app = new ClientApp({
      target: window.document.body,
    })
  }
}

// Attach to window so the HTML template can call this when it loads
window.loadBudibase = loadBudibase
