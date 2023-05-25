import { Response } from "node-fetch"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"
import { PreviewQueryRequest, Query } from "@budibase/types"
import BaseAPI from "./BaseAPI"

export default class QueriesAPI extends BaseAPI {
  constructor(client: BudibaseInternalAPIClient) {
    super(client)
  }

  async preview(body: PreviewQueryRequest): Promise<[Response, any]> {
    const [response, json] = await this.post(`/queries/preview`, body)
    return [response, json]
  }

  async save(body: Query): Promise<[Response, any]> {
    const [response, json] = await this.post(`/queries`, body)
    return [response, json]
  }

  async getQuery(queryId: string): Promise<[Response, any]> {
    const [response, json] = await this.get(`/queries/${queryId}`)
    return [response, json]
  }
}
