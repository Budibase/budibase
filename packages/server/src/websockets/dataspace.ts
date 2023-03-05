import authorized from "../middleware/authorized"
import Socket from "./websocket"
import { permissions } from "@budibase/backend-core"
import http from "http"
import Koa from "koa"

export default class DataspaceSocket extends Socket {
  constructor(app: Koa, server: http.Server) {
    super(app, server, "/socket/dataspace", [authorized(permissions.BUILDER)])

    this.io.on("connection", socket => {
      const user = socket.data.user
      console.log(`Dataspace user connected: ${user?._id}`)

      // Initial identification of conneted dataspace
      socket.on("identify", async (tableId, callback) => {
        socket.join(tableId)

        const sockets = await this.io.in(tableId).fetchSockets()
        callback(sockets.map(socket => socket.data.user))
      })

      // Disconnection cleanup
      socket.on("disconnect", reason => {
        console.log(`Disconnecting ${user.email} because of ${reason}`)
      })
    })
  }
}
