import { createWebsocket } from "@budibase/frontend-core"
import { userStore } from "builderStore"
import { datasources, tables } from "stores/backend"
import { SocketEvents, BuilderSocketEvents } from "@budibase/shared-core"

export const createBuilderWebsocket = () => {
  const socket = createWebsocket("/socket/builder")

  // Built-in events
  socket.on("connect", () => {
    socket.emit(SocketEvents.GetUsers, null, response => {
      userStore.actions.init(response.users)
    })
  })
  socket.on("connect_error", err => {
    console.log("Failed to connect to builder websocket:", err.message)
  })

  // User events
  socket.on(SocketEvents.UserUpdate, userStore.actions.updateUser)
  socket.on(SocketEvents.UserDisconnect, userStore.actions.removeUser)

  // Table events
  socket.on(BuilderSocketEvents.TableChange, ({ id, table }) => {
    tables.replaceTable(id, table)
  })

  // Datasource events
  socket.on(BuilderSocketEvents.DatasourceChange, ({ id, datasource }) => {
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
