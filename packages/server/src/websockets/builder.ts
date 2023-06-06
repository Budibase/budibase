import authorized from "../middleware/authorized"
import { BaseSocket } from "./websocket"
import { permissions, events } from "@budibase/backend-core"
import http from "http"
import Koa from "koa"
import { Datasource, Table, SocketSession, ContextUser } from "@budibase/types"
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

      // Reply with all users in current room
      const sessions = await this.getRoomSessions(appId)
      callback({ users: sessions })

      // Track usage
      await events.user.dataCollaboration(sessions.length)
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

  emitTableUpdate(ctx: any, table: Table) {
    this.emitToRoom(ctx, ctx.appId, BuilderSocketEvent.TableChange, {
      id: table._id,
      table,
    })
    gridSocket?.emitTableUpdate(ctx, table)
  }

  emitTableDeletion(ctx: any, id: string) {
    this.emitToRoom(ctx, ctx.appId, BuilderSocketEvent.TableChange, {
      id,
      table: null,
    })
    gridSocket?.emitTableDeletion(ctx, id)
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
}
