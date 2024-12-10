import authorized from "../middleware/authorized"
import { BaseSocket, EmitOptions } from "./websocket"
import { permissions, events, context } from "@budibase/backend-core"
import http from "http"
import Koa from "koa"
import {
  Datasource,
  Table,
  SocketSession,
  ContextUser,
  Screen,
  App,
  Automation,
  Role,
} from "@budibase/types"
import { gridSocket } from "./index"
import { clearLock, updateLock } from "../utilities/redis"
import { Socket } from "socket.io"
import { BuilderSocketEvent } from "@budibase/shared-core"

export default class BuilderSocket extends BaseSocket {
  constructor(app: Koa, server: http.Server) {
    super(app, server, "/socket/builder", [authorized(permissions.BUILDER)])
  }

  async onConnect(socket?: Socket) {
    // Initial identification of selected app
    socket?.on(BuilderSocketEvent.SelectApp, async ({ appId }, callback) => {
      await this.joinRoom(socket, appId)
      const sessions = await this.getRoomSessions(appId)

      // Track collaboration usage by unique users
      let userIdMap: any = {}
      sessions?.forEach(session => {
        if (session._id) {
          userIdMap[session._id] = true
        }
      })

      const tenantId = context.getTenantIDFromAppID(appId)
      if (tenantId) {
        await context.doInTenant(tenantId, async () => {
          await events.user.dataCollaboration(Object.keys(userIdMap).length)
        })
      }

      // Reply with all current sessions
      callback({ users: sessions })
    })

    // Handle users selecting a new cell
    socket?.on(BuilderSocketEvent.SelectResource, ({ resourceId }) => {
      this.updateUser(socket, { selectedResourceId: resourceId })
    })
  }

  async onDisconnect(socket: Socket) {
    // Remove app lock from this user if they have no other connections,
    // and transfer it to someone else if possible
    try {
      // @ts-ignore
      const session: SocketSession = socket.data
      const { _id, sessionId, room } = session
      const sessions = await this.getRoomSessions(room)
      const hasOtherSession = sessions.some(otherSession => {
        return _id === otherSession._id && sessionId !== otherSession.sessionId
      })
      if (!hasOtherSession && room) {
        // Clear the lock from this user since they had no other sessions
        // @ts-ignore
        const user: ContextUser = { _id: socket.data._id }
        await clearLock(room, user)

        // Transfer lock ownership to the next oldest user
        let otherSessions = sessions.filter(x => x._id !== _id).slice()
        otherSessions.sort((a, b) => {
          return a.connectedAt < b.connectedAt ? -1 : 1
        })
        const nextSession = otherSessions[0]
        if (nextSession) {
          const { _id, email, firstName, lastName } = nextSession
          // @ts-ignore
          const nextUser: ContextUser = { _id, email, firstName, lastName }
          await updateLock(room, nextUser)
          this.io.to(room).emit(BuilderSocketEvent.LockTransfer, {
            userId: _id,
          })
        }
      }
    } catch (e) {
      // This is fine, just means this user didn't hold the lock
    }
  }

  async updateUser(socket: Socket, patch: object) {
    await super.updateUser(socket, {
      builderMetadata: {
        ...socket.data.builderMetadata,
        ...patch,
      },
    })
  }

  emitRoleUpdate(ctx: any, role: Role) {
    this.emitToRoom(ctx, ctx.appId, BuilderSocketEvent.RoleChange, {
      id: role._id,
      role,
    })
  }

  emitRoleDeletion(ctx: any, role: Role) {
    this.emitToRoom(ctx, ctx.appId, BuilderSocketEvent.RoleChange, {
      id: role._id,
      role: null,
    })
  }

  emitTableUpdate(ctx: any, table: Table, options?: EmitOptions) {
    if (table.sourceId == null || table.sourceId === "") {
      throw new Error("Table sourceId is not set")
    }

    this.emitToRoom(
      ctx,
      ctx.appId,
      BuilderSocketEvent.TableChange,
      {
        id: table._id,
        table,
      },
      options
    )
    gridSocket?.emitTableUpdate(ctx, table)
  }

  emitTableDeletion(ctx: any, table: Table) {
    this.emitToRoom(ctx, ctx.appId, BuilderSocketEvent.TableChange, {
      id: table._id,
      table: null,
    })
    gridSocket?.emitTableDeletion(ctx, table)
  }

  emitDatasourceUpdate(ctx: any, datasource: Datasource) {
    this.emitToRoom(ctx, ctx.appId, BuilderSocketEvent.DatasourceChange, {
      id: datasource._id,
      datasource,
    })
  }

  emitDatasourceDeletion(ctx: any, id: string) {
    this.emitToRoom(ctx, ctx.appId, BuilderSocketEvent.DatasourceChange, {
      id,
      datasource: null,
    })
  }

  emitScreenUpdate(ctx: any, screen: Screen) {
    this.emitToRoom(ctx, ctx.appId, BuilderSocketEvent.ScreenChange, {
      id: screen._id,
      screen,
    })
  }

  emitScreenDeletion(ctx: any, id: string) {
    this.emitToRoom(ctx, ctx.appId, BuilderSocketEvent.ScreenChange, {
      id,
      screen: null,
    })
  }

  emitAppMetadataUpdate(ctx: any, metadata: Partial<App>) {
    this.emitToRoom(ctx, ctx.appId, BuilderSocketEvent.AppMetadataChange, {
      metadata,
    })
  }

  emitAppPublish(ctx: any) {
    this.emitToRoom(ctx, ctx.appId, BuilderSocketEvent.AppPublishChange, {
      published: true,
      user: ctx.user,
    })
  }

  emitAppUnpublish(ctx: any) {
    this.emitToRoom(ctx, ctx.appId, BuilderSocketEvent.AppPublishChange, {
      published: false,
      user: ctx.user,
    })
  }

  emitAutomationUpdate(ctx: any, automation: Automation) {
    this.emitToRoom(ctx, ctx.appId, BuilderSocketEvent.AutomationChange, {
      id: automation._id,
      automation,
    })
  }

  emitAutomationDeletion(ctx: any, id: string) {
    this.emitToRoom(ctx, ctx.appId, BuilderSocketEvent.AutomationChange, {
      id,
      automation: null,
    })
  }
}
