import authorized from "../middleware/authorized"
import currentApp from "../middleware/currentapp"
import { BaseSocket } from "./websocket"
import { auth, permissions } from "@budibase/backend-core"
import http from "http"
import Koa from "koa"
import { getTableId } from "../api/controllers/row/utils"
import { Row, Table } from "@budibase/types"
import { Socket } from "socket.io"
import { GridSocketEvent } from "@budibase/shared-core"
import { userAgent } from "koa-useragent"
import { createContext, runMiddlewares } from "./middleware"

const { PermissionType, PermissionLevel } = permissions

export default class GridSocket extends BaseSocket {
  constructor(app: Koa, server: http.Server) {
    super(app, server, "/socket/grid")
  }

  async onConnect(socket: Socket) {
    // Initial identification of connected spreadsheet
    socket.on(
      GridSocketEvent.SelectTable,
      async ({ tableId, appId }, callback) => {
        // Ignore if no table or app specified
        if (!tableId || !appId) {
          socket.disconnect(true)
          return
        }

        // Create context
        const ctx = createContext(this.app, socket, {
          resourceId: tableId,
          appId,
        })

        // Construct full middleware chain to assess permissions
        const middlewares = [
          userAgent,
          auth.buildAuthMiddleware([], {
            publicAllowed: true,
          }),
          currentApp,
          authorized(PermissionType.TABLE, PermissionLevel.READ),
        ]

        // Run all koa middlewares
        try {
          await runMiddlewares(ctx, middlewares, async () => {
            // Middlewares are finished and we have permission
            // Join room for this resource
            const room = `${appId}-${tableId}`
            await this.joinRoom(socket, room)

            // Reply with all users in current room
            const sessions = await this.getRoomSessions(room)
            callback({ users: sessions })
          })
        } catch (error) {
          socket.disconnect(true)
        }
      }
    )

    // Handle users selecting a new cell
    socket.on(GridSocketEvent.SelectCell, ({ cellId }) => {
      this.updateUser(socket, { focusedCellId: cellId })
    })
  }

  async updateUser(socket: Socket, patch: Object) {
    await super.updateUser(socket, {
      gridMetadata: {
        ...socket.data.gridMetadata,
        ...patch,
      },
    })
  }

  emitRowUpdate(ctx: any, row: Row) {
    const tableId = getTableId(ctx)
    const room = `${ctx.appId}-${tableId}`
    this.emitToRoom(ctx, room, GridSocketEvent.RowChange, {
      id: row._id,
      row,
    })
  }

  emitRowDeletion(ctx: any, id: string) {
    const tableId = getTableId(ctx)
    const room = `${ctx.appId}-${tableId}`
    this.emitToRoom(ctx, room, GridSocketEvent.RowChange, { id, row: null })
  }

  emitTableUpdate(ctx: any, table: Table) {
    const room = `${ctx.appId}-${table._id}`
    this.emitToRoom(ctx, room, GridSocketEvent.TableChange, {
      id: table._id,
      table,
    })
  }

  emitTableDeletion(ctx: any, id: string) {
    const room = `${ctx.appId}-${id}`
    this.emitToRoom(ctx, room, GridSocketEvent.TableChange, { id, table: null })
  }
}
