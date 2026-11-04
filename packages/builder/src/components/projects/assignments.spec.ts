import { beforeEach, describe, expect, it, vi } from "vitest"
import { notifications } from "@budibase/bbui"
import { projectsStore } from "@/stores/portal"
import { saveProjectAssignment } from "./assignments"

vi.mock("@budibase/bbui", () => ({
  notifications: { success: vi.fn(), warning: vi.fn() },
}))

vi.mock("@/stores/portal", () => ({
  projectsStore: { updateAssignment: vi.fn() },
}))

const selection = {
  resourceRev: "1-rev",
  projectIds: ["project_1"],
  dependencyIds: ["automation_1", "automation_2"],
  dependencyFingerprint: "reviewed-dependencies",
}
const response = {
  resourceId: "workspace_app_1",
  resourceRev: "2-rev",
  projectIds: selection.projectIds,
  assignedDependencyIds: selection.dependencyIds,
  failedDependencyIds: [],
}

describe("saveProjectAssignment", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("reports success when every selected dependency was assigned", async () => {
    vi.mocked(projectsStore.updateAssignment).mockResolvedValue(response)

    await saveProjectAssignment({ resourceId: response.resourceId, selection })

    expect(notifications.success).toHaveBeenCalledWith(
      "Projects updated successfully"
    )
    expect(notifications.warning).not.toHaveBeenCalled()
  })

  it("does not report success when one selected dependency failed", async () => {
    vi.mocked(projectsStore.updateAssignment).mockResolvedValue({
      ...response,
      assignedDependencyIds: ["automation_1"],
      failedDependencyIds: ["automation_2"],
    })

    await saveProjectAssignment({ resourceId: response.resourceId, selection })

    expect(notifications.success).not.toHaveBeenCalled()
    expect(notifications.warning).toHaveBeenCalledWith(
      "Projects updated, but some dependent resources could not be added. Retry the project assignment."
    )
  })
})
