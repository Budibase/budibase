import { createWebsocket } from "@budibase/frontend-core"
import { userStore } from "builderStore"
import { datasources, tables } from "stores/backend"

export const createBuilderWebsocket = () => {
  const socket = createWebsocket("/socket/builder")

  // Connection events
  socket.on("connect", () => {
    socket.emit("get-users", null, response => {
      userStore.actions.init(response.users)
    })
  })
  socket.on("connect_error", err => {
    console.log("Failed to connect to builder websocket:", err.message)
  })

  // User events
  socket.on("user-update", userStore.actions.updateUser)
  socket.on("user-disconnect", userStore.actions.removeUser)

  // Table events
  socket.on("table-change", ({ id, table }) => {
    tables.replaceTable(id, table)
  })

  // Datasource events
  socket.on("datasource-change", ({ id, datasource }) => {
    datasources.replaceDatasource(id, datasource)
  })

  return {
    ...socket,
    disconnect: () => {
      socket?.disconnect()
      userStore.actions.reset()
    },
  }
}
