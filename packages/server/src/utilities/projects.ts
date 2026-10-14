import type {
  ProjectAssignmentResult,
  ProjectAssignmentResponse,
} from "@budibase/types"
import type { ProjectPropagationOutcome } from "../sdk/workspace/projects/dependencies"

export const withoutProjectAssignmentResult = <T>(resource: T): T => {
  const { projectAssignment: _result, ...saved } = resource as T &
    ProjectAssignmentResponse
  return saved as T
}

export const projectAssignmentResult = async (
  propagation: Promise<ProjectPropagationOutcome>
): Promise<ProjectAssignmentResult | undefined> => {
  const outcome = await propagation
  const result = {
    assignedDependencyIds: outcome.assignedResourceIds || [],
    failedDependencyIds:
      outcome.status === "incomplete" ? outcome.resourceIds : [],
  }
  // Preserve ordinary resource responses when propagation had no work to do.
  if (
    !result.assignedDependencyIds.length &&
    !result.failedDependencyIds.length
  ) {
    return undefined
  }
  return result
}

export const mergeProjectAssignmentResults = (
  outcomes: (ProjectAssignmentResult | undefined)[]
): ProjectAssignmentResult | undefined => {
  const results = outcomes.filter(
    (result): result is ProjectAssignmentResult => !!result
  )
  if (!results.length) {
    return undefined
  }
  const failedDependencyIds = Array.from(
    new Set(results.flatMap(result => result.failedDependencyIds))
  )
  return {
    assignedDependencyIds: Array.from(
      new Set(results.flatMap(result => result.assignedDependencyIds))
    ).filter(id => !failedDependencyIds.includes(id)),
    failedDependencyIds,
  }
}
