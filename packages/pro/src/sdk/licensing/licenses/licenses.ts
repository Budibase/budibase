import * as licenseClient from "./client"
import { licenses as constants } from "../../../constants"
import { env } from "@budibase/backend-core"
import { License } from "@budibase/types"
import * as offline from "./offline"
import { tracer } from "dd-trace"

export const getLicense = async () => {
  return await tracer.trace("getLicense", async span => {
    // always use only the offline license when
    // offline mode is set
    if (env.OFFLINE_MODE) {
      span.addTags({ offline: true })
      return offline.getOfflineLicense()
    }

    // load from the license api
    let license = await licenseClient.getLicense()

    // use offline license fallback
    if (!license) {
      span.addTags({ offlineFallback: true })
      license = offline.dev.getOfflineLicense()
    }
    return license
  })
}

export const getLicenseFromKey = (
  licenseKey: string
): Promise<License | undefined> => {
  return licenseClient.getLicenseFromKey(licenseKey)
}

export const getFreeLicense = (): License => {
  if (env.SELF_HOSTED) {
    return constants.SELF_FREE_LICENSE
  } else {
    return constants.CLOUD_FREE_LICENSE
  }
}
