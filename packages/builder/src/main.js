import "remixicon/fonts/remixicon.css"
import "@spectrum-css/vars/dist/spectrum-global.css"
import "@spectrum-css/vars/dist/spectrum-medium.css"
import "@spectrum-css/vars/dist/spectrum-darkest.css"
import "@spectrum-css/vars/dist/spectrum-dark.css"
import "@spectrum-css/vars/dist/spectrum-light.css"
import "@spectrum-css/vars/dist/spectrum-lightest.css"
import "@budibase/frontend-core/src/themes/nord.css"
import "@budibase/frontend-core/src/themes/midnight.css"
import "@spectrum-css/page/dist/index-vars.css"
import "./global.css"
import { suppressWarnings } from "./helpers/warnings"
import loadSpectrumIcons from "@budibase/bbui/spectrum-icons-vite.js"
import App from "./App.svelte"

// Init spectrum icons
loadSpectrumIcons()

// Suppress svelte runtime warnings
suppressWarnings([
  "was created with unknown prop",
  "was created without expected prop",
  "received an unexpected slot",
])

export default new App({
  target: document.getElementById("app"),
})
