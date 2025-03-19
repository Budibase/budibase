import {
  UpsertOAuth2ConfigRequest,
  FetchOAuth2ConfigsResponse,
} from "@budibase/types"

export type OAuth2Config = FetchOAuth2ConfigsResponse["configs"][0]

export interface UpsertOAuth2Config extends UpsertOAuth2ConfigRequest {}
