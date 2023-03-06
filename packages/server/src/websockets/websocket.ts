import { Server } from "socket.io"
import http from "http"
import Koa from "koa"
import Cookies from "cookies"
import { userAgent } from "koa-useragent"
import { auth } from "@budibase/backend-core"

export default class Socket {
  io: Server

  constructor(
    app: Koa,
    server: http.Server,
    path: string,
    additionalMiddlewares?: any[]
  ) {
    this.io = new Server(server, {
      path,
    })

    // Attach default middlewares
    const authenticate = auth.buildAuthMiddleware([], {
      publicAllowed: true,
    })
    const middlewares = [
      userAgent,
      authenticate,
      ...(additionalMiddlewares || []),
    ]

    // Apply middlewares
    this.io.use(async (socket, next) => {
      // Build fake koa context
      const res = new http.ServerResponse(socket.request)
      const ctx: any = {
        ...app.createContext(socket.request, res),

        // Additional overrides needed to make our middlewares work with this
        // fake koa context
        cookies: new Cookies(socket.request, res),
        get: (field: string) => socket.request.headers[field],
        throw: (code: number, message: string) => {
          throw new Error(message)
        },

        // Needed for koa-useragent middleware
        header: socket.request.headers,
      }

      // Run all koa middlewares
      try {
        for (let [idx, middleware] of middlewares.entries()) {
          await middleware(ctx, () => {
            if (idx === middlewares.length - 1) {
              // Middlewares are finished.
              // Extract some data from our enriched koa context to persist
              // as metadata for the socket
              socket.data.user = {
                id: ctx.user._id,
                email: ctx.user.email,
                selectedCellId: null,
              }
              next()
            }
          })
        }
      } catch (error: any) {
        next(error)
      }
    })
  }

  // Emit an event to all sockets
  emit(event: string, payload: any) {
    this.io.sockets.emit(event, payload)
  }
}
