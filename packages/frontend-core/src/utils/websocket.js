import { io } from "socket.io-client"

export const createWebsocket = path => {
  if (!path) {
    throw "A websocket path must be provided"
  }

  // Determine connection info
  const tls = location.protocol === "https:"
  const proto = tls ? "wss:" : "ws:"
  const host = location.hostname
  const port = location.port || (tls ? 443 : 80)
  return io(`${proto}//${host}:${port}`, {
    path,
    // Cap reconnection attempts to 3 (total of 15 seconds before giving up)
    reconnectionAttempts: 3,
    // Delay reconnection attempt by 5 seconds
    reconnectionDelay: 5000,
    reconnectionDelayMax: 5000,
    // Timeout after 4 seconds so we never stack requests
    timeout: 4000,
  })
}
