import { Response } from "node-fetch"
import { Row } from "@budibase/types"
import InternalAPIClient from "./InternalAPIClient"

export default class RowsApi {
  api: InternalAPIClient

  constructor(apiClient: InternalAPIClient) {
    this.api = apiClient
  }

  async getAll(tableId: string): Promise<[Response, Row[]]> {
    const response = await this.api.get(`/${tableId}/rows`)
    const json = await response.json()
    return [response, json]
  }
  async add(tableId: string, body: any): Promise<[Response, Row]> {
    const response = await this.api.post(`/${tableId}/rows`, { body })
    const json = await response.json()
    return [response, json]
  }

  async delete(tableId: string, body: any): Promise<[Response, Row[]]> {
    const response = await this.api.del(`/${tableId}/rows/`, { body })
    const json = await response.json()
    return [response, json]
  }
}
