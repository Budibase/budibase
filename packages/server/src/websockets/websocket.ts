import { Server, Socket } from "socket.io"
import http from "http"
import Koa from "koa"
import { userAgent } from "koa-useragent"
import { auth, Header, redis } from "@budibase/backend-core"
import { createAdapter } from "@socket.io/redis-adapter"
import { getSocketPubSubClients } from "../utilities/redis"
import { SocketEvent, SocketSessionTTL } from "@budibase/shared-core"
import { SocketSession } from "@budibase/types"
import { v4 as uuid } from "uuid"
import { createContext, runMiddlewares } from "./middleware"

export interface EmitOptions {
  // Whether to include the originator of the request from the broadcast,
  // defaults to false because it is assumed that the user who triggered
  // an action will already have the changes of that action reflected in their
  // own UI, so there is no need to send them again.
  includeOriginator?: boolean
}

const anonUser = () => ({
  _id: uuid(),
  email: "user@mail.com",
  firstName: "Anonymous",
})

export class BaseSocket {
  app: Koa
  io: Server
  path: string
  redisClient?: redis.Client

  constructor(
    app: Koa,
    server: http.Server,
    path = "/",
    additionalMiddlewares?: any[]
  ) {
    this.app = app
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
      ...(additionalMiddlewares || []),
    ]

    // Apply middlewares
    this.io.use(async (socket, next) => {
      const ctx = createContext(this.app, socket)

      try {
        await runMiddlewares(ctx, middlewares, async () => {
          // Middlewares are finished
          // Extract some data from our enriched koa context to persist
          // as metadata for the socket
          const user = ctx.user?._id ? ctx.user : anonUser()
          const { _id, email, firstName, lastName } = user
          socket.data = {
            _id,
            email,
            firstName,
            lastName,
            sessionId: socket.id,
            connectedAt: Date.now(),
          }
          next()
        })
      } catch (error: any) {
        next(error)
      }
    })

