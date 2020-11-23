import ClientApp from "./components/ClientApp.svelte"

let app

const loadBudibase = () => {
  // Destroy old app if one exists
  if (app) {
    app.$destroy()
  }
  // Create new app
  app = new ClientApp({
    target: window.document.body,
  })
}

// Attach to window so the HTML template can call this when it loads
window.loadBudibase = loadBudibase
