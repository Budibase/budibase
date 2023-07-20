import AccountInternalAPIClient from "../AccountInternalAPIClient"
import { Account, UpdateLicenseRequest } from "@budibase/types"
import { Response } from "node-fetch"
import BaseAPI from "./BaseAPI"
import { APIRequestOpts } from "../../../types"

export default class LicenseAPI extends BaseAPI {
  client: AccountInternalAPIClient

  constructor(client: AccountInternalAPIClient) {
    super()
    this.client = client
  }

  async updateLicense(
    accountId: string,
    body: UpdateLicenseRequest,
    opts: APIRequestOpts = { status: 200 }
  ): Promise<[Response, Account]> {
    return this.doRequest(() => {
      return this.client.put(`/api/accounts/${accountId}/license`, {
        body,
        internal: true,
      })
    }, opts)
  }
}
