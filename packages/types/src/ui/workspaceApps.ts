import { WorkspaceApp, Screen } from "../documents"

export interface UIWorkspaceApp extends WorkspaceApp {
  screens: Screen[]
}
