import { derived } from "svelte/store"
import { devToolsStore } from "./devTools.js"
import { authStore } from "./auth.js"

export { authStore } from "./auth"
export { appStore } from "./app"
export { notificationStore } from "./notification"
export { routeStore } from "./routes"
export { screenStore } from "./screens"
export { builderStore } from "./builder"
export { dataSourceStore } from "./dataSource"
export { confirmationStore } from "./confirmation"
export { peekStore } from "./peek"
export { stateStore } from "./state"
export { themeStore } from "./theme"
export { devToolsStore } from "./devTools"
export { componentStore } from "./components"
export { uploadStore } from "./uploads.js"
export { rowSelectionStore } from "./rowSelection.js"
export { environmentStore } from "./environment"

// Context stores are layered and duplicated, so it is not a singleton
export { createContextStore } from "./context"

// Initialises an app by loading screens and routes
export { initialise } from "./initialise"

// Derive the current role of the logged-in user
export const currentRole = derived(
  [devToolsStore, authStore],
  ([$devToolsStore, $authStore]) => {
    return ($devToolsStore.enabled && $devToolsStore.role) || $authStore?.roleId
  }
)
