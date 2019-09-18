import App from "./App.svelte";
import "./global.css";
import "./fonts.css";
import "/assets/roboto-v20-latin-ext_latin-300";
import "/assets/roboto-v20-latin-ext_latin-400";
import "/assets/roboto-v20-latin-ext_latin-500";
import "/assets/roboto-v20-latin-ext_latin-700";
import "/assets/roboto-v20-latin-ext_latin-900";
import "/assets/budibase-logo.png";
import "/assets/budibase-logo-only.png";
import "uikit/dist/css/uikit.min.css";
import "uikit/dist/js/uikit.min.js";

const app = new App({
	target: document.getElementById("app")
});


