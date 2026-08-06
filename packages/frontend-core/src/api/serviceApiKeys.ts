import {
  CreateServiceApiKeyRequest,
  CreateServiceApiKeyResponse,
  FetchServiceApiKeysResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface ServiceApiKeyEndpoints {
  fetchServiceApiKeys: () => Promise<FetchServiceApiKeysResponse>
  createServiceApiKey: (
    request: CreateServiceApiKeyRequest
  ) => Promise<CreateServiceApiKeyResponse>
  revokeServiceApiKey: (id: string) => Promise<void>
}

export const buildServiceApiKeyEndpoints = (
  API: BaseAPIClient
): ServiceApiKeyEndpoints => ({
  fetchServiceApiKeys: () => API.get({ url: "/api/global/service-api-keys" }),
  createServiceApiKey: request =>
    API.post({ url: "/api/global/service-api-keys", body: request }),
  revokeServiceApiKey: id =>
    API.post({ url: `/api/global/service-api-keys/${id}/revoke` }),
})
