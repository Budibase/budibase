import { builderStore, environmentStore } from "./stores/index.js"
import { get } from "svelte/store"
import { io } from "socket.io-client"

export const initWebsocket = () => {
  const { inBuilder, location } = get(builderStore)
  const { cloud } = get(environmentStore)

  // Only connect when we're inside the builder preview, for now
  if (!inBuilder || !location || cloud) {
    return
  }

  // Initialise connection
  const tls = location.protocol === "https:"
  const proto = tls ? "wss:" : "ws:"
  const host = location.hostname
  const port = location.port || (tls ? 443 : 80)
  const socket = io(`${proto}//${host}:${port}`, {
    path: "/socket/client",
    // Cap reconnection attempts to 10 (total of 95 seconds before giving up)
    reconnectionAttempts: 10,
    // Delay initial reconnection attempt by 5 seconds
    reconnectionDelay: 5000,
    // Then decrease to 10 second intervals
    reconnectionDelayMax: 10000,
    // Timeout after 5 seconds so we never stack requests
    timeout: 5000,
  })

  // Event handlers
  socket.on("plugin-update", data => {
    builderStore.actions.updateUsedPlugin(data.name, data.hash)
  })
}
