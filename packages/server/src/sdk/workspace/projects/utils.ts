import { context, features } from "@budibase/backend-core"
import {
  AnyDocument,
  FeatureFlag,
  ResourceType,
  type Document,
  type Project,
} from "@budibase/types"
import { getQueryIndex, ViewName } from "../../../db/utils"
import { createProjectMembersView } from "../../../db/views/staticViews"

export interface ProjectAssignable extends Document {
  projectIds?: string[]
}

export const PROJECT_ASSIGNABLE_RESOURCE_TYPES = new Set<ResourceType>([
  ResourceType.WORKSPACE_APP,
  ResourceType.AUTOMATION,
  ResourceType.AGENT,
  ResourceType.DATASOURCE,
  ResourceType.TABLE,
])

export const isProjectAssignableResourceType = (type: ResourceType) =>
  PROJECT_ASSIGNABLE_RESOURCE_TYPES.has(type)

export const getProjectIds = (doc: ProjectAssignable = {}) =>
  Array.isArray(doc.projectIds) ? doc.projectIds : []

export const hasProject = (doc: ProjectAssignable, projectId: string) =>
  getProjectIds(doc).includes(projectId)

export const withProjectIds = <T extends ProjectAssignable>(
  doc: T,
  projectIds?: string[]
): T => {
  const next = { ...doc }
  if (projectIds?.length) {
    next.projectIds = projectIds
  } else {
    delete next.projectIds
  }
  return next
}

export const removeProjectId = <T extends ProjectAssignable>(
  doc: T,
  projectId: string
): T =>
  withProjectIds(
    doc,
    getProjectIds(doc).filter(id => id !== projectId)
  )

export const addProjectId = <T extends ProjectAssignable>(
  doc: T,
  projectId: string
): T =>
  withProjectIds(doc, Array.from(new Set([...getProjectIds(doc), projectId])))

export const unionProjectIds = (
  ...projectIdLists: (string[] | undefined)[]
): string[] | undefined => {
  const all = projectIdLists.flatMap(ids => ids || [])
  return all.length ? Array.from(new Set(all)) : undefined
}

export const getProjectAssignedEntities = (
  doc: AnyDocument
): ProjectAssignable[] => {
  if (!doc.entities || typeof doc.entities !== "object") {
    return []
  }

  return Object.values(doc.entities).filter(
    (entity): entity is ProjectAssignable =>
      !!entity && typeof entity === "object"
  )
}

export const getValidProjectIdsForDuplication = async (
  projectIds?: string[]
) => {
  if (
    !projectIds?.length ||
    !(await features.isEnabled(FeatureFlag.PROJECTS))
  ) {
    return undefined
  }

  const projects = await context
    .getWorkspaceDB()
    .getMultiple<Project>(projectIds, { allowMissing: true })
  const validProjectIds = new Set(projects.map(project => project._id))
  const ids = projectIds.filter(projectId => validProjectIds.has(projectId))
  return ids.length ? ids : undefined
}

const isMissingViewError = (err: unknown) => {
  if (err instanceof Error && err.name === "not_found") {
    return true
  }
  if (!err || typeof err !== "object") {
    return false
  }

  return (
    "error" in err &&
    "reason" in err &&
    err.error === "not_found" &&
    err.reason === "missing_named_view"
  )
}

const getDocId = (doc: AnyDocument): string | undefined => doc._id

export const fetchAssignedProjectDocs = async (
  projectId: string
): Promise<AnyDocument[]> => {
  const db = context.getWorkspaceDB()

  try {
    const response = await db.query<AnyDocument>(
      getQueryIndex(ViewName.PROJECT_MEMBERS),
      {
        key: projectId,
        include_docs: true,
      }
    )
    const docsById = new Map<string, AnyDocument>()

    for (const row of response.rows) {
      if (!row.doc) {
        continue
      }

      const id = getDocId(row.doc)
      if (id && !docsById.has(id)) {
        docsById.set(id, row.doc)
      }
    }

    return Array.from(docsById.values())
  } catch (err) {
    if (isMissingViewError(err)) {
      await createProjectMembersView()
      return await fetchAssignedProjectDocs(projectId)
    }
    throw err
  }
}
