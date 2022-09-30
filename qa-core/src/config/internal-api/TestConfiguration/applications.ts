import {
  Application,
} from "@budibase/server/api/controllers/public/mapping/types"
import { App } from "@budibase/types"
import { Response } from "node-fetch"
import InternalAPIClient from "./InternalAPIClient"
import FormData from "form-data"

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

  async canRender(): Promise<[Response, boolean]> {
    const response = await this.api.get("/routing/client")
    const json = await response.json()
    return [response, Object.keys(json.routes).length > 0]
  }

  async getAppPackage(appId: string): Promise<[Response, any]> {
    const response = await this.api.get(`/applications/${appId}/appPackage`)
    const json = await response.json()
    return [response, json]
  }

  async publish(): Promise<[Response, string]> {
    const response = await this.api.post("/deploy")
    const json = await response.json()
    return [response, json]
  }

  async create(
    body: any
  ): Promise<[Response, Partial<App>]> {
    const data = new FormData()
    data.append("name", body.name)
    data.append("url", body.url)
    data.append("useTemplate", true)
    data.append("templateName", body.templateName)
    data.append("templateKey", body.templateKey)

    const response = await this.api.post(`/applications`, { body: data })
    const json = await response.json()
    return [response, json]
  }

  async read(id: string): Promise<[Response, Application]> {
    const response = await this.api.get(`/applications/${id}`)
    const json = await response.json()
    return [response, json.data]
  }
}
