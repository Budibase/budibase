import { PublishStatusResource } from "../api"
import { WorkspaceApp, Screen } from "../documents"

export interface UIWorkspaceApp extends WorkspaceApp {
  screens: Screen[]
  publishStatus: PublishStatusResource
}
