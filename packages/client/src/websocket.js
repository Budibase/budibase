import { builderStore } from "./stores/index.js"
import { get } from "svelte/store"
import { io } from "socket.io-client"

export const initWebsocket = () => {
  const { inBuilder, location } = get(builderStore)
  console.log(location)
  if (!inBuilder || !location) {
    return
  }

  // Websocket
  const tls = location.protocol === "https:"
  const proto = tls ? "wss:" : "ws:"
  const host = location.hostname
  const port = location.port || (tls ? 433 : 80)
  console.log(`${proto}//${host}:${port}`)
  const socket = io(`${proto}//${host}:${port}`, {
    path: "/socket/",
  })
  socket.on("plugin-update", data => {
    builderStore.actions.updateUsedPlugin(data.name, data.hash)
  })
}
