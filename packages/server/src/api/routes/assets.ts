import { addFileManagement } from "../utils"
import { serveBuilderAssets } from "../controllers/assets"
import Router from "@koa/router"

const router: Router = new Router()

addFileManagement(router)

router.get("/builder", serveBuilderAssets)
router.get("/builder/*file", serveBuilderAssets)
router.get("/apps", serveBuilderAssets)
router.get("/requests", serveBuilderAssets)
router.get("/requests/*path", serveBuilderAssets)

export default router
