import Router from "@koa/router"
import { errors, auth } from "@budibase/backend-core"
import currentApp from "../middleware/currentapp"
import zlib from "zlib"
import { mainRoutes, staticRoutes, publicRoutes } from "./routes"
import pkg from "../../package.json"
import env from "../environment"
import { middleware as pro } from "@budibase/pro"
export { shutdown } from "./routes/public"
const compress = require("koa-compress")

export const router: Router = new Router()

router.get("/health", ctx => (ctx.status = 200))
router.get("/version", ctx => (ctx.body = pkg.version))

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
  .use(async (ctx, next) => {
    ctx.config = {
      jwtSecret: env.JWT_SECRET,
      useAppRootPath: true,
    }
    await next()
  })
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
  // @ts-ignore
  .use(currentApp)
  .use(auth.auditLog)

// error handling middleware
router.use(async (ctx, next) => {
  try {
    await next()
  } catch (err: any) {
    ctx.status = err.status || err.statusCode || 500
    const error = errors.getPublicError(err)
    ctx.body = {
      message: err.message,
      status: ctx.status,
      validationErrors: err.validation,
      error,
    }
    ctx.log.error(err)
    // unauthorised errors don't provide a useful trace
    if (!env.isTest()) {
      console.trace(err)
    }
  }
})

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
