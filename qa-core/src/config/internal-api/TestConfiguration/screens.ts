import { Screen } from "@budibase/types"
import { Response } from "node-fetch"
import InternalAPIClient from "./InternalAPIClient"

export default class ScreenApi {
  api: InternalAPIClient

  constructor(apiClient: InternalAPIClient) {
    this.api = apiClient
  }

  async create(body: any): Promise<[Response, Screen]> {
    const response = await this.api.post(`/screens`, { body })
    const json = await response.json()
    return [response, json]
  }

  async delete(screenId: string, rev: string): Promise<[Response, Screen]> {
    const response = await this.api.del(`/screens/${screenId}/${rev}`)
    const json = await response.json()
    return [response, json]
  }
}
