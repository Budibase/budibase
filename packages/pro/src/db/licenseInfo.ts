import { LicenseInfo, SaveLicenseInfo } from "../types"
import { tenancy, StaticDatabases } from "@budibase/backend-core"

const newLicenseInfo = (): LicenseInfo => {
  return {
    _id: StaticDatabases.GLOBAL.docs.licenseInfo,
  }
}

export const save = async (
  saveLicenseInfo: SaveLicenseInfo
): Promise<LicenseInfo> => {
  let licenseInfo = await get()
  licenseInfo = {
    ...licenseInfo,
    ...saveLicenseInfo,
  }
  const db = tenancy.getGlobalDB()
  const response = await db.put(licenseInfo)
  licenseInfo._rev = response.rev
  return licenseInfo
}

export const get = async (): Promise<LicenseInfo> => {
  const db = tenancy.getGlobalDB()
  try {
    // await to catch error
    return await db.get(StaticDatabases.GLOBAL.docs.licenseInfo)
  } catch (err: any) {
    if (err.status === 404) {
      return newLicenseInfo()
    }
    throw err
  }
}

export const destroy = async (): Promise<void> => {
  const db = tenancy.getGlobalDB()
  const doc = await get()
  if (doc && doc._rev) {
    await db.remove(StaticDatabases.GLOBAL.docs.licenseInfo, doc._rev)
  }
}
