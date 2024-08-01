import Router from "@koa/router"
import * as controller from "../../controllers/global/assets"
import { auth } from "@budibase/backend-core"

const router: Router = new Router()

router
  .post("/api/global/assets/upload", auth.builderOrAdmin, controller.upload)
  .get("/api/global/assets", auth.builderOrAdmin, controller.fetch)
  .delete(
    "/api/global/assets/:filename",
    auth.builderOrAdmin,
    controller.destroy
  )

export default router
