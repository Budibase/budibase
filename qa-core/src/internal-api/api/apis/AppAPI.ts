import { App } from "@budibase/types"
import { Response } from "node-fetch"
import {
  RouteConfig,
  AppPackageResponse,
  DeployConfig,
  MessageResponse,
  CreateAppRequest,
} from "../../../types"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"
import BaseAPI from "./BaseAPI"

interface RenameAppBody {
  name: string
}

export default class AppAPI extends BaseAPI {
  constructor(client: BudibaseInternalAPIClient) {
    super(client)
  }

  //  TODO Fix the fetch apps to receive an optional number of apps and compare if the received app is more or less.
  //  each possible scenario should have its own method.
  async fetchEmptyAppList(): Promise<[Response, App[]]> {
    const [response, json] = await this.get(`/applications?status=all`)
    expect(json.length).toBeGreaterThanOrEqual(0)
    return [response, json]
  }

  async fetchAllApplications(): Promise<[Response, App[]]> {
    const [response, json] = await this.get(`/applications?status=all`)
    expect(json.length).toBeGreaterThanOrEqual(1)
    return [response, json]
  }

  async canRender(): Promise<[Response, boolean]> {
    const [response, json] = await this.get("/routing/client")
    const publishedAppRenders = Object.keys(json.routes).length > 0
    expect(publishedAppRenders).toBe(true)
    return [response, publishedAppRenders]
  }

  async getAppPackage(appId: string): Promise<[Response, AppPackageResponse]> {
    const [response, json] = await this.get(`/applications/${appId}/appPackage`)
    expect(json.application.appId).toEqual(appId)
    return [response, json]
  }

  async publish(appId: string | undefined): Promise<[Response, DeployConfig]> {
    const [response, json] = await this.post(`/applications/${appId}/publish`)
    return [response, json]
  }

  async create(body: CreateAppRequest): Promise<App> {
    const [response, json] = await this.post(`/applications`, body)
    expect(json._id).toBeDefined()
    return json
  }

  async read(id: string): Promise<[Response, App]> {
    const [response, json] = await this.get(`/applications/${id}`)
    return [response, json.data]
  }

  async sync(appId: string): Promise<[Response, MessageResponse]> {
    const [response, json] = await this.post(`/applications/${appId}/sync`)
    return [response, json]
  }

  // TODO
  async updateClient(appId: string, body: any): Promise<[Response, App]> {
    const [response, json] = await this.put(
      `/applications/${appId}/client/update`,
      { body }
    )
    return [response, json]
  }

  async revertPublished(appId: string): Promise<[Response, MessageResponse]> {
    const [response, json] = await this.post(`/dev/${appId}/revert`)
    expect(json).toEqual({
      message: "Reverted changes successfully.",
    })
    return [response, json]
  }

  async revertUnpublished(appId: string): Promise<[Response, MessageResponse]> {
    const [response, json] = await this.post(
      `/dev/${appId}/revert`,
      undefined,
      400
    )
    expect(json).toEqual({
      message: "App has not yet been deployed",
      status: 400,
    })
    return [response, json]
  }

  async delete(appId: string): Promise<Response> {
    const [response, _] = await this.del(`/applications/${appId}`)
    return response
  }

  async rename(
    appId: string,
    oldName: string,
    body: RenameAppBody
  ): Promise<[Response, App]> {
    const [response, json] = await this.put(`/applications/${appId}`, body)
    expect(json.name).not.toEqual(oldName)
    return [response, json]
  }

  async getRoutes(screenExists?: boolean): Promise<[Response, RouteConfig]> {
    const [response, json] = await this.get(`/routing`)
    if (screenExists) {
      expect(json.routes["/test"]).toBeTruthy()
    } else {
      expect(json.routes["/test"]).toBeUndefined()
    }

    return [response, json]
  }

  async unpublish(appId: string): Promise<[Response]> {
    const [response, json] = await this.post(
      `/applications/${appId}/unpublish`,
      undefined,
      204
    )
    return [response]
  }

  async unlock(appId: string): Promise<[Response, MessageResponse]> {
    const [response, json] = await this.del(`/dev/${appId}/lock`)
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
    const [response, json] = await this.put(`/applications/${appId}`, body)
    expect(json.icon.name).toEqual(body.icon.name)
    expect(json.icon.color).toEqual(body.icon.color)
    return [response, json]
  }
}
