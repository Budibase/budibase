import { BaseSocket } from "./websocket"
import authorized from "../middleware/authorized"
import type http from "http"
import type Koa from "koa"
import { permissions } from "@budibase/backend-core"

export default class ClientAppWebsocket extends BaseSocket {
  constructor(app: Koa, server: http.Server) {
    super(app, server, "/socket/client", [authorized(permissions.BUILDER)])
  }
}
