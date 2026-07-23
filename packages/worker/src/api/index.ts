import Router from "@koa/router"

const compress = require("koa-compress")

import zlib from "zlib"
import { routes } from "./routes"
import { endpointGroupList } from "./routes/endpointGroups"
import { middleware as pro } from "@budibase/pro"
import { auth, middleware } from "@budibase/backend-core"

const publicEndpoints = endpointGroupList.endpointMatchers({ public: true })

const ALLOW_INACTIVE_TENANT_ENDPOINTS = [
  {
    route: "/api/system/tenants/:tenantId",
    method: "DELETE",
  },
]

const noTenancyEndpoints = endpointGroupList.endpointMatchers({
  noTenancy: true,
})

const router: Router = new Router()

router
  .use(middleware.errorHandling)
  .use(middleware.featureFlagCookie)
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
  .use("/health", ctx => (ctx.status = 200))
  .use(auth.buildAuthMiddleware(publicEndpoints))
  .use(auth.buildTenancyMiddleware(publicEndpoints, noTenancyEndpoints))
  .use(middleware.activeTenant(ALLOW_INACTIVE_TENANT_ENDPOINTS))
  .use(auth.buildCsrfMiddleware({ noCsrfPatterns: publicEndpoints }))
  .use(pro.licensing())
  // reject requests that are not declared public and have no authenticated user
  .use((ctx, next) => {
    if (ctx.publicEndpoint) {
      return next()
    }
    if (
      (!ctx.isAuthenticated || (ctx.user && !ctx.user.budibaseAccess)) &&
      !ctx.internal
    ) {
      ctx.throw(403, "Unauthorized")
    }
    return next()
  })
  .use(middleware.auditLog)

router.get("/health", ctx => (ctx.status = 200))

// authenticated routes
for (let route of routes) {
  router.use(route.routes())
  router.use(route.allowedMethods())
}

export default router
