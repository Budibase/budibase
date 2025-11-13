import { License, LLMProviderConfig } from "../../../sdk"
import { Account, DevInfo, User } from "../../../documents"
import { FeatureFlags, LockReason } from "@budibase/types"

export interface GenerateAPIKeyRequest {
  userId?: string
}
export interface GenerateAPIKeyResponse extends DevInfo {}

export interface FetchAPIKeyResponse extends DevInfo {}

export interface GetGlobalSelfResponse extends User {
  flags?: FeatureFlags
  llm?: Omit<LLMProviderConfig, "apiKey">
  account?: Account
  lockedBy?: LockReason
  license: License
  budibaseAccess: boolean
  accountPortalAccess: boolean
  csrfToken: string
}
