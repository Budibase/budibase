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
): Promise<ProjectAssignmentResult> => {
  const outcome = await propagation
  return {
    assignedDependencyIds: outcome.assignedResourceIds || [],
    failedDependencyIds:
      outcome.status === "incomplete" ? outcome.resourceIds : [],
  }
}

export const mergeProjectAssignmentResults = (
  results: ProjectAssignmentResult[]
): ProjectAssignmentResult => {
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
