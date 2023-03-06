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
  //  TODO Fix the fetch apps to receive an optional number of apps and compare if the received app is more or less.
  //  each possible scenario should have its own method.
  async fetchEmptyAppList(): Promise<[Response, Application[]]> {
    const response = await this.api.get(`/applications?status=all`)
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    expect(json.length).toBeGreaterThanOrEqual(0)
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
    expect(response).toHaveStatusCode(200)
    const json = await response.json()
    const publishedAppRenders = Object.keys(json.routes).length > 0
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

  async publish(appId: string | undefined): Promise<[Response, DeployConfig]> {
    const response = await this.api.post(`/applications/${appId}/publish`)
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
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

  async delete(appId: string): Promise<Response> {
    const response = await this.api.del(`/applications/${appId}`)
    expect(response).toHaveStatusCode(200)
    return response
  }

  async rename(
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

  async unpublish(appId: string): Promise<[Response]> {
    const response = await this.api.post(`/applications/${appId}/unpublish`)
    expect(response).toHaveStatusCode(204)
    return [response]
  }

  async unlock(appId: string): Promise<[Response, responseMessage]> {
    const response = await this.api.del(`/dev/${appId}/lock`)
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    expect(json.message).toEqual("Lock released successfully.")
    return [response, json]
  }

  async updateIcon(appId: string): Promise<[Response, Application]> {
    const body = {
      icon: {
        name: "ConversionFunnel",
        color: "var(--spectrum-global-color-red-400)",
      },
    }
    const response = await this.api.put(`/applications/${appId}`, { body })
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    expect(json.icon.name).toEqual(body.icon.name)
    expect(json.icon.color).toEqual(body.icon.color)
    return [response, json]
  }
}
