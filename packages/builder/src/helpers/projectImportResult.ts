import type { ImportProjectResponse } from "@budibase/types"

interface ProjectImportResult {
  workspaceId: string
  userId: string
  response: ImportProjectResponse
}

let pendingResult: ProjectImportResult | undefined

export const saveProjectImportResult = (result: ProjectImportResult) => {
  pendingResult = result
}

export const takeProjectImportResult = ({
  workspaceId,
  userId,
}: {
  workspaceId: string
  userId: string
}) => {
  const result = pendingResult
  pendingResult = undefined
  if (result?.workspaceId === workspaceId && result.userId === userId) {
    return result.response
  }
}
