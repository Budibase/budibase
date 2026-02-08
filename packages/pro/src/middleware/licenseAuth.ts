import { Ctx } from "@budibase/types"
import { Next } from "koa"
import { constants, context, utils } from "@budibase/backend-core"
import { getLicenseFromKey } from "../sdk/licensing"
import { tracer } from "dd-trace"

export default async function (ctx: Ctx, next: Next) {
  await tracer.trace("licenseAuth", async span => {
    let licenseKey =
      ctx.request.headers[constants.Header.LICENSE_KEY] ||
      utils.getBearerToken(ctx)
    if (Array.isArray(licenseKey)) {
      licenseKey = licenseKey[0]
    }

    if (!licenseKey) {
      ctx.throw(403, "License key not provided")
    }

    const license = await getLicenseFromKey(licenseKey)
    if (!license) {
      span.addTags({ licenseFound: false })
      ctx.throw(403, "License not found or invalid")
    }

    if (!license.tenantId) {
      ctx.throw(403, "License does not have a tenant ID")
    }

    tracer.setUser({
      id: "anonymous",
      tenantId: license.tenantId,
    })

    await context.doInSelfHostTenantUsingCloud(license.tenantId, async () => {
      await context.doInLicenseContext(license, async () => {
        await next()
      })
    })
  })
}
