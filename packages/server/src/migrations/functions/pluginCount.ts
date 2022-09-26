import { tenancy, logging } from "@budibase/backend-core"
import { plugins } from "@budibase/pro"

export const run = async () => {
  try {
    await tenancy.doInTenant(tenancy.DEFAULT_TENANT_ID, async () => {
      await plugins.checkPluginQuotas()
    })
  } catch (err) {
    logging.logAlert("Failed to update plugin quotas", err)
  }
}
