import { API } from "../../../utilities"
import {
  GetLicenseRequest,
  License,
  LicenseActivateRequest,
  QuotaTriggeredRequest,
  QuotaUsageType,
  StaticQuotaName,
} from "@budibase/types"
import {
  constants,
  env,
  events,
  HTTPError,
  installation,
  logging,
  tenancy,
  users,
} from "@budibase/backend-core"
import { Response } from "node-fetch"
import * as db from "../../../db"
import { versions } from "../../../constants"
import { tracer } from "dd-trace"

const api = new API(env.INTERNAL_ACCOUNT_PORTAL_URL || env.ACCOUNT_PORTAL_URL)

const getResponseErrorMessage = async (
  response: Response
): Promise<string | undefined> => {
  try {
    const json = await response.json()
    if (json.message) {
      return json.message as string
    }
  } catch (e) {
    // do nothing
  }

  try {
    const text = await response.text()
    if (text) {
      return text
    }
  } catch (e) {
    // do nothing
  }
}

const authAware = async <T>(fn: (authHeader: any) => Promise<T>) => {
  // don't send the request if self-hosted and no license key
  let licenseInfo
  let authHeader
  if (env.SELF_HOSTED) {
    licenseInfo = await db.licenseInfo.get()
    if (!licenseInfo.licenseKey) {
      return
    }
    authHeader = {
      [constants.Header.LICENSE_KEY]: licenseInfo.licenseKey,
    }
  } else {
    const tenantId = tenancy.getTenantId()
    authHeader = {
      [constants.Header.API_KEY]: env.ACCOUNT_PORTAL_API_KEY,
      [constants.Header.TENANT_ID]: tenantId,
    }
  }

  return fn(authHeader)
}

let _getLicense = async () => {
  return await tracer.trace("_getLicense", async () => {
    return await authAware(
      async (authHeader: any): Promise<License | undefined> => {
        const quotaUsage = await db.quotas.getQuotaUsage()

        // make sure user count is set
        if (quotaUsage.usageQuota.users == null) {
          const userCount = await users.getUserCount()
          console.info(`Syncing user count quota to ${userCount}`)
          quotaUsage.usageQuota.users = userCount
          await db.quotas.setUsage(
            userCount,
            StaticQuotaName.USERS,
            QuotaUsageType.STATIC
          )
        }

        // Reconciliation of creators values. Make sure the value is accurate
        // TODO This is a mechanism to mitigate already known problems with quotas. In order to fix the root cause,
        //  the issue https://github.com/Budibase/budibase/issues/17315 must be resolved. It involves a usageQuotas
        //  system re-architecture
        // ------------------------------------------------------------------------------------------
        const creatorsCount = await users.getCreatorCount()
        quotaUsage.usageQuota.creators = creatorsCount
        await db.quotas.setUsage(
          creatorsCount,
          StaticQuotaName.CREATORS,
          QuotaUsageType.STATIC
        )
        // ------------------------------------------------------------------------------------------

        const install = await installation.getInstallFromDB()
        const tenantId = tenancy.getTenantId()
        const installTenantId =
          await events.identification.getUniqueTenantId(tenantId)
        const installVersion = versions.getProVersion()

        const body: GetLicenseRequest = {
          quotaUsage,
          tenantId,
          install: {
            id: install.installId,
            tenantId: installTenantId,
            version: installVersion,
          },
        }

        try {
          const response = await api.post(`/api/license`, {
            headers: { ...authHeader },
            body,
          })

          if (response.status === 404 || response.status === 403) {
            // no license for the tenant
            return
          }

          if (response.status !== 200) {
            const message = await getResponseErrorMessage(response)
            throw new HTTPError(
              `Error getting license: ${message}`,
              response.status
            )
          }

          return response.json()
        } catch (err) {
          // account portal isn't present - no license found
          if (env.DISABLE_ACCOUNT_PORTAL) {
            return
          }
          throw err
        }
      }
    )
  })
}

// special case for mocking this function
// in other services - can't mock this externally
// whenever pro is bundled into a single file
if (env.isJest()) {
  _getLicense = jest.fn()
}

export const getLicense = _getLicense

export async function getLicenseFromKey(
  licenseKey: string
): Promise<License | undefined> {
  return await tracer.trace("getLicenseFromKey", async span => {
    let response: Response

    if (!env.ACCOUNT_PORTAL_API_KEY) {
      throw new Error(
        "getLicenseFromKey requires ACCOUNT_PORTAL_API_KEY to be set"
      )
    }

    try {
      response = await api.get(`/api/license/${licenseKey}`, {
        headers: {
          [constants.Header.API_KEY]: env.ACCOUNT_PORTAL_API_KEY,
        },
      })
    } catch (err) {
      // account portal isn't present - no license found
      if (env.DISABLE_ACCOUNT_PORTAL) {
        return
      }
      throw err
    }

    if (response.status === 404 || response.status === 403) {
      span.addTags({ licenseFound: false })
      return
    }

    if (response.status !== 200) {
      const message = await getResponseErrorMessage(response)
      throw new HTTPError(`Error getting license: ${message}`, response.status)
    }

    return response.json()
  })
}

export const triggerQuota = (body: QuotaTriggeredRequest) => {
  return authAware(async (authHeader: any) => {
    const response = await api.post(`/api/license/usage/triggered`, {
      headers: { ...authHeader },
      body,
    })

    if (response.status !== 200) {
      const message = await getResponseErrorMessage(response)
      logging.logAlert(`Error triggering quota usage: ${message}`)
    }
  })
}

export const activateLicenseKey = async (
  licenseKey: string
): Promise<License | undefined> => {
  const install = await installation.getInstall()

  const body: LicenseActivateRequest = {
    installVersion: install.version,
    installId: install.installId,
  }

  const response = await api.post(`/api/license/activate`, {
    headers: {
      [constants.Header.LICENSE_KEY]: licenseKey,
    },
    body,
  })

  // don't propagate the 403 to prevent logout
  if (response.status === 403) {
    throw new HTTPError("Invalid license key", 400)
  }

  if (response.status === 409) {
    throw new HTTPError("License key has already been activated", 409)
  }

  if (response.status !== 200) {
    const message = await getResponseErrorMessage(response)
    throw new HTTPError(
      `Error activating license key: ${message}`,
      response.status
    )
  }

  return response.json()
}
