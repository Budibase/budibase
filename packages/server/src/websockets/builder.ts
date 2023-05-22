import authorized from "../middleware/authorized"
import Socket from "./websocket"
import { permissions } from "@budibase/backend-core"
import http from "http"
import Koa from "koa"
import { Datasource, Table } from "@budibase/types"
import { gridSocket } from "./index"

export default class BuilderSocket extends Socket {
  constructor(app: Koa, server: http.Server) {
    super(app, server, "/socket/builder", [authorized(permissions.BUILDER)])

    this.io.on("connection", socket => {
      // Join a room for this app
      const user = socket.data.user
      const appId = socket.data.appId
      socket.join(appId)
      socket.to(appId).emit("user-update", socket.data.user)
      console.log(`Builder user connected: ${user?.id}`)

      // Initial identification of connected spreadsheet
      socket.on("get-users", async (payload, callback) => {
        const sockets = await this.io.in(appId).fetchSockets()
        callback({
          users: sockets.map(socket => socket.data.user),
        })
      })

      // Disconnection cleanup
      socket.on("disconnect", () => {
        socket.to(appId).emit("user-disconnect", socket.data.user)
      })
    })
  }

  emitTableUpdate(ctx: any, table: Table) {
    this.io.in(ctx.appId).emit("table-change", { id: table._id, table })
    gridSocket.emitTableUpdate(table)
  }

  emitTableDeletion(ctx: any, id: string) {
    this.io.in(ctx.appId).emit("table-change", { id, table: null })
    gridSocket.emitTableDeletion(id)
  }

  emitDatasourceUpdate(ctx: any, datasource: Datasource) {
    this.io
      .in(ctx.appId)
      .emit("datasource-change", { id: datasource._id, datasource })
  }

  emitDatasourceDeletion(ctx: any, id: string) {
    this.io.in(ctx.appId).emit("datasource-change", { id, datasource: null })
  }
}
