import {
  Application,
} from "@budibase/server/api/controllers/public/mapping/types"
import { App } from "@budibase/types"
import { Response } from "node-fetch"
import InternalAPIClient from "./InternalAPIClient"

export default class AppApi {
  api: InternalAPIClient

  constructor(apiClient: InternalAPIClient) {
    this.api = apiClient
  }

  async fetch(): Promise<[Response, Application[]]> {
    const response = await this.api.get(`/applications?status=all`)
    const json = await response.json()
    return [response, json]
  }

  async canRender(appId: string): Promise<[Response, string]> {
    const response = await this.api.get(`/${appId}`, {})
    const html = await response.text()
    return [response, html]
  }

  async getAppPackage(appId: string): Promise<[Response, any]> {
    const response = await this.api.get(`/applications/${appId}/appPackage`)
    const json = await response.json()
    return [response, json]
  }

  // TODO: 500 Error: Missing/invalid DB name when called
  async publish(): Promise<[Response, string]> {
    const response = await this.api.post("/deploy")
    const json = await response.json()
    return [response, json]
  }

  async create(
    body: any
  ): Promise<[Response, Partial<App>]> {
    const response = await this.api.post(`/applications`, { body })
    const json = await response.json()
    return [response, json]
  }

  async read(id: string): Promise<[Response, Application]> {
    const response = await this.api.get(`/applications/${id}`)
    const json = await response.json()
    return [response, json.data]
  }
}
