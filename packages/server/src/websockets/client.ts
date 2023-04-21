import Socket from "./websocket"
import authorized from "../middleware/authorized"
import http from "http"
import Koa from "koa"
import { permissions } from "@budibase/backend-core"

export default class ClientAppWebsocket extends Socket {
  constructor(app: Koa, server: http.Server) {
    super(app, server, "/socket/client", [authorized(permissions.BUILDER)])
  }
}
