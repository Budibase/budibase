import { License } from "../../../sdk"
import { Account, DevInfo, User } from "../../../documents"

export interface GenerateAPIKeyRequest {
  userId?: string
}
export interface GenerateAPIKeyResponse extends DevInfo {}

export interface FetchAPIKeyResponse extends DevInfo {}

export interface GetGlobalSelfResponse extends User {
  flags?: Record<string, any>
  account?: Account
  license: License
  budibaseAccess: boolean
  accountPortalAccess: boolean
  csrfToken: boolean
}
