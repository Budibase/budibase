import { Server } from "socket.io"
import http from "http"
import Koa from "koa"
import Cookies from "cookies"
import { userAgent } from "koa-useragent"
import { auth } from "@budibase/backend-core"
import currentApp from "../middleware/currentapp"
import { createAdapter } from "@socket.io/redis-adapter"
import { Socket } from "socket.io"
import {
  getSocketPubSubClients,
  getSocketUsers,
  setSocketUsers,
} from "../utilities/redis"
import { SocketEvents } from "@budibase/shared-core"
import { SocketUser } from "@budibase/types"

export class BaseSocket {
  io: Server
  path: string

  constructor(
    app: Koa,
    server: http.Server,
    path: string = "/",
    additionalMiddlewares?: any[]
  ) {
    this.path = path
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
              const { _id, email, firstName, lastName } = ctx.user
              socket.data = {
                _id,
                email,
                firstName,
                lastName,
                appId: ctx.appId,
                sessionId: socket.id,
              }
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

    // Handle user connections and disconnections
    this.io.on("connection", async socket => {
      // Add built in handler to allow fetching all other users in this room
      socket.on(SocketEvents.GetUsers, async (payload, callback) => {
        let users
        if (socket.data.room) {
          users = await this.getSocketUsers(socket.data.room)
        }
        callback({ users })
      })

      // Add handlers for this socket
      await this.onConnect(socket)

      // Add early disconnection handler to clean up and leave room
      socket.on("disconnect", async () => {
        // Leave the current room when the user disconnects if we're in one
        if (socket.data.room) {
          await this.leaveRoom(socket)
        }

        // Run any other disconnection logic
        await this.onDisconnect(socket)
      })
    })
  }

  // Gets a list of all users inside a certain room
  async getSocketUsers(room?: string): Promise<SocketUser[]> {
    if (room) {
      const users = await getSocketUsers(this.path, room)
      return users || []
    } else {
      return []
    }
  }

  // Adds a user to a certain room
  async joinRoom(socket: Socket, room: string) {
    // Check if we're already in a room, as we'll need to leave if we are before we
    // can join a different room
    const oldRoom = socket.data.room
    if (oldRoom && oldRoom !== room) {
      await this.leaveRoom(socket)
    }

    // Join new room
    if (!oldRoom || oldRoom !== room) {
      socket.join(room)
      socket.data.room = room
    }

    // @ts-ignore
    let user: SocketUser = socket.data
    let users = await this.getSocketUsers(room)

    // Store this socket in redis
    if (!users?.length) {
      users = []
    }
    const index = users.findIndex(x => x.sessionId === socket.data.sessionId)
    if (index === -1) {
      users.push(user)
    } else {
      users[index] = user
    }
    await setSocketUsers(this.path, room, users)
    socket.to(room).emit(SocketEvents.UserUpdate, user)
  }

  // Disconnects a socket from its current room
  async leaveRoom(socket: Socket) {
    // @ts-ignore
    let user: SocketUser = socket.data
    const { room, sessionId } = user
    if (!room) {
      return
    }
    socket.leave(room)
    socket.data.room = undefined

    let users = await this.getSocketUsers(room)

    // Remove this socket from redis
    users = users.filter(user => user.sessionId !== sessionId)
    await setSocketUsers(this.path, room, users)
    socket.to(room).emit(SocketEvents.UserDisconnect, user)
  }

  // Updates a connected user's metadata, assuming a room change is not required.
  async updateUser(socket: Socket, patch: Object) {
    socket.data = {
      ...socket.data,
      ...patch,
    }

    // If we're in a room, notify others of this change and update redis
    if (socket.data.room) {
      await this.joinRoom(socket, socket.data.room)
    }
  }

  async onConnect(socket: Socket) {
    // Override
  }

  async onDisconnect(socket: Socket) {
    // Override
  }

  // Emit an event to all sockets
  emit(event: string, payload: any) {
    this.io.sockets.emit(event, payload)
  }
}
