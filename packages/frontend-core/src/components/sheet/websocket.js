import { derived, get } from "svelte/store"
import { io } from "socket.io-client"

export const createWebsocket = context => {
  const { rows, config } = context
  const tableId = derived(config, $config => $config.tableId)

  // Determine connection info
  const tls = location.protocol === "https:"
  const proto = tls ? "wss:" : "ws:"
  const host = location.hostname
  const port = location.port || (tls ? 443 : 80)
  const socket = io(`${proto}//${host}:${port}`, {
    path: "/socket/dataspace",
    // Cap reconnection attempts to 3 (total of 15 seconds before giving up)
    reconnectionAttempts: 3,
    // Delay reconnection attempt by 5 seconds
    reconnectionDelay: 5000,
    reconnectionDelayMax: 5000,
    // Timeout after 4 seconds so we never stack requests
    timeout: 4000,
  })

  const connectToDataspace = tableId => {
    if (!socket.connected) {
      return
    }
    console.log("Idenifying dataspace", tableId)

    // Identify which dataspace we are editing
    socket.emit("identify", tableId, response => {
      // handle initial connection info
      console.log("response", response)
    })
  }

  // Event handlers
  socket.on("connect", () => {
    connectToDataspace(get(tableId))
  })

  socket.on("row-update", data => {
    if (data.id) {
      rows.actions.refreshRow(data.id)
    }
    console.log(data)
  })

  socket.on("connect_error", err => {
    console.log("Failed to connect to websocket:", err.message)
  })

  // Change websocket connection when dataspace changes
  tableId.subscribe(connectToDataspace)

  return () => socket?.disconnect()
}
