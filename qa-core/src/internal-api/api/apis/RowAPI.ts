import { Response } from "node-fetch"
import { Row } from "@budibase/types"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"

export default class RowAPI {
  rowAdded: boolean
  client: BudibaseInternalAPIClient

  constructor(client: BudibaseInternalAPIClient) {
    this.client = client
    this.rowAdded = false
  }

  async getAll(tableId: string): Promise<[Response, Row[]]> {
    const [response, json] = await this.client.get(`/${tableId}/rows`)
    if (this.rowAdded) {
      expect(response).toHaveStatusCode(200)
      expect(json.length).toBeGreaterThanOrEqual(1)
    }
    return [response, json]
  }
  async add(tableId: string, body: any): Promise<[Response, Row]> {
    const [response, json] = await this.client.post(`/${tableId}/rows`, {
      body,
    })
    expect(response).toHaveStatusCode(200)
    expect(json._id).toBeDefined()
    expect(json._rev).toBeDefined()
    expect(json.tableId).toEqual(tableId)
    this.rowAdded = true
    return [response, json]
  }

  async delete(tableId: string, body: any): Promise<[Response, Row[]]> {
    const [response, json] = await this.client.del(`/${tableId}/rows/`, {
      body,
    })
    expect(response).toHaveStatusCode(200)
    return [response, json]
  }

  async searchNoPagination(
    tableId: string,
    body: any
  ): Promise<[Response, Row[]]> {
    const [response, json] = await this.client.post(`/${tableId}/search`, {
      body,
    })
    expect(response).toHaveStatusCode(200)
    expect(json.hasNextPage).toEqual(false)
    return [response, json.rows]
  }

  async searchWithPagination(
    tableId: string,
    body: any
  ): Promise<[Response, Row[]]> {
    const [response, json] = await this.client.post(`/${tableId}/search`, {
      body,
    })
    expect(response).toHaveStatusCode(200)
    expect(json.hasNextPage).toEqual(true)
    expect(json.rows.length).toEqual(10)
    return [response, json.rows]
  }
}
