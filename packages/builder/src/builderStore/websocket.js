import { createWebsocket } from "@budibase/frontend-core"
import { userStore } from "builderStore"
import { datasources, tables } from "stores/backend"
import { SocketEvent, BuilderSocketEvent } from "@budibase/shared-core"

export const createBuilderWebsocket = appId => {
  const socket = createWebsocket("/socket/builder")

  // Built-in events
  socket.on("connect", () => {
    socket.emit(BuilderSocketEvent.SelectApp, appId, response => {
      userStore.actions.init(response.users)
    })
  })
  socket.on("connect_error", err => {
    console.log("Failed to connect to builder websocket:", err.message)
  })

  // User events
  socket.on(SocketEvent.UserUpdate, userStore.actions.updateUser)
  socket.on(SocketEvent.UserDisconnect, userStore.actions.removeUser)

  // Table events
  socket.on(BuilderSocketEvent.TableChange, ({ id, table }) => {
    tables.replaceTable(id, table)
  })

  // Datasource events
  socket.on(BuilderSocketEvent.DatasourceChange, ({ id, datasource }) => {
    datasources.replaceDatasource(id, datasource)
  })

  // Clean up user store on disconnect
  socket.on("disconnect", () => {
    userStore.actions.reset()
  })

  return socket
}
