import { Response } from "supertest"
import {
  App,
  type CreateAppRequest,
  type FetchAppDefinitionResponse,
  type FetchAppPackageResponse,
} from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"
import { AppStatus } from "../../../db/utils"
import { constants } from "@budibase/backend-core"

export class ApplicationAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  create = async (app: CreateAppRequest): Promise<App> => {
    const request = this.request
      .post("/api/applications")
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)

    for (const key of Object.keys(app)) {
      request.field(key, (app as any)[key])
    }

    if (app.templateFile) {
      request.attach("templateFile", app.templateFile)
    }

    const result = await request

    if (result.statusCode !== 200) {
      throw new Error(JSON.stringify(result.body))
    }

    return result.body as App
  }

  delete = async (appId: string): Promise<void> => {
    await this.request
      .delete(`/api/applications/${appId}`)
      .set(this.config.defaultHeaders())
      .expect(200)
  }

  publish = async (
    appId: string
  ): Promise<{ _id: string; status: string; appUrl: string }> => {
    // While the publish endpoint does take an :appId parameter, it doesn't
    // use it. It uses the appId from the context.
    let headers = {
      ...this.config.defaultHeaders(),
      [constants.Header.APP_ID]: appId,
    }
    const result = await this.request
      .post(`/api/applications/${appId}/publish`)
      .set(headers)
      .expect("Content-Type", /json/)
      .expect(200)
    return result.body as { _id: string; status: string; appUrl: string }
  }

  unpublish = async (appId: string): Promise<void> => {
    await this.request
      .post(`/api/applications/${appId}/unpublish`)
      .set(this.config.defaultHeaders())
      .expect(204)
  }

  sync = async (
    appId: string,
    { statusCode }: { statusCode: number } = { statusCode: 200 }
  ): Promise<{ message: string }> => {
    const result = await this.request
      .post(`/api/applications/${appId}/sync`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(statusCode)
    return result.body
  }

  getRaw = async (appId: string): Promise<Response> => {
    // While the appPackage endpoint does take an :appId parameter, it doesn't
    // use it. It uses the appId from the context.
    let headers = {
      ...this.config.defaultHeaders(),
      [constants.Header.APP_ID]: appId,
    }
    const result = await this.request
      .get(`/api/applications/${appId}/appPackage`)
      .set(headers)
      .expect("Content-Type", /json/)
      .expect(200)
    return result
  }

  get = async (appId: string): Promise<App> => {
    const result = await this.getRaw(appId)
    return result.body.application as App
  }

  getDefinition = async (
    appId: string
  ): Promise<FetchAppDefinitionResponse> => {
    const result = await this.request
      .get(`/api/applications/${appId}/definition`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    return result.body as FetchAppDefinitionResponse
  }

  getAppPackage = async (appId: string): Promise<FetchAppPackageResponse> => {
    const result = await this.request
      .get(`/api/applications/${appId}/appPackage`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    return result.body
  }

  update = async (
    appId: string,
    app: { name?: string; url?: string }
  ): Promise<App> => {
    const request = this.request
      .put(`/api/applications/${appId}`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)

    for (const key of Object.keys(app)) {
      request.field(key, (app as any)[key])
    }

    const result = await request

    if (result.statusCode !== 200) {
      throw new Error(JSON.stringify(result.body))
    }

    return result.body as App
  }

  updateClient = async (appId: string): Promise<void> => {
    // While the updateClient endpoint does take an :appId parameter, it doesn't
    // use it. It uses the appId from the context.
    let headers = {
      ...this.config.defaultHeaders(),
      [constants.Header.APP_ID]: appId,
    }
    const response = await this.request
      .post(`/api/applications/${appId}/client/update`)
      .set(headers)
      .expect("Content-Type", /json/)

    if (response.statusCode !== 200) {
      throw new Error(JSON.stringify(response.body))
    }
  }

  revertClient = async (appId: string): Promise<void> => {
    // While the revertClient endpoint does take an :appId parameter, it doesn't
    // use it. It uses the appId from the context.
    let headers = {
      ...this.config.defaultHeaders(),
      [constants.Header.APP_ID]: appId,
    }
    const response = await this.request
      .post(`/api/applications/${appId}/client/revert`)
      .set(headers)
      .expect("Content-Type", /json/)

    if (response.statusCode !== 200) {
      throw new Error(JSON.stringify(response.body))
    }
  }

  fetch = async ({ status }: { status?: AppStatus } = {}): Promise<App[]> => {
    let query = []
    if (status) {
      query.push(`status=${status}`)
    }

    const result = await this.request
      .get(`/api/applications${query.length ? `?${query.join("&")}` : ""}`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    return result.body as App[]
  }
}
