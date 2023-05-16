import authorized from "../middleware/authorized"
import Socket from "./websocket"
import { permissions } from "@budibase/backend-core"
import http from "http"
import Koa from "koa"
import { Table } from "@budibase/types"

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
          id: user.id,
        })
      })

      // Disconnection cleanup
      socket.on("disconnect", () => {
        socket.to(appId).emit("user-disconnect", socket.data.user)
      })
    })
  }

  emitTableUpdate(ctx: any, table: Table) {
    this.io.in(ctx.appId).emit("table-update", { id: table._id, table })
  }

  emitTableDeletion(ctx: any, id: string) {
    this.io.in(ctx.appId).emit("table-update", { id, table: null })
  }
}
