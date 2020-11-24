import ClientApp from "./components/ClientApp.svelte"
import { builderStore } from "./store"

let app

const loadBudibase = () => {
  // Update builder store with any builder flags
  builderStore.set({
    inBuilder: !!window["##BUDIBASE_IN_BUILDER##"],
    page: window["##BUDIBASE_PREVIEW_PAGE##"],
    screen: window["##BUDIBASE_PREVIEW_SCREEN##"],
  })

  // Create app if one hasn't been created yet
  if (!app) {
    app = new ClientApp({
      target: window.document.body,
    })
  }
}

// Attach to window so the HTML template can call this when it loads
window.loadBudibase = loadBudibase
