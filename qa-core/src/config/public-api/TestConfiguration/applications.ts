import PublicAPIClient from "./PublicAPIClient"
import {
  Application,
  SearchInputParams,
  CreateApplicationParams,
} from "@budibase/server/api/controllers/public/mapping/types"
import { Response } from "node-fetch"
import generateApp from "../fixtures/applications"

export default class AppApi {
  api: PublicAPIClient

  constructor(apiClient: PublicAPIClient) {
    this.api = apiClient
  }

  async seed(): Promise<[Response, Application]> {
    return this.create(generateApp())
  }

  async create(
    body: CreateApplicationParams
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

  async search(body: SearchInputParams): Promise<[Response, [Application]]> {
    const response = await this.api.post(`/applications/search`, { body })
    const json = await response.json()
    return [response, json.data]
  }

  async update(
    id: string,
    body: Application
  ): Promise<[Response, Application]> {
    const response = await this.api.put(`/applications/${id}`, { body })
    const json = await response.json()
    return [response, json.data]
  }

  async delete(id: string): Promise<[Response, Application]> {
    const response = await this.api.del(`/applications/${id}`)
    const json = await response.json()
    return [response, json.data]
  }

  async publish(id: string): Promise<[Response, any]> {
    const response = await this.api.post(`/applications/${id}/publish`)
    const json = await response.json()
    return [response, json.data]
  }

  async unpublish(id: string): Promise<[Response]> {
    const response = await this.api.post(`/applications/${id}/unpublish`)
    return [response]
  }
}
