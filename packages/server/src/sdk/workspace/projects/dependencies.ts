import { createHash } from "crypto"
import { context } from "@budibase/backend-core"
import {
  type AnyDocument,
  type PreviewProjectAssignmentResponse,
  type ProjectAssignmentDependency,
  ResourceType,
  type WithDocMetadata,
} from "@budibase/types"
import sdk from "../.."
import { collectTransitiveResourceDependencies } from "../resources"
import {
  compareResourceIds,
  isDisallowedProjectAssignmentResourceId,
} from "../resources/utils"
import {
  getProjectIds,
  isProjectAssignableResourceType,
  unionProjectIds,
  withProjectIds,
  type ProjectAssignable,
} from "./utils"

const MAX_PROPAGATION_RETRIES = 3

export type ProjectPropagationOutcome =
  | { status: "complete" }
  | { status: "incomplete"; resourceIds: string[] }

interface ProjectDependencyPreviewInput {
  resourceId: string
  resourceRev: string
  resourceProjectIds: string[]
  projectIds: string[]
}

export interface SelectiveProjectPropagationInput {
  dependencyIds: string[]
  projectIds: string[]
}

const completePropagation = (): ProjectPropagationOutcome => ({
  status: "complete",
})

const incompletePropagation = ({
  resourceIds,
  error,
}: {
  resourceIds: Iterable<string>
  error: unknown
}): ProjectPropagationOutcome => {
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

const getProjectAssignableDependencies = async (resourceId: string) => {
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
    return incompletePropagation({
      resourceIds: [...failedIds, ...idsToUpdate],
      error,
    })
  }

  idsToUpdate.forEach(id => failedIds.add(id))
  if (failedIds.size) {
    return incompletePropagation({
      resourceIds: failedIds,
      error: new Error("Project dependency assignment did not complete."),
    })
  }

  return completePropagation()
}
