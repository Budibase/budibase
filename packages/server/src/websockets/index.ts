import http from "http"
import Koa from "koa"
import DataspaceSocket from "./dataspace"
import ClientAppSocket from "./client"

let clientAppSocket: ClientAppSocket
let dataspaceSocket: DataspaceSocket

export const initialise = (app: Koa, server: http.Server) => {
  clientAppSocket = new ClientAppSocket(app, server)
  dataspaceSocket = new DataspaceSocket(app, server)
}

export { clientAppSocket, dataspaceSocket }
