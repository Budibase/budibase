import { get } from "svelte/store"
import { createWebsocket } from "../../../utils"
import { SocketEvents, GridSocketEvents } from "@budibase/shared-core"

export const createGridWebsocket = context => {
  const { rows, tableId, users, focusedCellId, table } = context
  const socket = createWebsocket("/socket/grid")

  const connectToTable = tableId => {
    if (!socket.connected) {
      return
    }
    // Identify which table we are editing
    socket.emit(GridSocketEvents.SelectTable, tableId, response => {
      // handle initial connection info
      users.set(response.users)
    })
  }

  // Built-in events
  socket.on("connect", () => {
    connectToTable(get(tableId))
  })
  socket.on("connect_error", err => {
    console.log("Failed to connect to grid websocket:", err.message)
  })

  // User events
  socket.on(SocketEvents.UserUpdate, user => {
    users.actions.updateUser(user)
  })
  socket.on(SocketEvents.UserDisconnect, user => {
    users.actions.removeUser(user)
  })

  // Row events
  socket.on(GridSocketEvents.RowChange, async data => {
    if (data.id) {
      rows.actions.replaceRow(data.id, data.row)
    } else if (data.row.id) {
      // Handle users table edge cased
      await rows.actions.refreshRow(data.row.id)
    }
  })

  // Table events
  socket.on(GridSocketEvents.TableChange, data => {
    // Only update table if one exists. If the table was deleted then we don't
    // want to know - let the builder navigate away
    if (data.table) {
      table.set(data.table)
    }
  })

  // Change websocket connection when table changes
  tableId.subscribe(connectToTable)

  // Notify selected cell changes
  focusedCellId.subscribe($focusedCellId => {
    socket.emit(GridSocketEvents.SelectCell, $focusedCellId)
  })

  return () => socket?.disconnect()
}
