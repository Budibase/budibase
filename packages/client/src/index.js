import ClientApp from "./components/ClientApp.svelte"
import { componentStore, builderStore, appStore, devToolsStore } from "./stores"
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

const loadBudibase = () => {
  // Update builder store with any builder flags
  builderStore.set({
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

  // Enable dev tools or not. We need to be using a dev app and not inside
  // the builder preview to enable them.
  const enableDevTools = !get(builderStore).inBuilder && get(appStore).isDevApp
  devToolsStore.actions.setEnabled(enableDevTools)

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
