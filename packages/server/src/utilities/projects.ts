import { Header } from "@budibase/shared-core"
import { APIWarningCode } from "@budibase/types"
import type { ProjectPropagationOutcome } from "../sdk/workspace/projects/dependencies"

interface ResponseHeaderContext {
  set: (field: string, value: string) => void
}

export const withProjectPropagationWarning = async ({
  ctx,
  propagation,
}: {
  ctx: ResponseHeaderContext
  propagation: Promise<ProjectPropagationOutcome>
}) => {
  const outcome = await propagation
  if (outcome.status === "incomplete") {
    ctx.set(
      Header.API_WARNING,
      APIWarningCode.PROJECT_DEPENDENCY_ASSIGNMENT_INCOMPLETE
    )
  }
  return outcome
}
