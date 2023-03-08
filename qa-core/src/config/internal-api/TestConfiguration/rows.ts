import { Response } from "node-fetch"
import { Row } from "@budibase/types"
import InternalAPIClient from "./InternalAPIClient"

export default class RowsApi {
  api: InternalAPIClient
  rowAdded: boolean
  constructor(apiClient: InternalAPIClient) {
    this.api = apiClient
    this.rowAdded = false
  }

  async getAll(tableId: string): Promise<[Response, Row[]]> {
    const response = await this.api.get(`/${tableId}/rows`)
    const json = await response.json()
    if (this.rowAdded) {
      expect(response).toHaveStatusCode(200)
      expect(json.length).toBeGreaterThanOrEqual(1)
    }
    return [response, json]
  }
  async add(tableId: string, body: any): Promise<[Response, Row]> {
    const response = await this.api.post(`/${tableId}/rows`, { body })
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    expect(json._id).toBeDefined()
    expect(json._rev).toBeDefined()
    expect(json.tableId).toEqual(tableId)
    this.rowAdded = true
    return [response, json]
  }

  async delete(tableId: string, body: any): Promise<[Response, Row[]]> {
    const response = await this.api.del(`/${tableId}/rows/`, { body })
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    return [response, json]
  }

  async searchNoPagination(
    tableId: string,
    body: any
  ): Promise<[Response, Row[]]> {
    const response = await this.api.post(`/${tableId}/search`, { body })
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    expect(json.hasNextPage).toEqual(false)
    return [response, json.rows]
  }

  async searchWithPagination(
    tableId: string,
    body: any
  ): Promise<[Response, Row[]]> {
    const response = await this.api.post(`/${tableId}/search`, { body })
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    expect(json.hasNextPage).toEqual(true)
    expect(json.rows.length).toEqual(10)
    return [response, json.rows]
  }
}
