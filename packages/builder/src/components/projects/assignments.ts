import { notifications } from "@budibase/bbui"
import type { UpdateProjectAssignmentRequest } from "@budibase/types"
import { projectsStore } from "@/stores/portal"

export const saveProjectAssignment = async ({
  resourceId,
  selection,
}: {
  resourceId: string
  selection: UpdateProjectAssignmentRequest
}) => {
  const result = await projectsStore.updateAssignment({
    resourceId,
    request: selection,
  })
  if (result.failedDependencyIds.length) {
    notifications.warning(
      "Projects updated, but some dependent resources could not be added. Retry the project assignment."
    )
  } else {
    notifications.success("Projects updated successfully")
  }
}
