import Router from "@koa/router"
import * as controller from "../../controllers/global/tenant"
import cloudRestricted from "../../../middleware/cloudRestricted"

const router: Router = new Router()

router
  .post("/api/global/tenant", cloudRestricted, controller.save)
  .get("/api/global/tenant/:id", controller.get)

export default router
