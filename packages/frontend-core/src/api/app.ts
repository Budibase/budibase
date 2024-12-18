import { sdk } from "@budibase/shared-core"
import { BaseAPIClient } from "./types"
import {
  AddAppSampleDataResponse,
  ClearDevLockResponse,
  CreateAppRequest,
  CreateAppResponse,
  DeleteAppResponse,
  DuplicateAppRequest,
  DuplicateAppResponse,
  FetchAppDefinitionResponse,
  FetchAppPackageResponse,
  FetchAppsResponse,
  FetchDeploymentResponse,
  GetDiagnosticsResponse,
  ImportToUpdateAppRequest,
  ImportToUpdateAppResponse,
  PublishAppResponse,
  RevertAppClientResponse,
  RevertAppResponse,
  SetRevertableAppVersionRequest,
  SetRevertableAppVersionResponse,
  SyncAppResponse,
  UnpublishAppResponse,
  UpdateAppClientResponse,
  UpdateAppRequest,
  UpdateAppResponse,
} from "@budibase/types"

export interface AppEndpoints {
  fetchAppPackage: (appId: string) => Promise<FetchAppPackageResponse>
  saveAppMetadata: (
    appId: string,
    metadata: UpdateAppRequest
  ) => Promise<UpdateAppResponse>
  unpublishApp: (appId: string) => Promise<UnpublishAppResponse>
  publishAppChanges: (appId: string) => Promise<PublishAppResponse>
  revertAppChanges: (appId: string) => Promise<RevertAppResponse>
  updateAppClientVersion: (appId: string) => Promise<UpdateAppClientResponse>
  revertAppClientVersion: (appId: string) => Promise<RevertAppClientResponse>
  releaseAppLock: (appId: string) => Promise<ClearDevLockResponse>
  getAppDeployments: () => Promise<FetchDeploymentResponse>
  createApp: (app: CreateAppRequest) => Promise<CreateAppResponse>
  deleteApp: (appId: string) => Promise<DeleteAppResponse>
  duplicateApp: (
    appId: string,
    app: DuplicateAppRequest
  ) => Promise<DuplicateAppResponse>
  updateAppFromExport: (
    appId: string,
    body: ImportToUpdateAppRequest
  ) => Promise<ImportToUpdateAppResponse>
  fetchSystemDebugInfo: () => Promise<GetDiagnosticsResponse>
  syncApp: (appId: string) => Promise<SyncAppResponse>
  getApps: () => Promise<FetchAppsResponse>
  fetchComponentLibDefinitions: (
    appId: string
  ) => Promise<FetchAppDefinitionResponse>
  setRevertableVersion: (
    appId: string,
    revertableVersion: string
  ) => Promise<SetRevertableAppVersionResponse>
  addSampleData: (appId: string) => Promise<AddAppSampleDataResponse>

  // Missing request or response types
  importApps: (apps: any) => Promise<any>
}

export const buildAppEndpoints = (API: BaseAPIClient): AppEndpoints => ({
  /**
   * Fetches screen definition for an app.
   * @param appId the ID of the app to fetch from
   */
  fetchAppPackage: async appId => {
    return await API.get({
      url: `/api/applications/${appId}/appPackage`,
    })
  },

  /**
   * Saves and patches metadata about an app.
   * @param appId the ID of the app to update
   * @param metadata the app metadata to save
   */
  saveAppMetadata: async (appId, metadata) => {
    return await API.put({
      url: `/api/applications/${appId}`,
      body: metadata,
    })
  },

  /**
   * Publishes the current app.
   */
  publishAppChanges: async appId => {
    return await API.post({
      url: `/api/applications/${appId}/publish`,
    })
  },

  /**
   * Reverts an app to a previous version.
   * @param appId the app ID to revert
   */
  revertAppChanges: async appId => {
    return await API.post({
      url: `/api/dev/${appId}/revert`,
    })
  },

  /**
   * Updates an app's version of the client library.
   * @param appId the app ID to update
   */
  updateAppClientVersion: async appId => {
    return await API.post({
      url: `/api/applications/${appId}/client/update`,
    })
  },

  /**
   * Reverts an app's version of the client library to the previous version.
   * @param appId the app ID to revert
   */
  revertAppClientVersion: async appId => {
    return await API.post({
      url: `/api/applications/${appId}/client/revert`,
    })
  },

  /**
   * Gets a list of app deployments.
   */
  getAppDeployments: async () => {
    return await API.get({
      url: "/api/deployments",
    })
  },

  /**
   * Creates an app.
   * @param app the app to create
   */
  createApp: async app => {
    return await API.post({
      url: "/api/applications",
      body: app,
      json: false,
    })
  },

  /**
   * Duplicate an existing app
   * @param app the app to dupe
   */
  duplicateApp: async (appId, app) => {
    return await API.post({
      url: `/api/applications/${appId}/duplicate`,
      body: app,
      json: false,
    })
  },

  /**
   * Update an application using an export - the body
   * should be of type FormData, with a "file" and a "password" if encrypted.
   * @param appId The ID of the app to update - this will always be
   * converted to development ID.
   * @param body a FormData body with a file and password.
   */
  updateAppFromExport: async (appId, body) => {
    const devId = sdk.applications.getDevAppID(appId)
    return await API.post({
      url: `/api/applications/${devId}/import`,
      body,
      json: false,
    })
  },

  /**
   * Imports an export of all apps.
   * @param apps the FormData containing the apps to import
   */
  importApps: async apps => {
    return await API.post({
      url: "/api/cloud/import",
      body: apps,
      json: false,
    })
  },

  /**
   * Unpublishes a published app.
   * @param appId the production ID of the app to unpublish
   */
  unpublishApp: async appId => {
    return await API.post({
      url: `/api/applications/${appId}/unpublish`,
    })
  },

  /**
   * Deletes a dev app.
   * @param appId the dev app ID to delete
   */
  deleteApp: async appId => {
    return await API.delete({
      url: `/api/applications/${appId}`,
    })
  },

  /**
   * Releases the lock on a dev app.
   * @param appId the dev app ID to unlock
   */
  releaseAppLock: async appId => {
    return await API.delete({
      url: `/api/dev/${appId}/lock`,
    })
  },

  /**
   * Gets budibase platform debug information.
   */
  fetchSystemDebugInfo: async () => {
    return await API.get({
      url: `/api/debug/diagnostics`,
    })
  },

  /**
   * Syncs an app with the production database.
   * @param appId the ID of the app to sync
   */
  syncApp: async appId => {
    return await API.post({
      url: `/api/applications/${appId}/sync`,
    })
  },

  /**
   * Gets a list of apps.
   */
  getApps: async () => {
    return await API.get({
      url: "/api/applications?status=all",
    })
  },

  /**
   * Fetches the definitions for component library components. This includes
   * their props and other metadata from components.json.
   * @param appId ID of the currently running app
   */
  fetchComponentLibDefinitions: async appId => {
    return await API.get({
      url: `/api/${appId}/components/definitions`,
    })
  },

  /**
   * Adds sample data to an app
   * @param appId the app ID
   */
  addSampleData: async appId => {
    return await API.post({
      url: `/api/applications/${appId}/sample`,
    })
  },

  /**
   * Sets the revertable version of an app.
   * Used when manually reverting to older client versions.
   * @param appId the app ID
   * @param revertableVersion the version number
   */
  setRevertableVersion: async (appId, revertableVersion) => {
    return await API.post<
      SetRevertableAppVersionRequest,
      SetRevertableAppVersionResponse
    >({
      url: `/api/applications/${appId}/setRevertableVersion`,
      body: {
        revertableVersion,
      },
    })
  },
})
