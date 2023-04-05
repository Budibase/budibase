import { App } from "@budibase/types"
import { Response } from "node-fetch"
import {
  RouteConfig,
  AppPackageResponse,
  DeployConfig,
  MessageResponse,
} from "../../../types"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"

export default class AppAPI {
  client: BudibaseInternalAPIClient

  constructor(client: BudibaseInternalAPIClient) {
    this.client = client
  }

  //  TODO Fix the fetch apps to receive an optional number of apps and compare if the received app is more or less.
  //  each possible scenario should have its own method.
  async fetchEmptyAppList(): Promise<[Response, App[]]> {
    const [response, json] = await this.client.get(`/applications?status=all`)
    expect(response).toHaveStatusCode(200)
    expect(json.length).toBeGreaterThanOrEqual(0)
    return [response, json]
  }

  async fetchAllApplications(): Promise<[Response, App[]]> {
    const [response, json] = await this.client.get(`/applications?status=all`)
    expect(response).toHaveStatusCode(200)
    expect(json.length).toBeGreaterThanOrEqual(1)
    return [response, json]
  }

  async canRender(): Promise<[Response, boolean]> {
    const [response, json] = await this.client.get("/routing/client")
    expect(response).toHaveStatusCode(200)
    const publishedAppRenders = Object.keys(json.routes).length > 0
    expect(publishedAppRenders).toBe(true)
    return [response, publishedAppRenders]
  }

  async getAppPackage(appId: string): Promise<[Response, AppPackageResponse]> {
    const [response, json] = await this.client.get(
      `/applications/${appId}/appPackage`
    )
    expect(response).toHaveStatusCode(200)
    expect(json.application.appId).toEqual(appId)
    return [response, json]
  }

  async publish(appId: string | undefined): Promise<[Response, DeployConfig]> {
    const [response, json] = await this.client.post(
      `/applications/${appId}/publish`
    )
    expect(response).toHaveStatusCode(200)
    return [response, json]
  }

  async create(body: any): Promise<App> {
    const [response, json] = await this.client.post(`/applications`, { body })
    expect(response).toHaveStatusCode(200)
    expect(json._id).toBeDefined()
    return json
  }

  async read(id: string): Promise<[Response, App]> {
    const [response, json] = await this.client.get(`/applications/${id}`)
    return [response, json.data]
  }

  async sync(appId: string): Promise<[Response, MessageResponse]> {
    const [response, json] = await this.client.post(
      `/applications/${appId}/sync`
    )
    expect(response).toHaveStatusCode(200)
    return [response, json]
  }

  // TODO
  async updateClient(appId: string, body: any): Promise<[Response, App]> {
    const [response, json] = await this.client.put(
      `/applications/${appId}/client/update`,
      { body }
    )
    return [response, json]
  }

  async revertPublished(appId: string): Promise<[Response, MessageResponse]> {
    const [response, json] = await this.client.post(`/dev/${appId}/revert`)
    expect(response).toHaveStatusCode(200)
    expect(json).toEqual({
      message: "Reverted changes successfully.",
    })
    return [response, json]
  }

  async revertUnpublished(appId: string): Promise<[Response, MessageResponse]> {
    const [response, json] = await this.client.post(`/dev/${appId}/revert`)
    expect(response).toHaveStatusCode(400)
    expect(json).toEqual({
      message: "App has not yet been deployed",
      status: 400,
    })
    return [response, json]
  }

  async delete(appId: string): Promise<Response> {
    const [response, _] = await this.client.del(`/applications/${appId}`)
    expect(response).toHaveStatusCode(200)
    return response
  }

  async rename(
    appId: string,
    oldName: string,
    body: any
  ): Promise<[Response, App]> {
    const [response, json] = await this.client.put(`/applications/${appId}`, {
      body,
    })
    expect(response).toHaveStatusCode(200)
    expect(json.name).not.toEqual(oldName)
    return [response, json]
  }

  async addScreentoApp(body: any): Promise<[Response, App]> {
    const [response, json] = await this.client.post(`/screens`, { body })
    return [response, json]
  }

  async getRoutes(screenExists?: boolean): Promise<[Response, RouteConfig]> {
    const [response, json] = await this.client.get(`/routing`)
    expect(response).toHaveStatusCode(200)
    if (screenExists) {
      expect(json.routes["/test"]).toBeTruthy()
    } else {
      expect(json.routes["/test"]).toBeUndefined()
    }

    return [response, json]
  }

  async unpublish(appId: string): Promise<[Response]> {
    const [response, json] = await this.client.post(
      `/applications/${appId}/unpublish`
    )
    expect(response).toHaveStatusCode(204)
    return [response]
  }

  async unlock(appId: string): Promise<[Response, MessageResponse]> {
    const [response, json] = await this.client.del(`/dev/${appId}/lock`)
    expect(response).toHaveStatusCode(200)
    expect(json.message).toEqual("Lock released successfully.")
    return [response, json]
  }

  async updateIcon(appId: string): Promise<[Response, App]> {
    const body = {
      icon: {
        name: "ConversionFunnel",
        color: "var(--spectrum-global-color-red-400)",
      },
    }
    const [response, json] = await this.client.put(`/applications/${appId}`, {
      body,
    })
    expect(response).toHaveStatusCode(200)
    expect(json.icon.name).toEqual(body.icon.name)
    expect(json.icon.color).toEqual(body.icon.color)
    return [response, json]
  }
}
