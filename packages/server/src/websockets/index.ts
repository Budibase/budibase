import http from "http"
import Koa from "koa"
import SpreadsheetSocket from "./spreadsheet"
import ClientAppSocket from "./client"

let clientAppSocket: ClientAppSocket
let spreadsheetSocket: SpreadsheetSocket

export const initialise = (app: Koa, server: http.Server) => {
  clientAppSocket = new ClientAppSocket(app, server)
  spreadsheetSocket = new SpreadsheetSocket(app, server)
}

export { clientAppSocket, spreadsheetSocket }
