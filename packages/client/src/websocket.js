import {
  builderStore,
  environmentStore,
  notificationStore,
} from "./stores/index.js"
import { get } from "svelte/store"
import { createWebsocket } from "@budibase/frontend-core"

let socket

export const initWebsocket = () => {
  const { inBuilder, location } = get(builderStore)
  const { cloud } = get(environmentStore)

  // Only connect when we're inside the builder preview, for now
  if (!inBuilder || !location || cloud || socket) {
    return
  }

  // Initialise connection
  socket = createWebsocket("/socket/client", {
    heartbeat: false,
  })

  // Event handlers
  socket.on("plugin-update", data => {
    builderStore.actions.updateUsedPlugin(data.name, data.hash)
    notificationStore.actions.info(`"${data.name}" plugin reloaded`)
  })
}
