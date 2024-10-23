import { createWebsocket } from "@budibase/frontend-core"
import {
  automationStore,
  userStore,
  appStore,
  themeStore,
  navigationStore,
  deploymentStore,
  snippets,
  datasources,
  tables,
  roles,
} from "stores/builder"
import { get } from "svelte/store"
import { auth, appsStore } from "stores/portal"
import { screenStore } from "./screens"
import { SocketEvent, BuilderSocketEvent, helpers } from "@budibase/shared-core"
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
    console.error("Failed to connect to builder websocket:", err.message)
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
      appStore.update(state => ({
        ...state,
        hasLock: true,
      }))
    }
  })

  // Data section events
  socket.onOther(BuilderSocketEvent.TableChange, ({ id, table }) => {
    tables.replaceTable(id, table)
  })
  socket.onOther(BuilderSocketEvent.DatasourceChange, ({ id, datasource }) => {
    datasources.replaceDatasource(id, datasource)
  })

  // Role events
  socket.onOther(BuilderSocketEvent.RoleChange, ({ id, role }) => {
    roles.replace(id, role)
  })

  // Design section events
  socket.onOther(BuilderSocketEvent.ScreenChange, ({ id, screen }) => {
    screenStore.replace(id, screen)
  })

  // App events
  socket.onOther(BuilderSocketEvent.AppMetadataChange, ({ metadata }) => {
    appStore.syncMetadata(metadata)
    themeStore.syncMetadata(metadata)
    navigationStore.syncMetadata(metadata)
    snippets.syncMetadata(metadata)
  })
  socket.onOther(
    BuilderSocketEvent.AppPublishChange,
    async ({ user, published }) => {
      await appsStore.load()
      if (published) {
        await deploymentStore.load()
      }
      const verb = published ? "published" : "unpublished"
      notifications.success(`${helpers.getUserLabel(user)} ${verb} this app`)
    }
  )

  // Automation events
  socket.onOther(BuilderSocketEvent.AutomationChange, ({ id, automation }) => {
    automationStore.actions.replace(id, automation)
  })

  return socket
}
