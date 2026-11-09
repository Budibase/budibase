import { notifications } from "@budibase/bbui"
import type { ProjectAssignmentResponse } from "@budibase/types"

const WARNING_INTERVAL_MS = 2000
let lastWarningAt: number | undefined

// These writes return the saved resource even when a dependency assignment
// fails. Keep that distinction visible without persisting response metadata
// in the resource stores or showing the same warning for each related write.
export const withProjectAssignmentNotification =
  <Args extends unknown[], Result extends ProjectAssignmentResponse>(
    save: (...args: Args) => Promise<Result>
  ) =>
  async (...args: Args): Promise<Result> => {
    const response = await save(...args)
    const { projectAssignment, ...saved } = response
    if (projectAssignment?.failedDependencyIds.length) {
      const now = Date.now()
      if (
        lastWarningAt === undefined ||
        now - lastWarningAt >= WARNING_INTERVAL_MS
      ) {
        lastWarningAt = now
        notifications.warning(
          "Resource saved, but some dependent resources could not be added to the project. Retry the project assignment."
        )
      }
    }
    return saved as Result
  }
