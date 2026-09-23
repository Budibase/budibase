import { Header } from "@budibase/shared-core"
import { APIWarningCode } from "@budibase/types"
import sdk from "../sdk"
import type {
  ProjectPropagationOutcome,
  SelectiveProjectPropagationInput,
} from "../sdk/workspace/projects/dependencies"

interface ResponseHeaderContext {
  set: (field: string, value: string) => void
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
