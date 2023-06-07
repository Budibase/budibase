import { createWebsocket } from "@budibase/frontend-core"
import { userStore, store } from "builderStore"
import { datasources, tables } from "stores/backend"
import { get } from "svelte/store"
import { auth } from "stores/portal"
import { SocketEvent, BuilderSocketEvent } from "@budibase/shared-core"
import { notifications } from "@budibase/bbui"

export const createBuilderWebsocket = appId => {
  const socket = createWebsocket("/socket/builder")

  // Built-in events
  socket.on("connect", () => {
    socket.emit(BuilderSocketEvent.SelectApp, { appId }, ({ users }) => {
      userStore.actions.init(users)
    })
  })
  socket.on("connect_error", err => {
    console.log("Failed to connect to builder websocket:", err.message)
  })
  socket.on("disconnect", () => {
    userStore.actions.reset()
  })

  // User events
  socket.onOther(SocketEvent.UserUpdate, ({ user }) => {
    userStore.actions.updateUser(user)
  })
  socket.onOther(SocketEvent.UserDisconnect, ({ sessionId }) => {
    userStore.actions.removeUser(sessionId)
  })
  socket.onOther(BuilderSocketEvent.LockTransfer, ({ userId }) => {
    if (userId === get(auth)?.user?._id) {
      notifications.success("You can now edit screens and automations")
      store.update(state => ({
        ...state,
        hasLock: true,
      }))
    }
  })

  // Table events
  socket.onOther(BuilderSocketEvent.TableChange, ({ id, table }) => {
    tables.replaceTable(id, table)
  })

  // Datasource events
  socket.onOther(BuilderSocketEvent.DatasourceChange, ({ id, datasource }) => {
    datasources.replaceDatasource(id, datasource)
  })

  return socket
}
