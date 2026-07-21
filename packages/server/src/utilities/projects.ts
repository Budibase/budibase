import { context, features, HTTPError } from "@budibase/backend-core"
import { Header } from "@budibase/shared-core"
import {
  APIWarningCode,
  AnyDocument,
  DocumentType,
  FeatureFlag,
  prefixed,
  type ProjectAssignmentDependency,
  ResourceType,
  WithDocMetadata,
} from "@budibase/types"
import isEqual from "lodash/isEqual"
import sdk from "../sdk"
import {
  collectTransitiveResourceDependencies,
  type ResourceDependencyAnalysis,
  type ResourceDependencyGraph,
} from "../sdk/workspace/resources"
import {
  compareResourceIds,
  compareResourceTypes,
  getResourceType,
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

  const projectsEnabled = await features.isEnabled(FeatureFlag.PROJECTS)

  if (!projectsEnabled) {
    const validated = validateProjectIds(projectIds)
    const requestedProjectIds = validated?.length
      ? dedupeProjectIds(validated)
      : undefined
    const requested = new Set(requestedProjectIds || [])
    const current = new Set(currentProjectIds || [])
    const unchanged =
      requested.size === current.size &&
      Array.from(requested).every(projectId => current.has(projectId))

    if (unchanged) {
      return currentProjectIds
    }

    throw new HTTPError("Projects feature is not enabled.", 404)
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
  projectIds: string[]
}

interface SelectiveProjectPropagationInput {
  dependencyIds: string[]
  projectIds: string[]
}

interface ProjectDependencyChangeInput {
  rootResourceId: string
  currentProjectIds?: string[]
  previousProjectIds?: string[]
  previousResource?: AnyDocument
  savedResource: AnyDocument
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

export const getProjectAssignmentDependencies = async ({
  resourceId,
  projectIds,
}: ProjectDependencyPreviewInput): Promise<ProjectAssignmentDependency[]> => {
  if (!projectIds.length) {
    return []
  }

  const dependencies = await getProjectAssignableDependencies(resourceId)
  const dependenciesById = new Map(
    dependencies.map(dependency => [dependency.id, dependency])
  )
  if (!dependenciesById.size) {
    return []
  }

  const db = context.getWorkspaceDB()
  const docs = await db.getMultiple<AnyDocument & ProjectAssignable>(
    Array.from(dependenciesById.keys()),
    { allowMissing: true }
  )

  return docs.flatMap(doc => {
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
}

export const getProjectAssignableDependencies = async (resourceId: string) => {
  const graph = await sdk.resources.getResourcesInfo({
    includeProjects: false,
    includeDatasourceQueries: true,
  })
  return Array.from(
    new Map(
      collectTransitiveResourceDependencies(graph, resourceId)
        .filter(isAssignableDependency)
        .filter(dependency => dependency.id !== resourceId)
        .map(dependency => [dependency.id, dependency])
    ).values()
  ).sort(
    (a, b) =>
      compareResourceTypes(a.type, b.type) ||
      compareResourceIds(a.name, b.name) ||
      compareResourceIds(a.id, b.id)
  )
}

const withoutRevisionMetadata = (resource: AnyDocument) => {
  const { _rev: _revision, updatedAt: _updatedAt, ...comparable } = resource
  return comparable
}

const collectAssignableDependencyIds = (
  graph: ResourceDependencyGraph,
  resourceIds: string[],
  includeRoots = false
) =>
  Array.from(
    new Set(
      [
        ...(includeRoots
          ? resourceIds.flatMap(resourceId => {
              const type = getResourceType(resourceId)
              return type ? [{ id: resourceId, type }] : []
            })
          : []),
        ...resourceIds.flatMap(resourceId =>
          collectTransitiveResourceDependencies(graph, resourceId)
        ),
      ]
        .filter(isAssignableDependency)
        .map(dependency => dependency.id)
    )
  ).sort(compareResourceIds)

const getNewDirectDependencyIds = (
  findReferencedResources: ResourceDependencyAnalysis["findReferencedResources"],
  rootResourceId: string,
  previousResource: AnyDocument | undefined,
  savedResource: AnyDocument
) => {
  const previousDependencyIds = new Set(
    previousResource
      ? findReferencedResources(previousResource).map(resource => resource.id)
      : []
  )

  return findReferencedResources(savedResource)
    .filter(
      dependency =>
        dependency.id !== rootResourceId && dependency.id !== savedResource._id
    )
    .filter(dependency => !previousDependencyIds.has(dependency.id))
    .map(dependency => dependency.id)
}

const mergePropagationOutcomes = (
  outcomes: ProjectPropagationOutcome[]
): ProjectPropagationOutcome => {
  const failedResourceIds = outcomes.flatMap(outcome =>
    outcome.status === "incomplete" ? outcome.resourceIds : []
  )
  return failedResourceIds.length
    ? {
        status: "incomplete",
        resourceIds: Array.from(new Set(failedResourceIds)),
      }
    : completePropagation()
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

export const propagateProjectDependencyChanges = async ({
  rootResourceId,
  currentProjectIds = [],
  previousProjectIds = [],
  previousResource,
  savedResource,
}: ProjectDependencyChangeInput): Promise<ProjectPropagationOutcome> => {
  if (!currentProjectIds.length) {
    return completePropagation()
  }

  const previousProjects = new Set(previousProjectIds)
  const addedProjectIds = currentProjectIds.filter(
    projectId => !previousProjects.has(projectId)
  )
  const existingProjectIds = currentProjectIds.filter(projectId =>
    previousProjects.has(projectId)
  )
  const dependencyContentChanged =
    !previousResource ||
    !isEqual(
      withoutRevisionMetadata(previousResource),
      withoutRevisionMetadata(savedResource)
    )

  if (!addedProjectIds.length && !dependencyContentChanged) {
    return completePropagation()
  }

  let projectsEnabled: boolean
  try {
    projectsEnabled = await features.isEnabled(FeatureFlag.PROJECTS)
  } catch (error) {
    return incompletePropagation([rootResourceId], error)
  }
  if (!projectsEnabled) {
    return completePropagation()
  }

  let analysis: ResourceDependencyAnalysis
  try {
    analysis = await sdk.resources.analyzeResourceDependencies({
      includeProjects: false,
      includeDatasourceQueries: true,
    })
  } catch (error) {
    return incompletePropagation([rootResourceId], error)
  }
  const { graph } = analysis

  const outcomes: ProjectPropagationOutcome[] = []

  if (addedProjectIds.length) {
    outcomes.push(
      await propagateProjectIdsToDependencyIds({
        dependencyIds: collectAssignableDependencyIds(graph, [rootResourceId]),
        projectIds: addedProjectIds,
      })
    )
  }

  if (existingProjectIds.length && dependencyContentChanged) {
    const newDirectDependencyIds = getNewDirectDependencyIds(
      analysis.findReferencedResources,
      rootResourceId,
      previousResource,
      savedResource
    )
    outcomes.push(
      await propagateProjectIdsToDependencyIds({
        dependencyIds: collectAssignableDependencyIds(
          graph,
          newDirectDependencyIds,
          true
        ),
        projectIds: existingProjectIds,
      })
    )
  }

  return mergePropagationOutcomes(outcomes)
}

export const propagateProjectDependencyChangesWithWarning = async (
  ctx: ResponseHeaderContext,
  input: ProjectDependencyChangeInput
) => {
  const outcome = await propagateProjectDependencyChanges(input)
  setProjectPropagationWarning(ctx, outcome)
  return outcome
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
