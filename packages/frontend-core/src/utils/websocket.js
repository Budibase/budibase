import { io } from "socket.io-client"
import { SocketEvents, SocketSessionTTL } from "@budibase/shared-core"

export const createWebsocket = (path, heartbeat = true) => {
  if (!path) {
    throw "A websocket path must be provided"
  }

  // Determine connection info
  const tls = location.protocol === "https:"
  const proto = tls ? "wss:" : "ws:"
  const host = location.hostname
  const port = location.port || (tls ? 443 : 80)
  const socket = io(`${proto}//${host}:${port}`, {
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
      console.log("Sending heartbeat")
      socket.emit(SocketEvents.Heartbeat)
    }, SocketSessionTTL * 500)
  }

  socket.on("disconnect", () => {
    console.log("clear interval")
    clearInterval(interval)
  })

  return socket
}
