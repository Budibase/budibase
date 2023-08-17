import authorized from "../middleware/authorized"
import currentApp from "../middleware/currentapp"
import { BaseSocket } from "./websocket"
import { auth, permissions } from "@budibase/backend-core"
import http from "http"
import Koa from "koa"
import { getTableId } from "../api/controllers/row/utils"
import { Row, Table, View, ViewV2 } from "@budibase/types"
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
    socket.on(GridSocketEvent.SelectDatasource, async (payload, callback) => {
      const ds = payload.datasource
      const appId = payload.appId
      const resourceId = ds?.type === "table" ? ds?.tableId : ds?.id

      // Ignore if no table or app specified
      if (!resourceId || !appId) {
        socket.disconnect(true)
        return
      }

      // Create context
      const ctx = createContext(this.app, socket, {
        resourceId,
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
          const room = `${appId}-${resourceId}`
          await this.joinRoom(socket, room)

          // Reply with all users in current room
          const sessions = await this.getRoomSessions(room)
          callback({ users: sessions })
        })
      } catch (error) {
        socket.disconnect(true)
      }
    })

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
    const resourceId = ctx.params?.viewId || getTableId(ctx)
    const room = `${ctx.appId}-${resourceId}`
    this.emitToRoom(ctx, room, GridSocketEvent.RowChange, {
      id: row._id,
      row,
    })
  }

  emitRowDeletion(ctx: any, row: Row) {
    const resourceId = ctx.params?.viewId || getTableId(ctx)
    const room = `${ctx.appId}-${resourceId}`
    this.emitToRoom(ctx, room, GridSocketEvent.RowChange, {
      id: row._id,
      row: null,
    })
  }

  emitTableUpdate(ctx: any, table: Table) {
    const room = `${ctx.appId}-${table._id}`
    this.emitToRoom(ctx, room, GridSocketEvent.DatasourceChange, {
      id: table._id,
      datasource: table,
    })
  }

  emitTableDeletion(ctx: any, table: Table) {
    const room = `${ctx.appId}-${table._id}`
    this.emitToRoom(ctx, room, GridSocketEvent.DatasourceChange, {
      id: table._id,
      datasource: null,
    })

    // When the table is deleted we need to notify all views that they have
    // also been deleted
    Object.values(table.views || {})
      .filter((view: View | ViewV2) => (view as ViewV2).version === 2)
      .forEach((view: View | ViewV2) => {
        this.emitViewDeletion(ctx, view as ViewV2)
      })
  }

  emitViewUpdate(ctx: any, view: ViewV2) {
    const room = `${ctx.appId}-${view.id}`
    this.emitToRoom(ctx, room, GridSocketEvent.DatasourceChange, {
      id: view.id,
      datasource: view,
    })
  }

  emitViewDeletion(ctx: any, view: ViewV2) {
    const room = `${ctx.appId}-${view.id}`
    this.emitToRoom(ctx, room, GridSocketEvent.DatasourceChange, {
      id: view.id,
      datasource: null,
    })
  }
}
