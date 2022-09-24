import { tenancy, logging } from "@budibase/backend-core"
import { plugins } from "@budibase/pro"
import env from "../../environment"

export const run = async () => {
  // only a self hosted op
  if (!env.SELF_HOSTED) {
    return
  }
  try {
    await tenancy.doInTenant(tenancy.DEFAULT_TENANT_ID, async () => {
      await plugins.checkPluginQuotas()
    })
  } catch (err) {
    logging.logAlert("Failed to update plugin quotas", err)
  }
}
