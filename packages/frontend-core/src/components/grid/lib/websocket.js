import { get } from "svelte/store"
import { createWebsocket } from "../../../utils"
import { SocketEvent, GridSocketEvent } from "@budibase/shared-core"

export const createGridWebsocket = context => {
  const { rows, tableId, users, focusedCellId, table } = context
  const socket = createWebsocket("/socket/grid")

  const connectToTable = tableId => {
    if (!socket.connected) {
      return
    }
    // Identify which table we are editing
    socket.emit(
      GridSocketEvent.SelectTable,
      { tableId },
      ({ users: gridUsers }) => {
        users.set(gridUsers)
      }
    )
  }

  // Built-in events
  socket.on("connect", () => {
    connectToTable(get(tableId))
  })
  socket.on("connect_error", err => {
    console.log("Failed to connect to grid websocket:", err.message)
  })

  // User events
  socket.onOther(SocketEvent.UserUpdate, ({ user }) => {
    users.actions.updateUser(user)
  })
  socket.onOther(SocketEvent.UserDisconnect, ({ sessionId }) => {
    users.actions.removeUser(sessionId)
  })

  // Row events
  socket.onOther(GridSocketEvent.RowChange, async ({ id, row }) => {
    if (id) {
      rows.actions.replaceRow(id, row)
    } else if (row.id) {
      // Handle users table edge cased
      await rows.actions.refreshRow(row.id)
    }
  })

  // Table events
  socket.onOther(GridSocketEvent.TableChange, ({ table: newTable }) => {
    // Only update table if one exists. If the table was deleted then we don't
    // want to know - let the builder navigate away
    if (newTable) {
      table.set(newTable)
    }
  })

  // Change websocket connection when table changes
  tableId.subscribe(connectToTable)

  // Notify selected cell changes
  focusedCellId.subscribe($focusedCellId => {
    socket.emit(GridSocketEvent.SelectCell, { cellId: $focusedCellId })
  })

  return () => socket?.disconnect()
}
