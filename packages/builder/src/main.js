import HMR from "@sveltech/routify/hmr"
import App from "./App.svelte"
import "./global.css"
import "./fonts.css"
import "/assets/roboto-v20-latin-ext_latin-300"
import "/assets/roboto-v20-latin-ext_latin-400"
import "/assets/roboto-v20-latin-ext_latin-500"
import "/assets/roboto-v20-latin-ext_latin-700"
import "/assets/roboto-v20-latin-ext_latin-900"
import "/_builder/assets/budibase-logo.png"
import "/_builder/assets/budibase-logo-only.png"
import "uikit/dist/css/uikit.min.css"
import "uikit/dist/js/uikit.min.js"
import "codemirror/lib/codemirror.css"
import "codemirror/theme/monokai.css"

/* eslint-disable */
const app = HMR(App, { target: document.getElementById("app") }, "routify-app")

export default app
