import authorized from "../middleware/authorized"
import Socket from "./websocket"
import { permissions } from "@budibase/backend-core"
import http from "http"
import Koa from "koa"
import { getTableId } from "../api/controllers/row/utils"
import { Row, Table } from "@budibase/types"

export default class GridSocket extends Socket {
  constructor(app: Koa, server: http.Server) {
    super(app, server, "/socket/grid", [authorized(permissions.BUILDER)])

    this.io.on("connection", socket => {
      const user = socket.data.user

      // Socket state
      let currentRoom: string

      // Initial identification of connected spreadsheet
      socket.on("select-table", async (tableId, callback) => {
        // Leave current room
        if (currentRoom) {
          socket.to(currentRoom).emit("user-disconnect", user)
          socket.leave(currentRoom)
        }

        // Join new room
        currentRoom = tableId
        socket.join(currentRoom)
        socket.to(currentRoom).emit("user-update", user)

        // Reply with all users in current room
        const sockets = await this.io.in(currentRoom).fetchSockets()
        callback({
          users: sockets.map(socket => socket.data.user),
        })
      })

      // Handle users selecting a new cell
      socket.on("select-cell", cellId => {
        socket.data.user.focusedCellId = cellId
        if (currentRoom) {
          socket.to(currentRoom).emit("user-update", user)
        }
      })

      // Disconnection cleanup
      socket.on("disconnect", () => {
        if (currentRoom) {
          socket.to(currentRoom).emit("user-disconnect", user)
        }
      })
    })
  }

  emitRowUpdate(ctx: any, row: Row) {
    const tableId = getTableId(ctx)
    this.io.in(tableId).emit("row-change", { id: row._id, row })
  }

  emitRowDeletion(ctx: any, id: string) {
    const tableId = getTableId(ctx)
    this.io.in(tableId).emit("row-change", { id, row: null })
  }

  emitTableUpdate(table: Table) {
    this.io.in(table._id!).emit("table-change", { id: table._id, table })
  }

  emitTableDeletion(id: string) {
    this.io.in(id).emit("table-change", { id, table: null })
  }
}
