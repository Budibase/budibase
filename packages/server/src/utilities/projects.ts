import { Header } from "@budibase/shared-core"
import { APIWarningCode } from "@budibase/types"
import sdk from "../sdk"
import type {
  CreatedResourceDependencyPropagationInput,
  ProjectDependencyChangeInput,
  ProjectDependencySubtreePropagationInput,
  ProjectPropagationOutcome,
  SelectiveProjectPropagationInput,
} from "../sdk/workspace/projects/dependencies"

interface ResponseHeaderContext {
  set: (field: string, value: string) => void
}

export const propagateProjectDependencyChangesWithWarning = async ({
  ctx,
  ...input
}: ProjectDependencyChangeInput & { ctx: ResponseHeaderContext }) => {
  const outcome = await sdk.projects.propagateProjectDependencyChanges(input)
  setProjectPropagationWarning({ ctx, outcome })
  return outcome
}

const setProjectPropagationWarning = ({
  ctx,
  outcome,
}: {
  ctx: ResponseHeaderContext
  outcome: ProjectPropagationOutcome
}) => {
  if (outcome.status === "incomplete") {
    ctx.set(
      Header.API_WARNING,
      APIWarningCode.PROJECT_DEPENDENCY_ASSIGNMENT_INCOMPLETE
    )
  }
}

export const propagateProjectIdsToDependencyIdsWithWarning = async ({
  ctx,
  ...input
}: SelectiveProjectPropagationInput & { ctx: ResponseHeaderContext }) => {
  const outcome = await sdk.projects.propagateProjectIdsToDependencyIds(input)
  setProjectPropagationWarning({ ctx, outcome })
  return outcome
}

export const propagateProjectIdsToDependencySubtreesWithWarning = async ({
  ctx,
  ...input
}: ProjectDependencySubtreePropagationInput & {
  ctx: ResponseHeaderContext
}) => {
  const outcome =
    await sdk.projects.propagateProjectIdsToDependencySubtrees(input)
  setProjectPropagationWarning({ ctx, outcome })
  return outcome
}

export const propagateCreatedResourceDependenciesWithWarning = async ({
  ctx,
  ...input
}: CreatedResourceDependencyPropagationInput & {
  ctx: ResponseHeaderContext
}) => {
  const outcome = await sdk.projects.propagateCreatedResourceDependencies(input)
  setProjectPropagationWarning({ ctx, outcome })
  return outcome
}
