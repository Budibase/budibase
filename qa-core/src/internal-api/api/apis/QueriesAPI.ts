import { Response } from "node-fetch"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"
import { PreviewQueryRequest, Query } from "@budibase/types"

export default class DatasourcesAPI {
  client: BudibaseInternalAPIClient

  constructor(client: BudibaseInternalAPIClient) {
    this.client = client
  }

  async preview(body: PreviewQueryRequest): Promise<[Response, any]> {
    const [response, json] = await this.client.post(`/queries/preview`, {
      body,
    })
    expect(response).toHaveStatusCode(200)
    return [response, json]
  }

  async save(body: Query): Promise<[Response, any]> {
    const [response, json] = await this.client.post(`/queries`, {
      body,
    })
    expect(response).toHaveStatusCode(200)
    return [response, json]
  }

  async get(queryId: string): Promise<[Response, any]> {
    const [response, json] = await this.client.get(`/queries/${queryId}`)
    expect(response).toHaveStatusCode(200)
    return [response, json]
  }
}
