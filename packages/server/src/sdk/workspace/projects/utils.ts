import { context, features } from "@budibase/backend-core"
import { FeatureFlag, type Document, type Project } from "@budibase/types"

export interface ProjectAssignable extends Document {
  projectIds?: string[]
}

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
): T => withProjectIds(doc, getProjectIds(doc).filter(id => id !== projectId))

export const addProjectId = <T extends ProjectAssignable>(
  doc: T,
  projectId: string
): T =>
  withProjectIds(doc, Array.from(new Set([...getProjectIds(doc), projectId])))

export const getValidProjectIdsForDuplication = async (
  projectIds?: string[]
) => {
  if (!projectIds?.length || !(await features.isEnabled(FeatureFlag.PROJECTS))) {
    return undefined
  }

  const projects = await context.getWorkspaceDB().getMultiple<Project>(
    projectIds,
    { allowMissing: true }
  )
  const validProjectIds = new Set(projects.map(project => project._id))
  const ids = projectIds.filter(projectId => validProjectIds.has(projectId))
  return ids.length ? ids : undefined
}
