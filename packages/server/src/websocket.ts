import { Server } from "socket.io"
import http from "http"

class Websocket {
  socketServer: Server

  constructor(server: http.Server, path: string) {
    this.socketServer = new Server(server, {
      path,
    })
  }

  // Emit an event to all sockets
  emit(event: string, payload: any) {
    this.socketServer.sockets.emit(event, payload)
  }
}

// Likely to be more socket instances in future
let ClientAppSocket: Websocket

export const initialise = (server: http.Server) => {
  ClientAppSocket = new Websocket(server, "/socket/client")
}

export { ClientAppSocket }
