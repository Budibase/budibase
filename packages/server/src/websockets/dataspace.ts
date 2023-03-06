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
      console.log(`Dataspace user connected: ${user?.id}`)

      // Socket state
      let currentRoom: string

      // Initial identification of conneted dataspace
      socket.on("select-dataspace", async (tableId, callback) => {
        if (currentRoom) {
          socket.leave(currentRoom)
        }
        socket.join(tableId)
        currentRoom = tableId
        const sockets = await this.io.in(tableId).fetchSockets()
        socket.broadcast.emit("user-update", socket.data.user)

        callback({
          users: sockets.map(socket => socket.data.user),
          id: user.id,
        })
      })

      socket.on("select-cell", cellId => {
        console.log("cell update for " + user.id + " to " + cellId)
        socket.data.user.selectedCellId = cellId
        socket.broadcast.emit("user-update", socket.data.user)
      })

      // Disconnection cleanup
      socket.on("disconnect", reason => {
        console.log(`Disconnecting ${user.email} because of ${reason}`)
      })
    })
  }
}
