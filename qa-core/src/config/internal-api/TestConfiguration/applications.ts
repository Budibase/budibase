import {
  Application,
} from "@budibase/server/api/controllers/public/mapping/types"
import { Response } from "node-fetch"
import InternalAPIClient from "./InternalAPIClient"

export default class AppApi {
  api: InternalAPIClient

  constructor(apiClient: InternalAPIClient) {
    this.api = apiClient
  }

  async create(
    body: any
  ): Promise<[Response, Application]> {
    const response = await this.api.post(`/applications`, { body })
    const json = await response.json()
    return [response, json.data]
  }

  async read(id: string): Promise<[Response, Application]> {
    const response = await this.api.get(`/applications/${id}`)
    const json = await response.json()
    return [response, json.data]
  }
}
