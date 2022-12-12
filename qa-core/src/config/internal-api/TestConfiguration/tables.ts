import { Response } from "node-fetch"
import { Table } from "@budibase/types"
import InternalAPIClient from "./InternalAPIClient"
import { responseMessage } from "../fixtures/types/responseMessage"

export default class TablesApi {
  api: InternalAPIClient

  constructor(apiClient: InternalAPIClient) {
    this.api = apiClient
  }

  async getAll(expectedNumber: Number): Promise<[Response, Table[]]> {
    const response = await this.api.get(`/tables`)
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    expect(json.length).toBe(expectedNumber)
    return [response, json]
  }

  async getTableById(id: string): Promise<[Response, Table]> {
    const response = await this.api.get(`/tables/${id}`)
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    expect(json._id).toEqual(id)
    return [response, json]
  }

  async save(body: any, columnAdded?: boolean): Promise<[Response, Table]> {
    const response = await this.api.post(`/tables`, { body })
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    expect(json._id).toBeDefined()
    expect(json._rev).toBeDefined()
    if (columnAdded) {
      expect(json.schema.TestColumn).toBeDefined()
    }

    return [response, json]
  }

  async delete(
    id: string,
    revId: string
  ): Promise<[Response, responseMessage]> {
    const response = await this.api.del(`/tables/${id}/${revId}`)
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    expect(json.message).toEqual(`Table ${id} deleted.`)
    return [response, json]
  }
}
