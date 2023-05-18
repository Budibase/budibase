import { get } from "svelte/store"
import { createWebsocket } from "../../../utils"

export const createGridWebsocket = context => {
  const { rows, tableId, users, focusedCellId } = context
  const socket = createWebsocket("/socket/grid")

  const connectToTable = tableId => {
    if (!socket.connected) {
      return
    }
    // Identify which table we are editing
    socket.emit("select-table", tableId, response => {
      // handle initial connection info
      users.set(response.users)
    })
  }

  // Event handlers
  socket.on("connect", () => {
    connectToTable(get(tableId))
  })
  socket.on("row-update", data => {
    if (data.id) {
      rows.actions.replaceRow(data.id, data.row)
    }
  })
  socket.on("user-update", user => {
    users.actions.updateUser(user)
  })
  socket.on("user-disconnect", user => {
    users.actions.removeUser(user)
  })
  socket.on("connect_error", err => {
    console.log("Failed to connect to grid websocket:", err.message)
  })

  // Change websocket connection when table changes
  tableId.subscribe(connectToTable)

  // Notify selected cell changes
  focusedCellId.subscribe($focusedCellId => {
    socket.emit("select-cell", $focusedCellId)
  })

  return () => socket?.disconnect()
}
