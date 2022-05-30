import { events, tenancy, installation } from "@budibase/backend-core"
import { Installation } from "@budibase/types"
import * as global from "./global"
import env from "../../../environment"

const failGraceful = env.SELF_HOSTED

const handleError = (e: any, errors?: any) => {
  if (failGraceful) {
    if (errors) {
      errors.push(e)
    }
    return
  }
  throw e
}

/**
 * Date:
 * May 2022
 *
 * Description:
 * Backfill installation events.
 */

export const run = async () => {
  try {
    // need to use the default tenant to try to get the installation time
    await tenancy.doInTenant(tenancy.DEFAULT_TENANT_ID, async () => {
      const db = tenancy.getGlobalDB()
      const installTimestamp = (await global.getInstallTimestamp(db)) as number
      const install: Installation = await installation.getInstall()
      await events.identification.identifyInstallationGroup(
        install.installId,
        installTimestamp
      )
    })
    await events.backfill.installationSucceeded()
    throw new Error("fail")
  } catch (e) {
    handleError(e)
    await events.backfill.installationFailed(e)
  }
}
