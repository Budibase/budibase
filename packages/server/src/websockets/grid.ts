import authorized from "../middleware/authorized"
import { BaseSocket } from "./websocket"
import { permissions } from "@budibase/backend-core"
import http from "http"
import Koa from "koa"
import { getTableId } from "../api/controllers/row/utils"
import { Row, Table } from "@budibase/types"
import { Socket } from "socket.io"
import { GridSocketEvent } from "@budibase/shared-core"

export default class GridSocket extends BaseSocket {
  constructor(app: Koa, server: http.Server) {
    super(app, server, "/socket/grid", [authorized(permissions.BUILDER)])
  }

  async onConnect(socket: Socket) {
    // Initial identification of connected spreadsheet
    socket.on(GridSocketEvent.SelectTable, async ({ tableId }, callback) => {
      await this.joinRoom(socket, tableId)

      // Reply with all users in current room
      const sessions = await this.getRoomSessions(tableId)
      callback({ users: sessions })
    })

    // Handle users selecting a new cell
    socket.on(GridSocketEvent.SelectCell, ({ cellId }) => {
      this.updateUser(socket, { focusedCellId: cellId })
    })
  }

  emitRowUpdate(ctx: any, row: Row) {
    const tableId = getTableId(ctx)
    this.emitToRoom(ctx, tableId, GridSocketEvent.RowChange, {
      id: row._id,
      row,
    })
  }

  emitRowDeletion(ctx: any, id: string) {
    const tableId = getTableId(ctx)
    this.emitToRoom(ctx, tableId, GridSocketEvent.RowChange, { id, row: null })
  }

  emitTableUpdate(ctx: any, table: Table) {
    this.emitToRoom(ctx, table._id!, GridSocketEvent.TableChange, {
      id: table._id,
      table,
    })
  }

  emitTableDeletion(ctx: any, id: string) {
    this.emitToRoom(ctx, id, GridSocketEvent.TableChange, { id, table: null })
  }
}
