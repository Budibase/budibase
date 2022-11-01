import Router from "@koa/router"
import * as controller from "../controllers/webhook"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import { webhookValidator } from "./utils/validators"

const BUILDER = permissions.BUILDER
const router: Router = new Router()

router
  .get("/api/webhooks", authorized(BUILDER), controller.fetch)
  .put(
    "/api/webhooks",
    authorized(BUILDER),
    webhookValidator(),
    controller.save
  )
  .delete("/api/webhooks/:id/:rev", authorized(BUILDER), controller.destroy)
  .post(
    "/api/webhooks/schema/:instance/:id",
    authorized(BUILDER),
    controller.buildSchema
  )
  // this shouldn't have authorisation, right now its always public
  .post("/api/webhooks/trigger/:instance/:id", controller.trigger)

export default router