    // Initialise redis before handling connections
    this.initialise().then(() => {
      this.io.on("connection", async socket => {
        // Add built in handler for heartbeats
        socket.on(SocketEvent.Heartbeat, async () => {
          await this.extendSessionTTL(socket.data.sessionId)
        })

        // Add early disconnection handler to clean up and leave room
        socket.on("disconnect", async () => {
          // Run any custom disconnection logic before we leave the room,
          // so that we have access to their room etc before disconnection
          await this.onDisconnect(socket)

          // Leave the current room when the user disconnects if we're in one
          await this.leaveRoom(socket)
        })

        // Add handlers for this socket
        await this.onConnect(socket)
      })
    })
  }

  async initialise() {
    // Instantiate redis adapter.
    // We use a fully qualified key name here as this bypasses the normal
    // redis client#s key prefixing.
    const { pub, sub } = getSocketPubSubClients()
    const opts = {
      key: `${redis.utils.Databases.SOCKET_IO}-${this.path}-pubsub`,
    }
    this.io.adapter(createAdapter(pub, sub, opts))

    // Fetch redis client
    this.redisClient = await redis.clients.getSocketClient()
  }

  // Gets the redis key for a certain session ID
  getSessionKey(sessionId: string) {
    return `${this.path}-session:${sessionId}`
  }

  // Gets the redis key for certain room name
  getRoomKey(room: string) {
    return `${this.path}-room:${room}`
  }

  async extendSessionTTL(sessionId: string) {
    const key = this.getSessionKey(sessionId)
    await this.redisClient?.setExpiry(key, SocketSessionTTL)
  }

  // Gets an array of all redis keys of users inside a certain room
  async getRoomSessionIds(room: string | string[]): Promise<string[]> {
    if (Array.isArray(room)) {
      const roomKeys = room.map(this.getRoomKey.bind(this))
      const roomSessionIdMap = await this.redisClient?.bulkGet(roomKeys)
      let sessionIds: any[] = []
      Object.values(roomSessionIdMap || {}).forEach(roomSessionIds => {
        sessionIds = sessionIds.concat(roomSessionIds)
      })
      return sessionIds
    } else {
      return (await this.redisClient?.get(this.getRoomKey(room))) || []
    }
  }

  // Sets the list of redis keys for users inside a certain room.
  // There is no TTL on the actual room key map itself.
  async setRoomSessionIds(room: string, ids: string[]) {
    await this.redisClient?.store(this.getRoomKey(room), ids)
  }

  // Gets a list of all users inside a certain room
  async getRoomSessions(room?: string | string[]): Promise<SocketSession[]> {
    if (room) {
      const sessionIds = await this.getRoomSessionIds(room)
      const keys = sessionIds.map(this.getSessionKey.bind(this))
      const sessions = await this.redisClient?.bulkGet<SocketSession>(keys)
      return Object.values(sessions || {})
    } else {
      return []
    }
  }

  // Detects keys which have been pruned from redis due to TTL expiry in a certain
  // room and broadcasts disconnection messages to ensure clients are aware
  async pruneRoom(room: string) {
    const sessionIds = await this.getRoomSessionIds(room)
    const sessionsExist = await Promise.all(
      sessionIds.map(id => this.redisClient?.exists(this.getSessionKey(id)))
    )
    const prunedSessionIds = sessionIds.filter((id, idx) => {
      if (!sessionsExist[idx]) {
        this.io.to(room).emit(SocketEvent.UserDisconnect, {
          sessionId: sessionIds[idx],
        })
        return false
      }
      return true
    })

    // Store new pruned keys
    await this.setRoomSessionIds(room, prunedSessionIds)
  }

  // Adds a user to a certain room
  async joinRoom(socket: Socket, room: string) {
    if (!room) {
      return
    }
    // Prune room before joining
    await this.pruneRoom(room)

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

    // Store in redis
    // @ts-ignore
    let user: SocketSession = socket.data
    const { sessionId } = user
    const key = this.getSessionKey(sessionId)
    await this.redisClient?.store(key, user, SocketSessionTTL)
    const sessionIds = await this.getRoomSessionIds(room)
    if (!sessionIds.includes(sessionId)) {
      await this.setRoomSessionIds(room, [...sessionIds, sessionId])
    }

    // Notify other users
    socket.to(room).emit(SocketEvent.UserUpdate, {
      user,
    })
  }

  // Disconnects a socket from its current room
  async leaveRoom(socket: Socket) {
    // @ts-ignore
    let user: SocketSession = socket.data
    const { room, sessionId } = user
    if (!room) {
      return
    }

    // Leave room
    socket.leave(room)
    socket.data.room = undefined

    // Delete from redis
    const key = this.getSessionKey(sessionId)
    await this.redisClient?.delete(key)
    const sessionIds = await this.getRoomSessionIds(room)
    await this.setRoomSessionIds(
      room,
      sessionIds.filter(id => id !== sessionId)
    )

    // Notify other users
    socket.to(room).emit(SocketEvent.UserDisconnect, { sessionId })
  }

  // Updates a connected user's metadata, assuming a room change is not required.
  async updateUser(socket: Socket, patch: object) {
    socket.data = {
      ...socket.data,
      ...patch,
    }

    // If we're in a room, notify others of this change and update redis
    if (socket.data.room) {
      await this.joinRoom(socket, socket.data.room)
    }
  }

  async onConnect(_socket: Socket) {
    // Override
  }

  async onDisconnect(_socket: Socket) {
    // Override
  }

  // Emit an event to all sockets
  emit(event: string, payload: any) {
    this.io.sockets.emit(event, payload)
  }

  // Emit an event to everyone in a room, including metadata of whom
  // the originator of the request was
  emitToRoom(
    ctx: any,
    room: string | string[],
    event: string,
    payload: any,
    options?: EmitOptions
  ) {
    let emitPayload = { ...payload }
    if (!options?.includeOriginator) {
      emitPayload.apiSessionId = ctx.headers?.[Header.SESSION_ID]
    }
    this.io.in(room).emit(event, emitPayload)
  }
}
