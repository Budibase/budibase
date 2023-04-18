import { get } from "svelte/store"
import { io } from "socket.io-client"

export const createWebsocket = context => {
  const { rows, tableId, users, userId, focusedCellId } = context

  // Determine connection info
  const tls = location.protocol === "https:"
  const proto = tls ? "wss:" : "ws:"
  const host = location.hostname
  const port = location.port || (tls ? 443 : 80)
  const socket = io(`${proto}//${host}:${port}`, {
    path: "/socket/spreadsheet",
    // Cap reconnection attempts to 3 (total of 15 seconds before giving up)
    reconnectionAttempts: 3,
    // Delay reconnection attempt by 5 seconds
    reconnectionDelay: 5000,
    reconnectionDelayMax: 5000,
    // Timeout after 4 seconds so we never stack requests
    timeout: 4000,
  })

  const connectToTable = tableId => {
    if (!socket.connected) {
      return
    }
    // Identify which table we are editing
    socket.emit("select-table", tableId, response => {
      // handle initial connection info
      users.set(response.users)
      userId.set(response.id)
    })
  }

  // Event handlers
  socket.on("connect", () => {
    connectToTable(get(tableId))
  })
  socket.on("row-update", data => {
    if (data.id) {
      rows.actions.refreshRow(data.id)
    }
  })
  socket.on("user-update", user => {
    users.actions.updateUser(user)
  })
  socket.on("user-disconnect", user => {
    users.actions.removeUser(user)
  })
  socket.on("connect_error", err => {
    console.log("Failed to connect to websocket:", err.message)
  })

  // Change websocket connection when dataspace changes
  tableId.subscribe(connectToTable)

  // Notify selected cell changes
  focusedCellId.subscribe($focusedCellId => {
    socket.emit("select-cell", $focusedCellId)
  })

  return () => socket?.disconnect()
}
