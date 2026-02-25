import { LicenseMiddlewareOptions } from "../types"
import { SELF_FREE_LICENSE } from "../constants/licenses"
import { env, utils } from "@budibase/backend-core"
import { quotas, licensing as licenses } from "../sdk"
import { QuotaUsageType, StaticQuotaName } from "@budibase/types"

const licensing = (
  opts: LicenseMiddlewareOptions = {
    checkUsersLimit: true,
  }
) => {
  return async (ctx: any, next: any) => {
    const licensingCheck = opts.licensingCheck
      ? opts.licensingCheck
      : () => !!ctx.user

    if (licensingCheck(ctx)) {
      if (env.SELF_HOSTED && env.DEFAULT_LICENSE) {
        ctx.user.license = SELF_FREE_LICENSE
        return next()
      }

      // set the license on the current user
      ctx.user.license = await licenses.cache.getCachedLicense()

      // check user limit for the current user
      if (
        opts.checkUsersLimit &&
        (utils.isServingApp(ctx) ||
          utils.isServingBuilder(ctx) ||
          utils.isServingBuilderPreview(ctx) ||
          utils.isPublicApiRequest(ctx))
      ) {
        await quotas.usageLimitIsExceeded({
          name: StaticQuotaName.USERS,
          type: QuotaUsageType.STATIC,
          usageChange: 0,
        })
      }
    }

    return next()
  }
}

export default licensing
