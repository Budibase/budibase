import { sdk } from "@budibase/shared-core"
import {
  AddWorkspaceSampleDataResponse,
  ClearDevLockResponse,
  CreateWorkspaceRequest,
  CreateWorkspaceResponse,
  DeleteWorkspaceResponse,
  DuplicateWorkspaceRequest,
  DuplicateWorkspaceResponse,
  FetchAppDefinitionResponse,
  FetchAppPackageResponse,
  FetchDeploymentResponse,
  FetchPublishedAppsResponse,
  FetchWorkspacesResponse,
  GetDiagnosticsResponse,
  ImportToUpdateWorkspaceRequest,
  ImportToUpdateWorkspaceResponse,
  PublishWorkspaceRequest,
  PublishWorkspaceResponse,
  RevertAppClientResponse,
  RevertWorkspaceResponse,
  UnpublishWorkspaceResponse,
  UpdateAppClientResponse,
  UpdateWorkspaceRequest,
  UpdateWorkspaceResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface AppEndpoints {
  fetchAppPackage: (workspaceId: string) => Promise<FetchAppPackageResponse>
  saveAppMetadata: (
    workspaceId: string,
    metadata: UpdateWorkspaceRequest
  ) => Promise<UpdateWorkspaceResponse>
  unpublishApp: (workspaceId: string) => Promise<UnpublishWorkspaceResponse>
  publishAppChanges: (
    workspaceId: string,
    opts?: PublishWorkspaceRequest
  ) => Promise<PublishWorkspaceResponse>
  revertAppChanges: (workspaceId: string) => Promise<RevertWorkspaceResponse>
  updateAppClientVersion: (
    workspaceId: string
  ) => Promise<UpdateAppClientResponse>
  revertAppClientVersion: (
    workspaceId: string
  ) => Promise<RevertAppClientResponse>
  releaseAppLock: (workspaceId: string) => Promise<ClearDevLockResponse>
  getAppDeployments: () => Promise<FetchDeploymentResponse>
  createApp: (
    workspace: CreateWorkspaceRequest | FormData
  ) => Promise<CreateWorkspaceResponse>
  deleteApp: (workspaceId: string) => Promise<DeleteWorkspaceResponse>
  duplicateApp: (
    workspaceId: string,
    workspace: DuplicateWorkspaceRequest
  ) => Promise<DuplicateWorkspaceResponse>
  updateAppFromExport: (
    workspaceId: string,
    body: ImportToUpdateWorkspaceRequest,
    appExport: File
  ) => Promise<ImportToUpdateWorkspaceResponse>
  fetchSystemDebugInfo: () => Promise<GetDiagnosticsResponse>
  getApps: () => Promise<FetchWorkspacesResponse>
  fetchComponentLibDefinitions: (
    workspaceId: string
  ) => Promise<FetchAppDefinitionResponse>
  addSampleData: (
    workspaceId: string
  ) => Promise<AddWorkspaceSampleDataResponse>
  getPublishedApps: () => Promise<FetchPublishedAppsResponse["apps"]>

  // Missing request or response types
  importApps: (apps: any) => Promise<any>
}

export const buildAppEndpoints = (API: BaseAPIClient): AppEndpoints => ({
  /**
   * Fetches screen definition for a workspace.
   * @param workspaceId the ID of the workspace to fetch from
   */
  fetchAppPackage: async workspaceId => {
    return await API.get({
      url: `/api/applications/${workspaceId}/appPackage`,
    })
  },

  /**
   * Saves and patches metadata about a workspace.
   * @param workspaceId the ID of the workspace to update
   * @param metadata the workspace metadata to save
   */
  saveAppMetadata: async (workspaceId, metadata) => {
    return await API.put({
      url: `/api/applications/${workspaceId}`,
      body: metadata,
    })
  },

  /**
   * Publishes the current workspace.
   */
  publishAppChanges: async (workspaceId, opts) => {
    return await API.post({
      url: `/api/applications/${workspaceId}/publish`,
      body: opts,
    })
  },

  /**
   * Reverts a workspace to a previous version.
   * @param workspaceId the workspace ID to revert
   */
  revertAppChanges: async workspaceId => {
    return await API.post({
      url: `/api/dev/${workspaceId}/revert`,
    })
  },

  /**
   * Updates a workspace's version of the client library.
   * @param workspaceId the workspace ID to update
   */
  updateAppClientVersion: async workspaceId => {
    return await API.post({
      url: `/api/applications/${workspaceId}/client/update`,
    })
  },

  /**
   * Reverts a workspace's client library to the previous version.
   * @param workspaceId the workspace ID to revert
   */
  revertAppClientVersion: async workspaceId => {
    return await API.post({
      url: `/api/applications/${workspaceId}/client/revert`,
    })
  },

  /**
   * Gets a list of workspace deployments.
   */
  getAppDeployments: async () => {
    return await API.get({
      url: "/api/deployments",
    })
  },

  /**
   * Creates a workspace.
   * @param workspace the workspace to create
   */
  createApp: async workspace => {
    if (workspace instanceof FormData) {
      return await API.post({
        url: "/api/applications",
        body: workspace,
        json: false,
      })
    }

    return await API.post({
      url: "/api/applications",
      body: workspace,
    })
  },

  /**
   * Duplicate an existing workspace
   * @param workspace the workspace to duplicate
   */
  duplicateApp: async (workspaceId, workspace) => {
    return await API.post({
      url: `/api/applications/${workspaceId}/duplicate`,
      body: workspace,
    })
  },

  /**
   * Update a workspace using an export - the body
   * should be of type FormData, with a "file" and a "password" if encrypted.
   * @param workspaceId The ID of the workspace to update - this will always be
   * converted to development ID.
   * @param body a FormData body with a file and password.
   */
  updateAppFromExport: async (workspaceId, body, appExport) => {
    const devId = sdk.workspaces.getDevWorkspaceID(workspaceId)
    const formData = new FormData()
    formData.append("appExport", appExport)
    for (const [key, field] of Object.entries(body)) {
      formData.append(key, field)
    }
    return await API.post({
      url: `/api/applications/${devId}/import`,
      body: formData,
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
   * Unpublishes a published workspace.
   * @param workspaceId the production ID of the workspace to unpublish
   */
  unpublishApp: async workspaceId => {
    return await API.post({
      url: `/api/applications/${workspaceId}/unpublish`,
    })
  },

  /**
   * Deletes a development workspace.
   * @param workspaceId the development workspace ID to delete
   */
  deleteApp: async workspaceId => {
    return await API.delete({
      url: `/api/applications/${workspaceId}`,
    })
  },

  /**
   * Releases the lock on a development workspace.
   * @param workspaceId the development workspace ID to unlock
   */
  releaseAppLock: async workspaceId => {
    return await API.delete({
      url: `/api/dev/${workspaceId}/lock`,
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
   * Gets a list of workspaces.
   */
  getApps: async () => {
    return await API.get({
      url: "/api/applications?status=all",
    })
  },

  /**
   * Fetches the definitions for component library components. This includes
   * their props and other metadata from components.json.
   * @param workspaceId ID of the currently running app
   */
  fetchComponentLibDefinitions: async workspaceId => {
    return await API.get({
      url: `/api/${workspaceId}/components/definitions`,
    })
  },

  /**
   * Adds sample data to a workspace
   * @param workspaceId the app ID
   */
  addSampleData: async workspaceId => {
    return await API.post({
      url: `/api/applications/${workspaceId}/sample`,
    })
  },

  getPublishedApps: async () => {
    const response = await API.get<FetchPublishedAppsResponse>({
      url: `/api/client/applications`,
    })
    return response.apps
  },
})
