import Router from "@koa/router"
import * as controller from "../controllers/plugin"
import authorized from "../../middleware/authorized"
import { BUILDER } from "@budibase/backend-core/permissions"

const router = new Router()

router
  .post("/api/plugin/upload", authorized(BUILDER), controller.upload)
  .post("/api/plugin", authorized(BUILDER), controller.create)
  .get("/api/plugin", authorized(BUILDER), controller.fetch)
  .delete("/api/plugin/:pluginId", authorized(BUILDER), controller.destroy)

export default router
