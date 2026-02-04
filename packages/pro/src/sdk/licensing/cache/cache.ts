import tracer from "dd-trace"
import { tenancy, context, Duration, locks, env } from "@budibase/backend-core"
import { LockName, LockType } from "@budibase/types"
import { CachedLicense } from "../../../types"
import * as Licenses from "../licenses"
import * as Redis from "./redis"
import { helpers } from "@budibase/shared-core"

const EXPIRY_SECONDS = Duration.fromHours(1).toSeconds()
const STALE_GRACE_SECONDS = Duration.fromHours(1).toSeconds()
const CACHE_TTL_SECONDS = EXPIRY_SECONDS + STALE_GRACE_SECONDS

export const refresh = async () => {
  await invalidate()
  await getCachedLicense()
}

const populateAndStoreLicense = async (
  tenantId: string
): Promise<CachedLicense> => {
  const { result } = await locks.doWithLock(
    {
      type: LockType.DEFAULT,
      name: LockName.SYNC_ACCOUNT_LICENSE,
      resource: tenantId,
      ttl: Duration.fromSeconds(10).toMs(),
    },
    async () => {
      const client = await Redis.getClient()
      const cached = await client.get(tenantId)
      if (cached && !shouldRefreshLicense(cached)) {
        return cached
      }

      let license: CachedLicense | undefined = await tracer.trace(
        "populateLicense",
        async () => await Licenses.getLicense()
      )

      if (!license) {
        license = tracer.trace("populateFreeLicense", () =>
          Licenses.getFreeLicense()
        )
      }

      license.refreshedAt = new Date().toISOString()
      await client.store(tenantId, license, CACHE_TTL_SECONDS)

      return license
    }
  )

  return result
}

const shouldRefreshLicense = (license: CachedLicense) => {
  const refreshedAt = license.refreshedAt ? Date.parse(license.refreshedAt) : 0
  const ageMs = Date.now() - refreshedAt
  const isInGracePeriod = ageMs >= EXPIRY_SECONDS * 1000
  return isInGracePeriod
}

let _getCachedLicense = async (): Promise<CachedLicense> => {
  return await tracer.trace("getCachedLicense", async span => {
    const fromContext = context.getLicense()
    if (fromContext) {
      span.addTags({
        foundInContext: true,
        features: fromContext.features,
        plan: fromContext.plan,
        quotas: fromContext.quotas,
      })
      return fromContext
    }

    const tenantId = tenancy.getTenantId()
    const client = await Redis.getClient()
    let license = await client.get(tenantId)
    span.addTags({ tenantId, foundInCache: !!license })

    if (!license) {
      license = await helpers.retry(() => populateAndStoreLicense(tenantId))
      span.addTags({
        refreshedAt: license.refreshedAt,
        features: license.features,
        plan: license.plan,
        quotas: license.quotas,
        expirySeconds: EXPIRY_SECONDS,
        staleGraceSeconds: STALE_GRACE_SECONDS,
      })
      return license
    }

    span.addTags({
      foundInCache: true,
      refreshedAt: license.refreshedAt,
      features: license.features,
      plan: license.plan,
      quotas: license.quotas,
    })

    if (shouldRefreshLicense(license)) {
      // Run in the background
      populateAndStoreLicense(tenantId).catch(() => {
        // best-effort refresh
      })
    }
    return license
  })
}

// special case for re-using pro mocks
// in other services - can't mock this externally
// whenever pro is bundled into a single file
if (env.isJest()) {
  _getCachedLicense = jest.fn().mockImplementation(_getCachedLicense)
}

export const getCachedLicense = _getCachedLicense

export const invalidate = async () => {
  const tenantId = tenancy.getTenantId()
  const client = await Redis.getClient()
  await client.delete(tenantId)
}
