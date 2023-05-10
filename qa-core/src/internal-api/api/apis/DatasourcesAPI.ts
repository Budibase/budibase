import { Response } from "node-fetch"
import {
  Datasource,
  CreateDatasourceResponse,
  UpdateDatasourceResponse,
} from "@budibase/types"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"
import BaseAPI from "./BaseAPI"

export default class DatasourcesAPI extends BaseAPI {
  constructor(client: BudibaseInternalAPIClient) {
    super(client)
  }

  async getIntegrations(): Promise<[Response, any]> {
    const [response, json] = await this.get(`/integrations`)
    const integrationsCount = Object.keys(json).length
    expect(integrationsCount).toBe(16)
    return [response, json]
  }

  async getAll(): Promise<[Response, Datasource[]]> {
    const [response, json] = await this.get(`/datasources`)
    expect(json.length).toBeGreaterThan(0)
    return [response, json]
  }

  async getTable(dataSourceId: string): Promise<[Response, Datasource]> {
    const [response, json] = await this.get(`/datasources/${dataSourceId}`)
    expect(json._id).toEqual(dataSourceId)
    return [response, json]
  }

  async add(body: any): Promise<[Response, CreateDatasourceResponse]> {
    const [response, json] = await this.post(`/datasources`, body)
    expect(json.datasource._id).toBeDefined()
    expect(json.datasource._rev).toBeDefined()

    return [response, json]
  }

  async update(body: any): Promise<[Response, UpdateDatasourceResponse]> {
    const [response, json] = await this.put(`/datasources/${body._id}`, body)
    expect(json.datasource._id).toBeDefined()
    expect(json.datasource._rev).toBeDefined()

    return [response, json]
  }

  async previewQuery(body: any): Promise<[Response, any]> {
    const [response, json] = await this.post(`/queries/preview`, body)
    return [response, json]
  }

  async saveQuery(body: any): Promise<[Response, any]> {
    const [response, json] = await this.post(`/queries`, body)
    return [response, json]
  }

  async getQuery(queryId: string): Promise<[Response, any]> {
    const [response, json] = await this.get(`/queries/${queryId}`)

    return [response, json]
  }

  async getQueryPermissions(queryId: string): Promise<[Response, any]> {
    const [response, json] = await this.get(`/permissions/${queryId}`)

    return [response, json]
  }

  async delete(dataSourceId: string, revId: string): Promise<Response> {
    const [response, json] = await this.del(
      `/datasources/${dataSourceId}/${revId}`
    )

    return response
  }
}
