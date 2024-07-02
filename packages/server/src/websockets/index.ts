import http from "http"
import Koa from "koa"
import ClientAppSocket from "./client"
import GridSocket from "./grid"
import BuilderSocket from "./builder"

let clientAppSocket: ClientAppSocket | undefined
let gridSocket: GridSocket | undefined
let builderSocket: BuilderSocket | undefined

export const initialise = (app: Koa, server: http.Server) => {
  clientAppSocket = new ClientAppSocket(app, server)
  gridSocket = new GridSocket(app, server)
  builderSocket = new BuilderSocket(app, server)
}

export { clientAppSocket, gridSocket, builderSocket }
