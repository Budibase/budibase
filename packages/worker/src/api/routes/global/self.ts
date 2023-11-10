import Router from "@koa/router"
import * as controller from "../../controllers/global/self"
import { auth } from "@budibase/backend-core"
import { users } from "../validation"

const router: Router = new Router()

router
  .post("/api/global/self/api_key", auth.builderOnly, controller.generateAPIKey)
  .get("/api/global/self/api_key", auth.builderOnly, controller.fetchAPIKey)
  .get("/api/global/self", controller.getSelf)
  .post(
    "/api/global/self",
    users.buildSelfSaveValidation(),
    controller.updateSelf
  )

export default router
