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
  const result = await projectsStore.updateAssignment(resourceId, selection)
  if (result.assignedDependencyIds.length === selection.dependencyIds.length) {
    notifications.success("Projects updated successfully")
  }
}
