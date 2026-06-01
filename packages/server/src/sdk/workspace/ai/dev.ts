import { env } from "@budibase/backend-core"
import { licensing } from "@budibase/pro"
import { Feature } from "@budibase/types"

export async function canUseManagedBBAIInSelfHostDev() {
  if (!env.SELF_HOSTED || !env.isDev()) {
    return false
  }

  const license = await licensing.cache.getCachedLicense()
  return license.features.includes(Feature.BUDIBASE_AI)
}
