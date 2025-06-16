import Router from "@koa/router"
import * as controller from "../controllers/licenseFlags"

const router: Router = new Router()

router.patch("/api/license-flags", controller.override)

export = router
