import "remixicon/fonts/remixicon.css"
import "@spectrum-css/vars/dist/spectrum-global.css"
import "@spectrum-css/vars/dist/spectrum-medium.css"
import "@spectrum-css/vars/dist/spectrum-darkest.css"
import "@spectrum-css/vars/dist/spectrum-dark.css"
import "@spectrum-css/vars/dist/spectrum-light.css"
import "@spectrum-css/vars/dist/spectrum-lightest.css"
import "@spectrum-css/page/dist/index-vars.css"
import "./global.css"

import loadSpectrumIcons from "@budibase/bbui/spectrum-icons-vite.js"
loadSpectrumIcons()

import App from "./App.svelte"

export default new App({
  target: document.getElementById("app"),
})
