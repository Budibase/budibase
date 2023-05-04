import { Response } from "node-fetch"
import {
  Datasource,
  CreateDatasourceResponse,
  UpdateDatasourceResponse,
} from "@budibase/types"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"

export default class DatasourcesAPI {
  client: BudibaseInternalAPIClient

  constructor(client: BudibaseInternalAPIClient) {
    this.client = client
  }

  async getIntegrations(): Promise<[Response, any]> {
    const [response, json] = await this.client.get(`/integrations`)
    expect(response).toHaveStatusCode(200)
    const integrationsCount = Object.keys(json).length
    expect(integrationsCount).toBe(16)
    return [response, json]
  }

  async getAll(): Promise<[Response, Datasource[]]> {
    const [response, json] = await this.client.get(`/datasources`)
    expect(response).toHaveStatusCode(200)
    expect(json.length).toBeGreaterThan(0)
    return [response, json]
  }

  async getTable(dataSourceId: string): Promise<[Response, Datasource]> {
    const [response, json] = await this.client.get(
      `/datasources/${dataSourceId}`
    )
    expect(response).toHaveStatusCode(200)
    expect(json._id).toEqual(dataSourceId)
    return [response, json]
  }

  async add(body: any): Promise<[Response, CreateDatasourceResponse]> {
    const [response, json] = await this.client.post(`/datasources`, { body })
    expect(response).toHaveStatusCode(200)
    expect(json.datasource._id).toBeDefined()
    expect(json.datasource._rev).toBeDefined()

    return [response, json]
  }

  async update(body: any): Promise<[Response, UpdateDatasourceResponse]> {
    const [response, json] = await this.client.put(`/datasources/${body._id}`, {
      body,
    })
    expect(response).toHaveStatusCode(200)
    expect(json.datasource._id).toBeDefined()
    expect(json.datasource._rev).toBeDefined()

    return [response, json]
  }

  async previewQuery(body: any): Promise<[Response, any]> {
    const [response, json] = await this.client.post(`/queries/preview`, {
      body,
    })
    expect(response).toHaveStatusCode(200)
    return [response, json]
  }

  async saveQuery(body: any): Promise<[Response, any]> {
    const [response, json] = await this.client.post(`/queries`, {
      body,
    })
    expect(response).toHaveStatusCode(200)
    return [response, json]
  }

  async getQuery(queryId: string): Promise<[Response, any]> {
    const [response, json] = await this.client.get(`/queries/${queryId}`)
    expect(response).toHaveStatusCode(200)
    return [response, json]
  }

  async getQueryPermissions(queryId: string): Promise<[Response, any]> {
    const [response, json] = await this.client.get(`/permissions/${queryId}`)
    expect(response).toHaveStatusCode(200)
    return [response, json]
  }

  async delete(dataSourceId: string, revId: string): Promise<Response> {
    const [response, json] = await this.client.del(
      `/datasources/${dataSourceId}/${revId}`
    )
    expect(response).toHaveStatusCode(200)
    return response
  }
}
