import ClientApp from "./components/ClientApp.svelte"

// Initialise client app
const loadBudibase = () => {
  window.document.body.innerHTML = ""
  new ClientApp({
    target: window.document.body,
  })
}

// Attach to window so the HTML template can call this when it loads
window.loadBudibase = loadBudibase
