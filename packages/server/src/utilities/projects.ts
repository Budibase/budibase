import { features, HTTPError } from "@budibase/backend-core"
import { DocumentType, FeatureFlag, prefixed } from "@budibase/types"
import sdk from "../sdk"

export const resolveProjectId = async (projectId?: string | null) => {
  if (projectId == null) {
    return undefined
  }

  if (typeof projectId !== "string") {
    throw new HTTPError("Project id must be a string.", 400)
  }

  const value = projectId.trim() || undefined
  if (!value) {
    return undefined
  }

  if (!value.startsWith(prefixed(DocumentType.PROJECT))) {
    throw new HTTPError(`Project '${value}' not found.`, 404)
  }

  if (!(await features.isEnabled(FeatureFlag.PROJECTS))) {
    throw new HTTPError("Projects feature is not enabled.", 404)
  }

  const project = await sdk.projects.get(value)
  if (!project) {
    throw new HTTPError(`Project '${value}' not found.`, 404)
  }

  return value
}

export const resolveUpdatedProjectId = async (
  projectId: string | null | undefined,
  currentProjectId?: string
) => {
  if (projectId === undefined) {
    return currentProjectId
  }

  if (typeof projectId === "string") {
    const trimmed = projectId.trim() || undefined
    if (trimmed === currentProjectId) {
      return currentProjectId
    }
  }

  const resolved = await resolveProjectId(projectId)
  return resolved
}
