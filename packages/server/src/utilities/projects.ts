import { features, HTTPError } from "@budibase/backend-core"
import { DocumentType, FeatureFlag, prefixed } from "@budibase/types"
import sdk from "../sdk"

const normaliseProjectIds = (projectIds?: string[] | null) => {
  if (projectIds == null) {
    return undefined
  }

  if (!Array.isArray(projectIds)) {
    throw new HTTPError("Project ids must be an array.", 400)
  }

  const ids = projectIds.map(projectId => {
    if (typeof projectId !== "string" || !projectId.trim()) {
      throw new HTTPError("Project ids must be non-empty strings.", 400)
    }
    return projectId.trim()
  })

  const deduped = Array.from(new Set(ids))
  return deduped.length ? deduped : undefined
}

export const resolveProjectIds = async (projectIds?: string[] | null) => {
  const ids = normaliseProjectIds(projectIds)
  if (!ids?.length) {
    return undefined
  }

  for (const projectId of ids) {
    if (!projectId.startsWith(prefixed(DocumentType.PROJECT))) {
      throw new HTTPError(`Project '${projectId}' not found.`, 404)
    }
  }

  if (!(await features.isEnabled(FeatureFlag.PROJECTS))) {
    throw new HTTPError("Projects feature is not enabled.", 404)
  }

  for (const projectId of ids) {
    const project = await sdk.projects.get(projectId)
    if (!project) {
      throw new HTTPError(`Project '${projectId}' not found.`, 404)
    }
  }

  return ids
}

export const resolveUpdatedProjectIds = async (
  projectIds: string[] | null | undefined,
  currentProjectIds?: string[]
) => {
  if (projectIds === undefined) {
    return currentProjectIds
  }

  return await resolveProjectIds(projectIds)
}
