import authorized from "../middleware/authorized"
import { BaseSocket } from "./websocket"
import { permissions } from "@budibase/backend-core"
import http from "http"
import Koa from "koa"
import { Datasource, Table, SocketUser, ContextUser } from "@budibase/types"
import { gridSocket } from "./index"
import { clearLock } from "../utilities/redis"
import { Socket } from "socket.io"
import { BuilderSocketEvents } from "@budibase/shared-core"

export default class BuilderSocket extends BaseSocket {
  constructor(app: Koa, server: http.Server) {
    super(app, server, "/socket/builder", [authorized(permissions.BUILDER)])
  }

  async onConnect(socket: Socket) {
    // Join a room for this app
    await this.joinRoom(socket, socket.data.appId)
  }

  async onDisconnect(socket: Socket) {
    // Remove app lock from this user if they have no other connections
    try {
      // @ts-ignore
      const user: SocketUser = socket.data
      const { _id, sessionId, appId } = user
      const users = await this.getSocketUsers(user.room)
      const hasOtherConnection = users.some(otherUser => {
        return _id === otherUser._id && sessionId !== otherUser.sessionId
      })
      if (!hasOtherConnection) {
        // @ts-ignore
        const user: ContextUser = { _id: socket.data._id }
        await clearLock(appId, user)
      }
    } catch (e) {
      // This is fine, just means this user didn't hold the lock
    }
  }

  emitTableUpdate(ctx: any, table: Table) {
    this.io
      .in(ctx.appId)
      .emit(BuilderSocketEvents.TableChange, { id: table._id, table })
    gridSocket.emitTableUpdate(table)
  }

  emitTableDeletion(ctx: any, id: string) {
    this.io
      .in(ctx.appId)
      .emit(BuilderSocketEvents.TableChange, { id, table: null })
    gridSocket.emitTableDeletion(id)
  }

  emitDatasourceUpdate(ctx: any, datasource: Datasource) {
    this.io
      .in(ctx.appId)
      .emit(BuilderSocketEvents.DatasourceChange, {
        id: datasource._id,
        datasource,
      })
  }

  emitDatasourceDeletion(ctx: any, id: string) {
    this.io
      .in(ctx.appId)
      .emit(BuilderSocketEvents.DatasourceChange, { id, datasource: null })
  }
}
