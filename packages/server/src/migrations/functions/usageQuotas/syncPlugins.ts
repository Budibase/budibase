import { logging } from "@budibase/backend-core"
import { plugins } from "@budibase/pro"

export const run = async () => {
  try {
    await plugins.checkPluginQuotas()
  } catch (err) {
    logging.logAlert("Failed to update plugin quotas", err)
  }
}
