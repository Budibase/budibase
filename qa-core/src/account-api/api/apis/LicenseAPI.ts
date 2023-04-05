import AccountInternalAPIClient from "../AccountInternalAPIClient"

export default class LicenseAPI {
  client: AccountInternalAPIClient

  constructor(client: AccountInternalAPIClient) {
    this.client = client
  }
}
