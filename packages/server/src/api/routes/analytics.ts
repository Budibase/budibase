import Router from "@koa/router"
import * as controller from "../controllers/analytics"
import { EndpointGroup } from "../utils"

const group = new EndpointGroup()

group.get("/api/bbtel", controller.isEnabled)
group.post("/api/bbtel/ping", controller.ping)

const router: Router = group.apply()

export default router
