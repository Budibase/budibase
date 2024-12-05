import Router from "@koa/router"
import { auth, middleware, env as envCore } from "@budibase/backend-core"
import currentApp from "../middleware/currentapp"
import cleanup from "../middleware/cleanup"
import zlib from "zlib"
import { mainRoutes, staticRoutes, publicRoutes } from "./routes"
import { middleware as pro } from "@budibase/pro"
import { apiEnabled, automationsEnabled } from "../features"
import migrations from "../middleware/appMigrations"
import { automationQueue } from "../automations"

export { shutdown } from "./routes/public"
const compress = require("koa-compress")

export const router: Router = new Router()

router.get("/health", async ctx => {
  if (automationsEnabled()) {
    if (!(await automationQueue.isReady())) {
      ctx.status = 503
      return
    }
  }
  ctx.status = 200
})
router.get("/version", ctx => (ctx.body = envCore.VERSION))

router.use(middleware.errorHandling)

// only add the routes if they are enabled
if (apiEnabled()) {
  router
    .use(
      compress({
        threshold: 2048,
        gzip: {
          flush: zlib.constants.Z_SYNC_FLUSH,
        },
        deflate: {
          flush: zlib.constants.Z_SYNC_FLUSH,
        },
        br: false,
      })
    )
    // re-direct before any middlewares occur
    .redirect("/", "/builder")
    .use(
      auth.buildAuthMiddleware([], {
        publicAllowed: true,
      })
    )
    // nothing in the server should allow query string tenants
    // the server can be public anywhere, so nowhere should throw errors
    // if the tenancy has not been set, it'll have to be discovered at application layer
    .use(
      auth.buildTenancyMiddleware([], [], {
        noTenancyRequired: true,
      })
    )
    .use(pro.licensing())
    .use(currentApp)
    .use(auth.auditLog)
    .use(migrations)
    .use(cleanup)

  // authenticated routes
  for (let route of mainRoutes) {
    router.use(route.routes())
    router.use(route.allowedMethods())
  }

  router.use(publicRoutes.routes())
  router.use(publicRoutes.allowedMethods())

  // WARNING - static routes will catch everything else after them this must be last
  router.use(staticRoutes.routes())
  router.use(staticRoutes.allowedMethods())
}
