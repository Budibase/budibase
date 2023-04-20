import http from "http"
import Koa from "koa"
import GridSocket from "./grid"
import ClientAppSocket from "./client"

let clientAppSocket: ClientAppSocket
let gridSocket: GridSocket

export const initialise = (app: Koa, server: http.Server) => {
  clientAppSocket = new ClientAppSocket(app, server)
  gridSocket = new GridSocket(app, server)
}

export { clientAppSocket, gridSocket }
