import API from "./api"
import env from "../environment"
import { Header } from "../constants"
import { CloudAccount } from "@budibase/types"

const api = new API(env.ACCOUNT_PORTAL_URL)

export const getAccount = async (
  email: string
): Promise<CloudAccount | undefined> => {
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

export const getStatus = async () => {
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
