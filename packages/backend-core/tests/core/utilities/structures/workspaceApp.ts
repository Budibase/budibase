import {
  InsertWorkspaceAppRequest,
  RequiredKeys,
  WorkspaceApp,
} from "@budibase/types"
import { generator } from "./generator"

export function workspaceApp(props?: Partial<WorkspaceApp>): WorkspaceApp {
  const result: RequiredKeys<
    Omit<
      WorkspaceApp,
      | "_id"
      | "_rev"
      | "_deleted"
      | "createdAt"
      | "updatedAt"
      | "theme"
      | "customTheme"
    >
  > = {
    name: generator.guid(),
    url: `/${generator.guid().replace(/-/g, "")}`,
    projectIds: undefined,

    _id: undefined,
    _rev: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    navigation: {
      navigation: "Top",
    },
    isDefault: false,
    disabled: false,
    ...props,
  }
  return result
}

export function createRequest(
  props?: Partial<InsertWorkspaceAppRequest>
): InsertWorkspaceAppRequest {
  const result: RequiredKeys<InsertWorkspaceAppRequest> = {
    name: generator.guid(),
    url: `/${generator.guid().replace(/-/g, "")}`,
    disabled: false,
    projectIds: undefined,
    ...props,
  }
  return result
}
