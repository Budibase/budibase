import "remixicon/fonts/remixicon.css"
import "./global.css"
import "./fonts.css"
import "./budibase.css"
import "./fonts.css"
import "@budibase/bbui/dist/style.css"
import "@spectrum-css/vars/dist/spectrum-global.css"
import "@spectrum-css/vars/dist/spectrum-medium.css"
import "@spectrum-css/vars/dist/spectrum-darkest.css"
import "@spectrum-css/page/dist/index-vars.css"

import App from "./App.svelte"

export default new App({
  target: document.getElementById("app"),
})
