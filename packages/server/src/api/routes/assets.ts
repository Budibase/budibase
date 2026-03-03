import { addFileManagement } from "../utils"
import { serveAppMfeAssets, serveBuilderAssets } from "../controllers/assets"
import Router from "@koa/router"

const router: Router = new Router()

addFileManagement(router)

router.get("/builder", serveBuilderAssets)
router.get("/builder/*file", serveBuilderAssets)
router.get("/app/mfe", serveAppMfeAssets)
router.get("/app/mfe/*file", serveAppMfeAssets)

export default router
