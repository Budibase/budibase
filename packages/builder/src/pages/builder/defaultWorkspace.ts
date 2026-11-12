import type { EnrichedWorkspace } from "@/types"

type SelectableWorkspace = Pick<
  EnrichedWorkspace,
  "devId" | "editable" | "favourite"
>

export const getDefaultWorkspace = <T extends SelectableWorkspace>(
  workspaces: T[],
  lastVisitedWorkspaceId?: string
): T | undefined => {
  return (
    workspaces.find(
      workspace =>
        workspace.editable && workspace.devId === lastVisitedWorkspaceId
    ) ??
    workspaces.find(workspace => workspace.editable && workspace.favourite) ??
    workspaces.find(workspace => workspace.editable)
  )
}
