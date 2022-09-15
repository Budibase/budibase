import * as BudibaseApi from "../sdk"

let ApiClient = new BudibaseApi.ApiClient()

// Default to current host
ApiClient.basePath = "/api/public/v1"

/**
 * Configures the Budibase Public API SDK
 * @param apiKey the user's API key
 * @param host the Budibase server host
 */
export const configure = ({ apiKey, host }) => {
  ApiClient.authentications["ApiKeyAuth"].apiKey = apiKey
  ApiClient.basePath = `${host || ""}/api/public/v1`
}

export const ApplicationsApi = new BudibaseApi.ApplicationsApi(ApiClient)
export const QueriesApi = new BudibaseApi.QueriesApi(ApiClient)
export const RowsApi = new BudibaseApi.RowsApi(ApiClient)
export const TablesApi = new BudibaseApi.TablesApi(ApiClient)
export const UsersApi = new BudibaseApi.UsersApi(ApiClient)
