import { Response } from "node-fetch"
import BudibasePublicAPIClient from "../BudibasePublicAPIClient"
import * as fixtures from "../../fixtures"
import {
  Application,
  SearchInputParams,
  CreateApplicationParams,
} from "../../../types"

export default class AppAPI {
  client: BudibasePublicAPIClient

  constructor(client: BudibasePublicAPIClient) {
    this.client = client
  }

  async seed(): Promise<[Response, Application]> {
    return this.create(fixtures.apps.generateApp())
  }

  async create(
    body: CreateApplicationParams
  ): Promise<[Response, Application]> {
    const [response, json] = await this.client.post(`/applications`, { body })
    return [response, json.data]
  }

  async read(id: string): Promise<[Response, Application]> {
    const [response, json] = await this.client.get(`/applications/${id}`)
    return [response, json.data]
  }

  async search(body: SearchInputParams): Promise<[Response, [Application]]> {
    const [response, json] = await this.client.post(`/applications/search`, {
      body,
    })
    return [response, json.data]
  }

  async update(
    id: string,
    body: Application
  ): Promise<[Response, Application]> {
    const [response, json] = await this.client.put(`/applications/${id}`, {
      body,
    })
    return [response, json.data]
  }

  async delete(id: string): Promise<[Response, Application]> {
    const [response, json] = await this.client.del(`/applications/${id}`)
    return [response, json.data]
  }

  async publish(id: string): Promise<[Response, any]> {
    const [response, json] = await this.client.post(
      `/applications/${id}/publish`
    )
    return [response, json.data]
  }

  async unpublish(id: string): Promise<[Response]> {
    const [response, json] = await this.client.post(
      `/applications/${id}/unpublish`
    )
    return [response]
  }
}
