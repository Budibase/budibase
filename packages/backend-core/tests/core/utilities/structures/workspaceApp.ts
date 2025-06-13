import {
  InsertWorkspaceAppRequest,
  RequiredKeys,
  WorkspaceApp,
} from "@budibase/types"
import { generator } from "./generator"

export function workspaceApp(props?: Partial<WorkspaceApp>): WorkspaceApp {
  const result: RequiredKeys<WorkspaceApp> = {
    name: generator.guid(),
    url: `/${generator.guid().replace(/-/g, "")}`,
    icon: "Monitoring",
    iconColor: undefined,

    _id: undefined,
    _rev: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    navigation: {
      navigation: "Top",
    },
    isDefault: false,

    ...props,
  }
  return result
}

export function createRequest(
  props?: Partial<InsertWorkspaceAppRequest>
): InsertWorkspaceAppRequest {
  const workspace = workspaceApp(props)

  const result: RequiredKeys<InsertWorkspaceAppRequest> = {
    name: workspace.name,
    url: workspace.url,
    icon: workspace.icon,
    iconColor: workspace.iconColor,
  }
  return result
}
