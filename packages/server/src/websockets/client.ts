import http from "http"
import { permissions } from "@budibase/backend-core"
import Koa from "koa"
import authorized from "../middleware/authorized"
import { BaseSocket } from "./websocket"

export default class ClientAppWebsocket extends BaseSocket {
  constructor(app: Koa, server: http.Server) {
    super(app, server, "/socket/client", [authorized(permissions.BUILDER)])
  }
}
