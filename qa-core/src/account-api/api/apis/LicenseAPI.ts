import AccountInternalAPIClient from "../AccountInternalAPIClient"
import {
  Account,
  CreateOfflineLicenseRequest,
  GetLicenseKeyResponse,
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
  async getLicenseKey(
    opts: { status?: number } = {}
  ): Promise<[Response, GetLicenseKeyResponse]> {
    const [response, json] = await this.client.get(`/api/license/key`)
    expect(response.status).toBe(opts.status || 200)
    return [response, json]
  }
  async activateLicense(
    apiKey: string,
    tenantId: string,
    licenseKey: string,
    opts: APIRequestOpts = { status: 200 }
  ) {
    return this.doRequest(() => {
      return this.client.post(`/api/license/activate`, {
        body: {
          apiKey: apiKey,
          tenantId: tenantId,
          licenseKey: licenseKey,
        },
      })
    }, opts)
  }
  async regenerateLicenseKey(opts: APIRequestOpts = { status: 200 }) {
    return this.doRequest(() => {
      return this.client.post(`/api/license/key/regenerate`, {})
    }, opts)
  }

  async getPlans(opts: APIRequestOpts = { status: 200 }) {
    return this.doRequest(() => {
      return this.client.get(`/api/plans`)
    }, opts)
  }

  async updatePlan(priceId: string, opts: APIRequestOpts = { status: 200 }) {
    return this.doRequest(() => {
      return this.client.put(`/api/license/plan`, {
        body: { priceId },
      })
    }, opts)
  }

  async refreshAccountLicense(
    accountId: string,
    opts: { status?: number } = {}
  ): Promise<Response> {
    const [response, json] = await this.client.post(
      `/api/accounts/${accountId}/license/refresh`,
      {
        internal: true,
      }
    )
    expect(response.status).toBe(opts.status ? opts.status : 201)
    return response
  }

  async getLicenseUsage(opts: APIRequestOpts = { status: 200 }) {
    return this.doRequest(() => {
      return this.client.get(`/api/license/usage`)
    }, opts)
  }

  async licenseUsageTriggered(
    opts: { status?: number } = {}
  ): Promise<Response> {
    const [response, json] = await this.client.post(
      `/api/license/usage/triggered`
    )
    expect(response.status).toBe(opts.status ? opts.status : 201)
    return response
  }
}
