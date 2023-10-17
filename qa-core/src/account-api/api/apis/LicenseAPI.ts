import AccountInternalAPIClient from "../AccountInternalAPIClient"
import {
  Account,
  CreateOfflineLicenseRequest,
  GetOfflineLicenseResponse,
  UpdateLicenseRequest,
} from "@budibase/types"
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

  // TODO: Better approach for setting tenant id header

  async createOfflineLicense(
    accountId: string,
    tenantId: string,
    body: CreateOfflineLicenseRequest,
    opts: { status?: number } = {}
  ): Promise<Response> {
    const [response, json] = await this.client.post(
      `/api/internal/accounts/${accountId}/license/offline`,
      {
        body,
        internal: true,
        headers: {
          "x-budibase-tenant-id": tenantId,
        },
      }
    )
    expect(response.status).toBe(opts.status ? opts.status : 201)
    return response
  }

  async getOfflineLicense(
    accountId: string,
    tenantId: string,
    opts: { status?: number } = {}
  ): Promise<[Response, GetOfflineLicenseResponse]> {
    const [response, json] = await this.client.get(
      `/api/internal/accounts/${accountId}/license/offline`,
      {
        internal: true,
        headers: {
          "x-budibase-tenant-id": tenantId,
        },
      }
    )
    expect(response.status).toBe(opts.status ? opts.status : 200)
    return [response, json]
  }
}
