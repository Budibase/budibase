import * as BudibaseApi from "../sdk"

export default class SDK {
  applications = new BudibaseApi.ApplicationsApi()
  queries = new BudibaseApi.QueriesApi()
  rows = new BudibaseApi.RowsApi()
  tables = new BudibaseApi.TablesApi()
  users = new BudibaseApi.UsersApi()

  constructor({ apiKey, host }) {
    let ApiClient = new BudibaseApi.ApiClient()

    // Default to current host
    ApiClient.basePath = `${host || ""}/api/public/v1`
    ApiClient.authentications["ApiKeyAuth"].apiKey = apiKey

    this.applications = new BudibaseApi.ApplicationsApi(ApiClient)
    this.queries = new BudibaseApi.QueriesApi(ApiClient)
    this.rows = new BudibaseApi.RowsApi(ApiClient)
    this.tables = new BudibaseApi.TablesApi(ApiClient)
    this.users = new BudibaseApi.UsersApi(ApiClient)
  }
}
