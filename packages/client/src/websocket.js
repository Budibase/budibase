import { builderStore } from "./stores/index.js"
import { get } from "svelte/store"
import { io } from "socket.io-client"

export const initWebsocket = () => {
  const { inBuilder, location } = get(builderStore)

  // Only connect when we're inside the builder preview, for now
  if (!inBuilder || !location) {
    return
  }

  // Initialise connection
  const tls = location.protocol === "https:"
  const proto = tls ? "wss:" : "ws:"
  const host = location.hostname
  const port = location.port || (tls ? 443 : 80)
  const socket = io(`${proto}//${host}:${port}`, {
    path: "/socket/client",
  })

  // Event handlers
  socket.on("plugin-update", data => {
    builderStore.actions.updateUsedPlugin(data.name, data.hash)
  })
}
