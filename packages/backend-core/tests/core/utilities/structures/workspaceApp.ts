import { RequiredKeys, WorkspaceApp } from "@budibase/types"
import { generator } from "./generator"

export function workspaceApp(): WorkspaceApp {
  const result: RequiredKeys<WorkspaceApp> = {
    name: generator.word(),
    urlPrefix: `/${generator.word()}`,
    icon: "Monitoring",
    iconColor: undefined,

    _id: undefined,
    _rev: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  }
  return result
}
