import { Response } from "node-fetch"
import {
  ActivateOfflineLicenseTokenRequest,
  GetOfflineIdentifierResponse,
  GetOfflineLicenseTokenResponse,
} from "@budibase/types"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"
import BaseAPI from "./BaseAPI"

export default class LicenseAPI extends BaseAPI {
  constructor(client: BudibaseInternalAPIClient) {
    super(client)
  }

  async getOfflineLicenseToken(
    opts: { status?: number } = {}
  ): Promise<[Response, GetOfflineLicenseTokenResponse]> {
    const [response, body] = await this.get(
      `/global/license/offline`,
      opts.status
    )
    return [response, body]
  }

  async deleteOfflineLicenseToken(): Promise<[Response]> {
    const [response] = await this.del(`/global/license/offline`, 204)
    return [response]
  }

  async activateOfflineLicenseToken(
    body: ActivateOfflineLicenseTokenRequest
  ): Promise<[Response]> {
    const [response] = await this.post(`/global/license/offline`, body)
    return [response]
  }

  async getOfflineIdentifier(): Promise<
    [Response, GetOfflineIdentifierResponse]
  > {
    const [response, body] = await this.get(
      `/global/license/offline/identifier`
    )
    return [response, body]
  }
}
