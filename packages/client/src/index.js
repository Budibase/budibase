import ClientApp from "./components/ClientApp.svelte"
import { builderStore, appStore } from "./stores"
import loadSpectrumIcons from "@budibase/bbui/spectrum-icons-rollup.js"

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
    previewType: window["##BUDIBASE_PREVIEW_TYPE##"],
    theme: window["##BUDIBASE_PREVIEW_THEME##"],
    customTheme: window["##BUDIBASE_PREVIEW_CUSTOM_THEME##"],
    previewDevice: window["##BUDIBASE_PREVIEW_DEVICE##"],
  })

  // Set app ID - this window flag is set by both the preview and the real
  // server rendered app HTML
  appStore.actions.setAppID(window["##BUDIBASE_APP_ID##"])

  // Create app if one hasn't been created yet
  if (!app) {
    app = new ClientApp({
      target: window.document.body,
    })
  }
}

// Attach to window so the HTML template can call this when it loads
window.loadBudibase = loadBudibase
