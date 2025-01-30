import authorized from "../middleware/authorized"
import currentApp from "../middleware/currentapp"
import { BaseSocket } from "./websocket"
import { auth, permissions, context } from "@budibase/backend-core"
import http from "http"
import Koa from "koa"
import { getSourceId } from "../api/controllers/row/utils"
import { Row, Table, View, ViewV2 } from "@budibase/types"
import { Socket } from "socket.io"
import { GridSocketEvent } from "@budibase/shared-core"
import { userAgent } from "koa-useragent"
import { createContext, runMiddlewares } from "./middleware"
import sdk from "../sdk"
import {
  findHBSBlocks,
  isJSBinding,
  decodeJSBinding,
} from "@budibase/string-templates"

const { PermissionType, PermissionLevel } = permissions

export default class GridSocket extends BaseSocket {
  constructor(app: Koa, server: http.Server) {
    super(app, server, "/socket/grid")
  }

  // Checks if a view's query contains any current user bindings
  containsCurrentUserBinding(view: ViewV2): boolean {
    return findHBSBlocks(JSON.stringify(view.query))
      .map(binding => {
        const sanitizedBinding = binding.replace(/\\"/g, '"')
        if (isJSBinding(sanitizedBinding)) {
          return decodeJSBinding(sanitizedBinding)
        } else {
          return sanitizedBinding
        }
      })
      .some(binding => binding?.includes("[user]"))
  }

  async onConnect(socket: Socket) {
    // Initial identification of connected spreadsheet
    socket.on(GridSocketEvent.SelectDatasource, async (payload, callback) => {
      const ds = payload.datasource
      const appId = payload.appId
      const resourceId = ds?.type === "table" ? ds?.tableId : ds?.id
      let valid = true

      // Validate datasource
      if (!resourceId || !appId) {
        // Ignore if no table or app specified
        valid = false
      } else if (ds.type === "viewV2") {
        // If this is a view filtered by current user, don't sync changes
        try {
          await context.doInAppContext(appId, async () => {
            const view = await sdk.views.get(ds.id)
            if (this.containsCurrentUserBinding(view)) {
              valid = false
            }
          })
        } catch (err) {
          valid = false
        }
      }
      if (!valid) {
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

  async updateUser(socket: Socket, patch: object) {
    await super.updateUser(socket, {
      gridMetadata: {
        ...socket.data.gridMetadata,
        ...patch,
      },
    })
  }

  emitRowUpdate(ctx: any, row: Row) {
    const source = getSourceId(ctx)
    const resourceId = source.viewId ?? source.tableId
    const room = `${ctx.appId}-${resourceId}`
    this.emitToRoom(ctx, room, GridSocketEvent.RowChange, {
      id: row._id,
      row,
    })
  }

  emitRowDeletion(ctx: any, row: Row) {
    const source = getSourceId(ctx)
    const resourceId = source.viewId ?? source.tableId
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
