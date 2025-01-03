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
} from "@/stores/builder"
import { get } from "svelte/store"
import { auth, appsStore } from "@/stores/portal"
import { screenStore } from "./screens"
import { SocketEvent, BuilderSocketEvent, helpers } from "@budibase/shared-core"
import { notifications } from "@budibase/bbui"
import { Automation, Datasource, Role, Table, UIUser } from "@budibase/types"

export const createBuilderWebsocket = (appId: string) => {
  const socket = createWebsocket("/socket/builder")

  // Built-in events
  socket.on("connect", () => {
    socket.emit(
      BuilderSocketEvent.SelectApp,
      { appId },
      ({ users }: { users: UIUser[] }) => {
        userStore.init(users)
      }
    )
  })
  socket.on("connect_error", err => {
    console.error("Failed to connect to builder websocket:", err.message)
  })
  socket.on("disconnect", () => {
    userStore.reset()
  })

  // User events
  socket.onOther(SocketEvent.UserUpdate, ({ user }: { user: UIUser }) => {
    userStore.updateUser(user)
  })
  socket.onOther(
    SocketEvent.UserDisconnect,
    ({ sessionId }: { sessionId: string }) => {
      userStore.removeUser(sessionId)
    }
  )
  socket.onOther(
    BuilderSocketEvent.LockTransfer,
    ({ userId }: { userId: string }) => {
      if (userId === get(auth)?.user?._id) {
        appStore.update(state => ({
          ...state,
          hasLock: true,
        }))
      }
    }
  )

  // Data section events
  socket.onOther(
    BuilderSocketEvent.TableChange,
    ({ id, table }: { id: string; table: Table }) => {
      tables.replaceTable(id, table)
    }
  )
  socket.onOther(
    BuilderSocketEvent.DatasourceChange,
    ({ id, datasource }: { id: string; datasource: Datasource }) => {
      datasources.replaceDatasource(id, datasource)
    }
  )

  // Role events
  socket.onOther(
    BuilderSocketEvent.RoleChange,
    ({ id, role }: { id: string; role: Role }) => {
      roles.replace(id, role)
    }
  )

  // Design section events
  socket.onOther(
    BuilderSocketEvent.ScreenChange,
    ({ id, screen }: { id: string; screen: Screen }) => {
      screenStore.replace(id, screen)
    }
  )

  // App events
  socket.onOther(
    BuilderSocketEvent.AppMetadataChange,
    ({ metadata }: { metadata: any }) => {
      appStore.syncMetadata(metadata)
      themeStore.syncMetadata(metadata)
      navigationStore.syncMetadata(metadata)
      snippets.syncMetadata(metadata)
    }
  )
  socket.onOther(
    BuilderSocketEvent.AppPublishChange,
    async ({ user, published }: { user: UIUser; published: boolean }) => {
      await appsStore.load()
      if (published) {
        await deploymentStore.load()
      }
      const verb = published ? "published" : "unpublished"
      notifications.success(`${helpers.getUserLabel(user)} ${verb} this app`)
    }
  )

  // Automation events
  socket.onOther(
    BuilderSocketEvent.AutomationChange,
    ({ id, automation }: { id: string; automation: Automation }) => {
      automationStore.actions.replace(id, automation)
    }
  )

  return socket
}
