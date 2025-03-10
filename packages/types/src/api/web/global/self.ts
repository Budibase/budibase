import type { License } from "../../../sdk"
import type { Account, DevInfo, User } from "../../../documents"
import type { FeatureFlags } from "@budibase/types"

export interface GenerateAPIKeyRequest {
  userId?: string
}
export interface GenerateAPIKeyResponse extends DevInfo {}

export interface FetchAPIKeyResponse extends DevInfo {}

export interface GetGlobalSelfResponse extends User {
  flags?: FeatureFlags
  account?: Account
  license: License
  budibaseAccess: boolean
  accountPortalAccess: boolean
  csrfToken: string
}
