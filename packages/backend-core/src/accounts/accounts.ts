import API from "./api"
import env from "../environment"
import { Header } from "../constants"
import { CloudAccount, HealthStatusResponse } from "@budibase/types"

const api = new API(env.ACCOUNT_PORTAL_URL)

/**
 * This client is intended to be used in a cloud hosted deploy only.
 * Rather than relying on each consumer to perform the necessary environmental checks
 * we use the following check to exit early with a undefined response which should be
 * handled by the caller.
 */
const EXIT_EARLY = env.SELF_HOSTED || env.DISABLE_ACCOUNT_PORTAL

export const getAccount = async (
  email: string
): Promise<CloudAccount | undefined> => {
  if (EXIT_EARLY) {
    return
  }
  const payload = {
    email,
  }
  const response = await api.post(`/api/accounts/search`, {
    body: payload,
    headers: {
      [Header.API_KEY]: env.ACCOUNT_PORTAL_API_KEY,
    },
  })

  if (response.status !== 200) {
    throw new Error(`Error getting account by email ${email}`)
  }

  const json: CloudAccount[] = await response.json()
  return json[0]
}

export const getAccountByTenantId = async (
  tenantId: string
): Promise<CloudAccount | undefined> => {
  if (EXIT_EARLY) {
    return
  }
  const payload = {
    tenantId,
  }
  const response = await api.post(`/api/accounts/search`, {
    body: payload,
    headers: {
      [Header.API_KEY]: env.ACCOUNT_PORTAL_API_KEY,
    },
  })

  if (response.status !== 200) {
    throw new Error(`Error getting account by tenantId ${tenantId}`)
  }

  const json: CloudAccount[] = await response.json()
  return json[0]
}

export const getStatus = async (): Promise<
  HealthStatusResponse | undefined
> => {
  if (EXIT_EARLY) {
    return
  }
  const response = await api.get(`/api/status`, {
    headers: {
      [Header.API_KEY]: env.ACCOUNT_PORTAL_API_KEY,
    },
  })
  const json = await response.json()

  if (response.status !== 200) {
    throw new Error(`Error getting status`)
  }

  return json
}
