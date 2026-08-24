import { notifications } from "@budibase/bbui"
import type { UpdateProjectAssignmentRequest } from "@budibase/types"
import { getErrorMessage } from "@/helpers/errors"
import { projectsStore } from "@/stores/portal"

export type ProjectAssignmentSelection = Pick<
  UpdateProjectAssignmentRequest,
  "projectIds" | "dependencyIds" | "dependencyFingerprint"
>

export const saveProjectAssignment = async ({
  resourceId,
  resourceRev,
  selection,
}: {
  resourceId: string
  resourceRev: string
  selection: ProjectAssignmentSelection
}) => {
  try {
    const result = await projectsStore.updateAssignment(resourceId, {
      resourceRev,
      ...selection,
    })
    if (
      result.assignedDependencyIds.length === selection.dependencyIds.length
    ) {
      notifications.success("Projects updated successfully")
    }
    return true
  } catch (error) {
    console.error("Unable to update project", error)
    notifications.error(getErrorMessage(error) || "Unable to update project")
    return false
  }
}
