import {
  builderStore,
  environmentStore,
  notificationStore,
} from "./stores/index.js"
import { get } from "svelte/store"
import { io } from "socket.io-client"

let socket

export const initWebsocket = () => {
  const { inBuilder, location } = get(builderStore)
  const { cloud } = get(environmentStore)

  // Only connect when we're inside the builder preview, for now
  if (!inBuilder || !location || cloud || socket) {
    return
  }

  // Initialise connection
  const tls = location.protocol === "https:"
  const proto = tls ? "wss:" : "ws:"
  const host = location.hostname
  const port = location.port || (tls ? 443 : 80)
  socket = io(`${proto}//${host}:${port}`, {
    path: "/socket/client",
    // Cap reconnection attempts to 3 (total of 15 seconds before giving up)
    reconnectionAttempts: 3,
    // Delay reconnection attempt by 5 seconds
    reconnectionDelay: 5000,
    reconnectionDelayMax: 5000,
    // Timeout after 4 seconds so we never stack requests
    timeout: 4000,
  })

  // Event handlers
  socket.on("plugin-update", data => {
    builderStore.actions.updateUsedPlugin(data.name, data.hash)
    notificationStore.actions.info(`"${data.name}" plugin reloaded`)
  })
}
