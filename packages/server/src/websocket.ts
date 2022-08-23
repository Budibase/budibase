import { Server } from "socket.io"
import http from "http"

export class Websocket {
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
