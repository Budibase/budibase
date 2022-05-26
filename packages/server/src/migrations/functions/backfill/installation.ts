import { events, tenancy } from "@budibase/backend-core"
import { Installation } from "@budibase/types"
import * as installation from "../../../installation"
import * as global from "./global"

/**
 * Date:
 * May 2022
 *
 * Description:
 * Backfill installation events.
 */

export const run = async () => {
  // need to use the default tenant to try to get the installation time
  await tenancy.doInTenant(tenancy.DEFAULT_TENANT_ID, async () => {
    const db = tenancy.getGlobalDB()
    const installTimestamp = (await global.getInstallTimestamp(db)) as number
    const install: Installation = await installation.getInstall()
    await events.identification.identifyInstallation(install, installTimestamp)
  })
}
