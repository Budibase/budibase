import { createHash } from "crypto"
import { context, features, HTTPError } from "@budibase/backend-core"
import { Header } from "@budibase/shared-core"
import {
  APIWarningCode,
  type AnyDocument,
  DocumentType,
  FeatureFlag,
  prefixed,
  type PreviewProjectAssignmentResponse,
  type ProjectAssignmentDependency,
  ResourceType,
  type WithDocMetadata,
} from "@budibase/types"
import sdk from "../sdk"
import { collectTransitiveResourceDependencies } from "../sdk/workspace/resources"
import {
  compareResourceIds,
  isDisallowedProjectAssignmentResourceId,
} from "../sdk/workspace/resources/utils"
import {
  getProjectIds,
  isProjectAssignableResourceType,
  unionProjectIds,
  withProjectIds,
  type ProjectAssignable,
} from "../sdk/workspace/projects/utils"

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

const MAX_PROPAGATION_RETRIES = 3

export type ProjectPropagationOutcome =
  | { status: "complete" }
  | { status: "incomplete"; resourceIds: string[] }

interface ResponseHeaderContext {
  set: (field: string, value: string) => void
}

interface ProjectDependencyPreviewInput {
  resourceId: string
  resourceRev: string
  resourceProjectIds: string[]
  projectIds: string[]
}

interface SelectiveProjectPropagationInput {
  dependencyIds: string[]
  projectIds: string[]
}

const completePropagation = (): ProjectPropagationOutcome => ({
  status: "complete",
})

const incompletePropagation = (
  resourceIds: Iterable<string>,
  error: unknown
): ProjectPropagationOutcome => {
  const failedResourceIds = Array.from(new Set(resourceIds)).sort()
  console.log(
    "Failed to update some project dependency assignments.",
    failedResourceIds,
    error
  )
  return {
    status: "incomplete",
    resourceIds: failedResourceIds,
  }
}

const isAssignableDependency = (dependency: {
  id: string
  type: ResourceType
}) =>
  isProjectAssignableResourceType(dependency.type) &&
  !isDisallowedProjectAssignmentResourceId(dependency.id)

const createProjectAssignmentPreview = ({
  dependencies,
  projectIds,
  resourceRev,
  resourceProjectIds,
}: {
  dependencies: ProjectAssignmentDependency[]
  projectIds: string[]
  resourceRev: string
  resourceProjectIds: string[]
}): PreviewProjectAssignmentResponse => ({
  resourceRev,
  resourceProjectIds,
  dependencies,
  dependencyFingerprint: createHash("sha256")
    .update(
      JSON.stringify({
        projectIds: Array.from(new Set(projectIds)).sort(compareResourceIds),
        dependencies: dependencies
          .map(dependency => ({
            id: dependency.id,
            projectIdsToAdd: Array.from(
              new Set(dependency.projectIdsToAdd)
            ).sort(compareResourceIds),
          }))
          .sort((a, b) => compareResourceIds(a.id, b.id)),
      })
    )
    .digest("base64url"),
})

export const getProjectAssignmentPreview = async ({
  resourceId,
  resourceRev,
  resourceProjectIds,
  projectIds,
}: ProjectDependencyPreviewInput): Promise<PreviewProjectAssignmentResponse> => {
  if (!projectIds.length) {
    return createProjectAssignmentPreview({
      dependencies: [],
      projectIds,
      resourceRev,
      resourceProjectIds,
    })
  }

  const assignableDependencies =
    await getProjectAssignableDependencies(resourceId)
  const dependenciesById = new Map(
    assignableDependencies.map(dependency => [dependency.id, dependency])
  )
  if (!dependenciesById.size) {
    return createProjectAssignmentPreview({
      dependencies: [],
      projectIds,
      resourceRev,
      resourceProjectIds,
    })
  }

  const db = context.getWorkspaceDB()
  const docs = await db.getMultiple<AnyDocument & ProjectAssignable>(
    Array.from(dependenciesById.keys()),
    { allowMissing: true }
  )

  const dependencies = docs.flatMap(doc => {
    const dependency = dependenciesById.get(doc._id!)
    if (!dependency) {
      return []
    }
    const existingProjectIds = new Set(getProjectIds(doc))
    const projectIdsToAdd = projectIds.filter(
      projectId => !existingProjectIds.has(projectId)
    )
    return projectIdsToAdd.length ? [{ ...dependency, projectIdsToAdd }] : []
  })
  return createProjectAssignmentPreview({
    dependencies,
    projectIds,
    resourceRev,
    resourceProjectIds,
  })
}

