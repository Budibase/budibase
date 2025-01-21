import {
  App,
  PublishResponse,
  type CreateAppRequest,
  type FetchAppDefinitionResponse,
  type FetchAppPackageResponse,
  DuplicateAppResponse,
  UpdateAppRequest,
  UpdateAppResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"
import { AppStatus } from "../../../db/utils"
import { constants } from "@budibase/backend-core"

export class ApplicationAPI extends TestAPI {
  create = async (
    app: CreateAppRequest,
    expectations?: Expectations
  ): Promise<App> => {
    const files = app.fileToImport ? { fileToImport: app.fileToImport } : {}
    delete app.fileToImport
    return await this._post<App>("/api/applications", {
      fields: app,
      files,
      expectations,
    })
  }

  delete = async (
    appId: string,
    expectations?: Expectations
  ): Promise<void> => {
    await this._delete(`/api/applications/${appId}`, { expectations })
  }

  publish = async (appId: string): Promise<PublishResponse> => {
    return await this._post<PublishResponse>(
      `/api/applications/${appId}/publish`,
      {
        // While the publish endpoint does take an :appId parameter, it doesn't
        // use it. It uses the appId from the context.
        headers: {
          [constants.Header.APP_ID]: appId,
        },
      }
    )
  }

  unpublish = async (appId: string): Promise<void> => {
    await this._post(`/api/applications/${appId}/unpublish`, {
      expectations: { status: 200 },
    })
  }

  sync = async (
    appId: string,
    expectations?: Expectations
  ): Promise<{ message: string }> => {
    return await this._post<{ message: string }>(
      `/api/applications/${appId}/sync`,
      { expectations }
    )
  }

  get = async (appId: string, expectations?: Expectations): Promise<App> => {
    return await this._get<App>(`/api/applications/${appId}`, {
      // While the get endpoint does take an :appId parameter, it doesn't use
      // it. It uses the appId from the context.
      headers: {
        [constants.Header.APP_ID]: appId,
      },
      expectations,
    })
  }

  duplicateApp = async (
    appId: string,
    fields: object,
    expectations?: Expectations
  ): Promise<DuplicateAppResponse> => {
    let headers = {
      ...this.config.defaultHeaders(),
      [constants.Header.APP_ID]: appId,
    }
    return this._post(`/api/applications/${appId}/duplicate`, {
      headers,
      fields,
      expectations,
    })
  }

  getDefinition = async (
    appId: string,
    expectations?: Expectations
  ): Promise<FetchAppDefinitionResponse> => {
    return await this._get<FetchAppDefinitionResponse>(
      `/api/applications/${appId}/definition`,
      { expectations }
    )
  }

  getAppPackage = async (
    appId: string,
    expectations?: Expectations
  ): Promise<FetchAppPackageResponse> => {
    return await this._get<FetchAppPackageResponse>(
      `/api/applications/${appId}/appPackage`,
      { expectations }
    )
  }

  update = async (
    appId: string,
    app: UpdateAppRequest,
    expectations?: Expectations
  ): Promise<UpdateAppResponse> => {
    return await this._put<App>(`/api/applications/${appId}`, {
      body: app,
      expectations,
    })
  }

  updateClient = async (
    appId: string,
    expectations?: Expectations
  ): Promise<void> => {
    await this._post(`/api/applications/${appId}/client/update`, {
      // While the updateClient endpoint does take an :appId parameter, it doesn't
      // use it. It uses the appId from the context.
      headers: {
        [constants.Header.APP_ID]: appId,
      },
      expectations,
    })
  }

  revertClient = async (appId: string): Promise<void> => {
    await this._post(`/api/applications/${appId}/client/revert`, {
      // While the revertClient endpoint does take an :appId parameter, it doesn't
      // use it. It uses the appId from the context.
      headers: {
        [constants.Header.APP_ID]: appId,
      },
    })
  }

  fetch = async ({ status }: { status?: AppStatus } = {}): Promise<App[]> => {
    return await this._get<App[]>("/api/applications", {
      query: { status },
    })
  }

  addSampleData = async (appId: string): Promise<void> => {
    await this._post(`/api/applications/${appId}/sample`)
  }
}
