import type { ImportProjectResponse } from "@budibase/types"

interface ProjectImportResult {
  workspaceId: string
  userId: string
  response: ImportProjectResponse
}

let pendingResult: ProjectImportResult | undefined

const storageKey = ({
  workspaceId,
  userId,
}: Omit<ProjectImportResult, "response">) =>
  `budibase:project-import:${userId}:${workspaceId}`

export const saveProjectImportResult = (result: ProjectImportResult) => {
  pendingResult = result
  try {
    sessionStorage.setItem(storageKey(result), JSON.stringify(result.response))
  } catch (_error) {
    // Keep the in-memory handoff when browser storage is unavailable.
  }
}

export const takeProjectImportResult = ({
  workspaceId,
  userId,
}: {
  workspaceId: string
  userId: string
}) => {
  const result = pendingResult
  const matches =
    result?.workspaceId === workspaceId && result.userId === userId
  if (matches) {
    pendingResult = undefined
  }
  try {
    const key = storageKey({ workspaceId, userId })
    const stored = sessionStorage.getItem(key)
    sessionStorage.removeItem(key)
    if (stored && !matches) {
      const response = JSON.parse(stored) as ImportProjectResponse
      const counts = response?.dataImport
      if (
        typeof response?.project?._id === "string" &&
        typeof response.project.name === "string" &&
        Array.isArray(response.requirements) &&
        response.requirements.every(
          requirement =>
            requirement &&
            typeof requirement.resourceId === "string" &&
            [
              "datasource_secrets",
              "agent_secrets",
              "agent_ai_config",
              "automation_credentials",
            ].includes(requirement.type) &&
            typeof requirement.name === "string" &&
            typeof requirement.reason === "string"
        ) &&
        Array.isArray(response.unsupportedContent) &&
        response.unsupportedContent.every(
          content => content && typeof content.reason === "string"
        ) &&
        (!counts ||
          [
            counts.tables,
            counts.rows,
            counts.relationships,
            counts.attachments,
          ].every(
            count =>
              typeof count === "number" && Number.isFinite(count) && count >= 0
          ))
      ) {
        return response
      }
    }
  } catch (_error) {
    // Fall back to the in-memory result if storage is unavailable or invalid.
  }
  if (matches) {
    return result.response
  }
}
