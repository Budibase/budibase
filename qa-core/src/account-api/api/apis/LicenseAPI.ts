import AccountInternalAPIClient from "../AccountInternalAPIClient"
import { Account,  UpdateLicenseRequest } from "@budibase/types"
import { Response } from "node-fetch"

export default class LicenseAPI {
  client: AccountInternalAPIClient

  constructor(client: AccountInternalAPIClient) {
    this.client = client
  }

  async updateLicense(accountId: string, body: UpdateLicenseRequest): Promise<[Response, Account]> {
    const [response, json] = await this.client.put(`/api/accounts/${accountId}/license`, {
      body,
      internal: true
    })
    return [response, json]
  }
}
