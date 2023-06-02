import { io } from "socket.io-client"
import { SocketEvent, SocketSessionTTL } from "@budibase/shared-core"
import { APISessionID } from "../api"

const DefaultOptions = {
  heartbeat: true,
}

export const createWebsocket = (path, options = DefaultOptions) => {
  if (!path) {
    throw "A websocket path must be provided"
  }
  const { heartbeat } = {
    ...DefaultOptions,
    ...options,
  }

  // Determine connection info
  const tls = location.protocol === "https:"
  const proto = tls ? "wss:" : "ws:"
  const host = location.hostname
  const port = location.port || (tls ? 443 : 80)
  let socket = io(`${proto}//${host}:${port}`, {
    path,
    // Cap reconnection attempts to 3 (total of 15 seconds before giving up)
    reconnectionAttempts: 3,
    // Delay reconnection attempt by 5 seconds
    reconnectionDelay: 5000,
    reconnectionDelayMax: 5000,
    // Timeout after 4 seconds so we never stack requests
    timeout: 4000,
    // Disable polling and rely on websocket only, as HTTP transport
    // will only work with sticky sessions which we don't have
    transports: ["websocket"],
  })

  // Set up a heartbeat that's half of the session TTL
  let interval
  if (heartbeat) {
    interval = setInterval(() => {
      socket.emit(SocketEvent.Heartbeat)
    }, SocketSessionTTL * 500)
  }

  socket.on("disconnect", () => {
    clearInterval(interval)
  })

  // Helper utility to ignore events that were triggered due to API
  // changes made by us
  socket.onOther = (event, callback) => {
    socket.on(event, data => {
      if (data?.apiSessionId !== APISessionID) {
        callback(data)
      }
    })
  }

  return socket
}
