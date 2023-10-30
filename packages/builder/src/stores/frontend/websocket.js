import { createWebsocket } from "@budibase/frontend-core"
import {
  automationStore,
  userStore,
  appStore,
  themeStore,
  navigationStore,
  deploymentStore,
} from "stores/frontend"
import { datasources, tables } from "stores/backend"
import { get } from "svelte/store"
import { auth, apps } from "stores/portal"
import { screenStore } from "./screens"
import { SocketEvent, BuilderSocketEvent } from "@budibase/shared-core"
import { notifications } from "@budibase/bbui"
import { helpers } from "@budibase/shared-core"

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

  // Design section events
  socket.onOther(BuilderSocketEvent.ScreenChange, ({ id, screen }) => {
    screenStore.replace(id, screen)
  })
  socket.onOther(BuilderSocketEvent.AppMetadataChange, ({ metadata }) => {
    //Sync app metadata across the stores
    appStore.syncMetadata(metadata)
    themeStore.syncMetadata(metadata)
    navigationStore.syncMetadata(metadata)
  })
  socket.onOther(
    BuilderSocketEvent.AppPublishChange,
    async ({ user, published }) => {
      await apps.load()
      if (published) {
        await deploymentStore.load()
      }
      const verb = published ? "published" : "unpublished"
      notifications.success(`${helpers.getUserLabel(user)} ${verb} this app`)
    }
  )

  // Automations
  socket.onOther(BuilderSocketEvent.AutomationChange, ({ id, automation }) => {
    automationStore.actions.replace(id, automation)
  })

  return socket
}
