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

      // Initial identification of connected dataspace
      socket.on("select-dataspace", async (tableId, callback) => {
        // Leave current room
        if (currentRoom) {
          socket.to(currentRoom).emit("user-disconnect", socket.data.user)
          socket.leave(currentRoom)
        }

        // Join new room
        currentRoom = tableId
        socket.join(currentRoom)
        socket.to(currentRoom).emit("user-update", socket.data.user)

        // Reply with all users in current room
        const sockets = await this.io.in(currentRoom).fetchSockets()
        callback({
          users: sockets.map(socket => socket.data.user),
          id: user.id,
        })
      })

      // Handle users selecting a new cell
      socket.on("select-cell", cellId => {
        socket.data.user.selectedCellId = cellId
        if (currentRoom) {
          socket.to(currentRoom).emit("user-update", socket.data.user)
        }
      })

      // Disconnection cleanup
      socket.on("disconnect", () => {
        if (currentRoom) {
          socket.to(currentRoom).emit("user-disconnect", socket.data.user)
        }
      })
    })
  }
}
