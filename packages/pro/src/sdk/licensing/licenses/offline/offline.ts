import * as db from "../../../../db"
import * as cache from "../../cache"
import * as signing from "./signing"
import * as features from "../features"
import * as quotas from "../quotas"
import { encoding } from "../../../utils"
import {
  License,
  OfflineIdentifier,
  OfflineLicense,
  Hosting,
} from "@budibase/types"
import { installation, events, context } from "@budibase/backend-core"
import union from "lodash/union"
import merge from "lodash/merge"

// TOKEN

export async function activateOfflineLicenseToken(offlineLicenseToken: string) {
  await db.licenseInfo.save({ offlineLicenseToken })
  await cache.refresh()
}

export async function deleteOfflineLicenseToken() {
  await db.licenseInfo.save({ offlineLicenseToken: undefined })
  await cache.refresh()
}

export async function getOfflineLicenseToken() {
  const info = await db.licenseInfo.get()
  return info.offlineLicenseToken
}

// IDENTIFIER

export async function getIdentifier(): Promise<OfflineIdentifier> {
  const install = await installation.getInstall()
  const installId = install.installId

  const tenantId = context.getTenantId()
  const uniqueTenantId = await events.identification.getUniqueTenantId(tenantId)

  return {
    installId,
    tenantId: uniqueTenantId,
  }
}

export async function getIdentifierBase64(): Promise<string> {
  const identifier = await getIdentifier()
  return encoding.objectToBase64(identifier)
}

export function getIdentifierFromBase64(
  identifierBase64: string
): OfflineIdentifier {
  return encoding.base64ToObject(identifierBase64)
}

// LICENSE

export function verifyExpiry(license: OfflineLicense) {
  const now = Date.now()
  const expireAt = new Date(license.expireAt).getTime()
  if (now > expireAt) {
    throw new Error(`Offline license has expired. expireAt=${license.expireAt}`)
  }
}

export async function verifyInstallation(license: OfflineLicense) {
  const identifier = await getIdentifier()
  if (
    license.identifier.installId !== identifier.installId ||
    license.identifier.tenantId !== identifier.tenantId
  ) {
    // be intentionally vague
    throw new Error("Invalid offline license")
  }
}

export function enrichLicense(license: OfflineLicense) {
  const planType = license.plan.type
  const hosting = Hosting.SELF // offline only applicable in self host
  const _features = features.getOfflineFeatures(planType)
  const _quotas = quotas.getQuotas(hosting, planType)

  // apply the latest features and quotas to license
  license.features = union(license.features, _features)
  license.quotas = merge(license.quotas, _quotas)

  return license
}

export async function getOfflineLicense(): Promise<License | undefined> {
  try {
    const token = await getOfflineLicenseToken()
    if (token) {
      const license = await signing.verifyLicenseToken(token)
      verifyExpiry(license)
      await verifyInstallation(license)
      return enrichLicense(license)
    }
  } catch (e) {
    console.error("Error retrieving offline license", e)
  }
}
