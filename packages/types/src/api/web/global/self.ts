import { FeatureFlags } from "packages/types/src/sdk"
import { DevInfo, User } from "../../../documents"

export interface GenerateAPIKeyRequest {
  userId?: string
}
export interface GenerateAPIKeyResponse extends DevInfo {}

export interface FetchAPIKeyResponse extends DevInfo {}

export interface GetGlobalSelfResponse extends User {
  flags?: FeatureFlags
}
