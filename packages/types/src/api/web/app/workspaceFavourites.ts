import { DocumentDestroyResponse } from "@budibase/nano"
import { WorkspaceFavourite } from "../../../documents"

export enum WorkspaceResource {
  DATASOURCE = "datasource",
  QUERY = "query",
  TABLE = "table",
  AUTOMATION = "automation",
  WORKSPACE_APP = "workspace_app",
  VIEW = "view",
}

export interface AddWorkspaceFavouriteRequest {
  resourceType: WorkspaceResource
  resourceId: string
}

export interface AddWorkspaceFavouriteResponse {
  _id: string
  _rev: string
  resourceType: WorkspaceResource
  resourceId: string
}

export interface WorkspaceFavouriteResponse {
  favourites: WorkspaceFavourite[]
}

export interface DeleteWorkspaceFavouriteResponse
  extends DocumentDestroyResponse {}
