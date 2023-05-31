import { Server } from "socket.io"
import http from "http"
import Koa from "koa"
import Cookies from "cookies"
import { userAgent } from "koa-useragent"
import { auth } from "@budibase/backend-core"
import currentApp from "../middleware/currentapp"
import { createAdapter } from "@socket.io/redis-adapter"
import { getSocketPubSubClients } from "../utilities/redis"
import uuid from "uuid"

export default class Socket {
  io: Server

  constructor(
    app: Koa,
    server: http.Server,
    path: string = "/",
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
      currentApp,
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
        headers: socket.request.headers,
        header: socket.request.headers,

        // We don't really care about the path since it will never contain
        // an app ID
        path: "/socket",
      }

      // Run all koa middlewares
      try {
        for (let [idx, middleware] of middlewares.entries()) {
          await middleware(ctx, () => {
            if (idx === middlewares.length - 1) {
              // Middlewares are finished
              // Extract some data from our enriched koa context to persist
              // as metadata for the socket
              // Add user info, including a deterministic color and label
              const { _id, email, firstName, lastName } = ctx.user
              socket.data.user = {
                _id,
                email,
                firstName,
                lastName,
                sessionId: uuid.v4(),
              }

              // Add app ID to help split sockets into rooms
              socket.data.appId = ctx.appId
              next()
            }
          })
        }
      } catch (error: any) {
        next(error)
      }
    })

    // Instantiate redis adapter
    const { pub, sub } = getSocketPubSubClients()
    const opts = { key: `socket.io-${path}` }
    this.io.adapter(createAdapter(pub, sub, opts))
  }

  // Emit an event to all sockets
  emit(event: string, payload: any) {
    this.io.sockets.emit(event, payload)
  }
}