export const getProjectAssignableDependencies = async (resourceId: string) => {
  const { graph } = await sdk.resources.analyzeResourceDependencies({
    includeProjects: false,
    includeDatasourceQueries: true,
  })
  return collectTransitiveResourceDependencies(graph, resourceId)
    .filter(isAssignableDependency)
    .sort(
      (a, b) =>
        compareResourceIds(a.type, b.type) ||
        compareResourceIds(a.name, b.name) ||
        compareResourceIds(a.id, b.id)
    )
}

export const propagateProjectIdsToDependencyIds = async ({
  dependencyIds,
  projectIds,
}: SelectiveProjectPropagationInput): Promise<ProjectPropagationOutcome> => {
  const uniqueDependencyIds = Array.from(new Set(dependencyIds)).sort()
  if (!uniqueDependencyIds.length || !projectIds.length) {
    return completePropagation()
  }

  let idsToUpdate = uniqueDependencyIds
  const failedIds = new Set<string>()

  try {
    const db = context.getWorkspaceDB()
    for (
      let attempt = 0;
      attempt < MAX_PROPAGATION_RETRIES && idsToUpdate.length;
      attempt++
    ) {
      const docs = await db.getMultiple<AnyDocument & ProjectAssignable>(
        idsToUpdate,
        { allowMissing: true }
      )
      const fetchedIds = new Set(docs.map(doc => doc._id))
      idsToUpdate
        .filter(id => !fetchedIds.has(id))
        .forEach(id => failedIds.add(id))

      const updates = docs
        .map(doc => {
          const existing = getProjectIds(doc)
          const next = unionProjectIds(existing, projectIds)
          const changed =
            (next?.length || 0) !== existing.length ||
            !existing.every(id => next?.includes(id))
          return changed ? withProjectIds(doc, next) : undefined
        })
        .filter(
          (doc): doc is WithDocMetadata<AnyDocument & ProjectAssignable> =>
            !!doc
        )

      if (!updates.length) {
        idsToUpdate = []
        break
      }

      const results = await db.bulkDocs(updates)
      const failures = results
        .map((result, index) => ({ result, doc: updates[index] }))
        .filter(({ result }) => result.error)

      for (const { result, doc } of failures) {
        if (result.error !== "conflict") {
          failedIds.add(doc._id)
        }
      }

      idsToUpdate = failures
        .filter(({ result }) => result.error === "conflict")
        .map(({ doc }) => doc._id)
    }
  } catch (error) {
    return incompletePropagation([...failedIds, ...idsToUpdate], error)
  }

  idsToUpdate.forEach(id => failedIds.add(id))
  if (failedIds.size) {
    return incompletePropagation(
      failedIds,
      new Error("Project dependency assignment did not complete.")
    )
  }

  return completePropagation()
}

const setProjectPropagationWarning = (
  ctx: ResponseHeaderContext,
  outcome: ProjectPropagationOutcome
) => {
  if (outcome.status === "incomplete") {
    ctx.set(
      Header.API_WARNING,
      APIWarningCode.PROJECT_DEPENDENCY_ASSIGNMENT_INCOMPLETE
    )
  }
}

export const propagateProjectIdsToDependencyIdsWithWarning = async (
  ctx: ResponseHeaderContext,
  input: SelectiveProjectPropagationInput
) => {
  const outcome = await propagateProjectIdsToDependencyIds(input)
  setProjectPropagationWarning(ctx, outcome)
  return outcome
}
