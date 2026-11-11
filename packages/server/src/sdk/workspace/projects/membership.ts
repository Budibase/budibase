import { HTTPError } from "@budibase/backend-core"
import { DocumentType, prefixed } from "@budibase/types"
import { get as getProject } from "./crud"

const validateProjectIds = (projectIds?: string[] | null) => {
  if (projectIds === undefined) {
    return undefined
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

export const resolveProjectIds = async (projectIds?: string[] | null) => {
  const validated = validateProjectIds(projectIds)
  if (!validated?.length) {
    return undefined
  }

  const ids = Array.from(new Set(validated))

  await Promise.all(
    ids.map(async projectId => {
      const project = await getProject(projectId)
      if (!project) {
        throw new HTTPError(`Project '${projectId}' not found.`, 404)
      }
    })
  )

  return ids
}

interface UpdateProjectMembershipInput {
  projectIds?: string[] | null
  currentProjectIds?: string[]
}

export const resolveUpdatedProjectIds = async ({
  projectIds,
  currentProjectIds,
}: UpdateProjectMembershipInput) => {
  if (projectIds === undefined) {
    return currentProjectIds
  }
  return await resolveProjectIds(projectIds)
}
