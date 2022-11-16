import { Application } from "@budibase/server/api/controllers/public/mapping/types"
import { App } from "@budibase/types"
import { Response } from "node-fetch"
import InternalAPIClient from "./InternalAPIClient"
import { RouteConfig } from "../fixtures/types/routing"
import { AppPackageResponse } from "../fixtures/types/appPackage"
import { DeployConfig } from "../fixtures/types/deploy"
import { responseMessage } from "../fixtures/types/responseMessage"
import { UnpublishAppResponse } from "../fixtures/types/unpublishAppResponse"

export default class AppApi {
  api: InternalAPIClient
  constructor(apiClient: InternalAPIClient) {
    this.api = apiClient
  }

  async fetchEmptyAppList(): Promise<[Response, Application[]]> {
    const response = await this.api.get(`/applications?status=all`)
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    expect(json.length).toEqual(0)
    return [response, json]
  }

  async fetchAllApplications(): Promise<[Response, Application[]]> {
    const response = await this.api.get(`/applications?status=all`)
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    expect(json.length).toBeGreaterThanOrEqual(1)
    return [response, json]
  }

  async canRender(): Promise<[Response, boolean]> {
    const response = await this.api.get("/routing/client")
    const json = await response.json()
    const publishedAppRenders = Object.keys(json.routes).length > 0
    expect(response).toHaveStatusCode(200)
    expect(publishedAppRenders).toBe(true)
    return [response, publishedAppRenders]
  }

  async getAppPackage(appId: string): Promise<[Response, AppPackageResponse]> {
    const response = await this.api.get(`/applications/${appId}/appPackage`)
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    expect(json.application.appId).toEqual(appId)
    return [response, json]
  }

  async publish(appUrl: string): Promise<[Response, DeployConfig]> {
    const response = await this.api.post("/deploy")
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    expect(json).toEqual({
      _id: expect.any(String),
      appUrl: appUrl,
      status: "SUCCESS",
    })
    return [response, json]
  }

  async create(body: any): Promise<Partial<App>> {
    const response = await this.api.post(`/applications`, { body })
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    expect(json._id).toBeDefined()
    return json
  }

  async read(id: string): Promise<[Response, Application]> {
    const response = await this.api.get(`/applications/${id}`)
    const json = await response.json()
    return [response, json.data]
  }

  async sync(appId: string): Promise<[Response, responseMessage]> {
    const response = await this.api.post(`/applications/${appId}/sync`)
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    return [response, json]
  }

  // TODO
  async updateClient(
    appId: string,
    body: any
  ): Promise<[Response, Application]> {
    const response = await this.api.put(
      `/applications/${appId}/client/update`,
      { body }
    )
    const json = await response.json()
    return [response, json]
  }

  async revertPublished(appId: string): Promise<[Response, responseMessage]> {
    const response = await this.api.post(`/dev/${appId}/revert`)
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    expect(json).toEqual({
      message: "Reverted changes successfully.",
    })
    return [response, json]
  }

  async revertUnpublished(appId: string): Promise<[Response, responseMessage]> {
    const response = await this.api.post(`/dev/${appId}/revert`)
    const json = await response.json()
    expect(response).toHaveStatusCode(400)
    expect(json).toEqual({
      message: "App has not yet been deployed",
      status: 400,
    })
    return [response, json]
  }

  async delete(appId: string): Promise<[Response, any]> {
    const response = await this.api.del(`/applications/${appId}`)
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    return [response, json]
  }

  async update(
    appId: string,
    oldName: string,
    body: any
  ): Promise<[Response, Application]> {
    const response = await this.api.put(`/applications/${appId}`, { body })
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    expect(json.name).not.toEqual(oldName)
    return [response, json]
  }

  async addScreentoApp(body: any): Promise<[Response, Application]> {
    const response = await this.api.post(`/screens`, { body })
    const json = await response.json()
    return [response, json]
  }

  async getRoutes(screenExists?: boolean): Promise<[Response, RouteConfig]> {
    const response = await this.api.get(`/routing`)
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    if (screenExists) {
      expect(json.routes["/test"]).toBeTruthy()
    } else {
      expect(json.routes["/test"]).toBeUndefined()
    }

    return [response, json]
  }

  async unpublish(appId: string): Promise<[Response, UnpublishAppResponse]> {
    const response = await this.api.del(`/applications/${appId}?unpublish=1`)
    expect(response).toHaveStatusCode(200)
    const json = await response.json()
    expect(json.data.ok).toBe(true)
    expect(json.ok).toBe(true)
    expect(json.status).toBe(200)
    return [response, json]
  }
}
