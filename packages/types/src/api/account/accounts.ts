import type { Account, AccountSSOProvider } from "../../documents"
import type { Hosting } from "../../sdk"

export interface CreateAccountRequest {
  email: string
  tenantId: string
  hosting: Hosting
  size: string
  profession: string
  // optional fields
  tenantName?: string
  name?: string
  password: string
  provider?: AccountSSOProvider
}

export interface SearchAccountsRequest {
  // one or the other - not both
  email?: string
  tenantId?: string
}

export type SearchAccountsResponse = Account[]
