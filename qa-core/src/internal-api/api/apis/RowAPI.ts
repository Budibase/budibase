import { Response } from "node-fetch"
import { Row } from "@budibase/types"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"
import BaseAPI from "./BaseAPI"

export default class RowAPI extends BaseAPI {
  rowAdded: boolean

  constructor(client: BudibaseInternalAPIClient) {
    super(client)
    this.rowAdded = false
  }

  async getAll(tableId: string): Promise<[Response, Row[]]> {
    const [response, json] = await this.get(`/${tableId}/rows`)
    if (this.rowAdded) {
      expect(json.length).toBeGreaterThanOrEqual(1)
    }
    return [response, json]
  }
  async add(tableId: string, body: Row): Promise<[Response, Row]> {
    const [response, json] = await this.post(`/${tableId}/rows`, body)
    expect(json._id).toBeDefined()
    expect(json._rev).toBeDefined()
    expect(json.tableId).toEqual(tableId)
    this.rowAdded = true
    return [response, json]
  }

  async delete(tableId: string, body: Row): Promise<[Response, Row[]]> {
    const [response, json] = await this.del(
      `/${tableId}/rows/`,
      undefined,
      body
    )
    return [response, json]
  }

  async searchNoPagination(
    tableId: string,
    body: string
  ): Promise<[Response, Row[]]> {
    const [response, json] = await this.post(`/${tableId}/search`, body)
    expect(json.hasNextPage).toEqual(false)
    return [response, json.rows]
  }

  async searchWithPagination(
    tableId: string,
    body: string
  ): Promise<[Response, Row[]]> {
    const [response, json] = await this.post(`/${tableId}/search`, body)
    expect(json.hasNextPage).toEqual(true)
    expect(json.rows.length).toEqual(10)
    return [response, json.rows]
  }
}
