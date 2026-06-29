import { features, HTTPError } from "@budibase/backend-core"
import { DocumentType, FeatureFlag, prefixed } from "@budibase/types"
import sdk from "../sdk"

const validateProjectIds = (projectIds?: string[] | null) => {
  if (projectIds === undefined) {
    return undefined
  }
  if (projectIds === null) {
    throw new HTTPError("Project ids must be an array.", 400)
  }

  if (!Array.isArray(projectIds)) {
    throw new HTTPError("Project ids must be an array.", 400)
  }

  return projectIds.map(projectId => {
    if (typeof projectId !== "string" || !projectId.trim()) {
      throw new HTTPError("Project ids must be non-empty strings.", 400)
    }
    const trimmed = projectId.trim()
    if (!trimmed.startsWith(prefixed(DocumentType.PROJECT))) {
      throw new HTTPError(`Project '${trimmed}' not found.`, 404)
    }
    return trimmed
  })
}

const dedupeProjectIds = (projectIds: string[]) => {
  const deduped = Array.from(new Set(projectIds))
  return deduped.length ? deduped : undefined
}

export const resolveProjectIds = async (projectIds?: string[] | null) => {
  const validated = validateProjectIds(projectIds)
  if (!validated?.length) {
    return undefined
  }

  const ids = dedupeProjectIds(validated)
  if (!ids?.length) {
    return undefined
  }

  if (!(await features.isEnabled(FeatureFlag.PROJECTS))) {
    throw new HTTPError("Projects feature is not enabled.", 404)
  }

  await Promise.all(
    ids.map(async projectId => {
      const project = await sdk.projects.get(projectId)
      if (!project) {
        throw new HTTPError(`Project '${projectId}' not found.`, 404)
      }
    })
  )

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
