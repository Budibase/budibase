import SocketIO from "socket.io"

export class Websocket {
  socketIO: any

  constructor(server: any, path: string) {
    // @ts-ignore
    this.socketIO = SocketIO(server, {
      path,
      cors: {
        origin: "*",
      },
    })
  }

  // Emit an event to all sockets
  emit(event: string, payload: any) {
    this.socketIO.sockets.emit(event, payload)
  }
}
