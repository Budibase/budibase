import { afterEach, describe, expect, it, vi } from "vitest"
import { notifications } from "@budibase/bbui"
import { withProjectAssignmentNotification } from "./projectAssignmentResults"

vi.mock("@budibase/bbui", () => ({
  notifications: { warning: vi.fn() },
}))

describe("project assignment save results", () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it("returns the saved resource and consumes assignment metadata", async () => {
    const save = vi.fn().mockResolvedValue({
      _id: "resource",
      projectAssignment: {
        assignedDependencyIds: ["dependency"],
        failedDependencyIds: [],
      },
    })
    const wrapped = withProjectAssignmentNotification(save)

    await expect(wrapped("input")).resolves.toEqual({ _id: "resource" })
    expect(save).toHaveBeenCalledWith("input")
    expect(notifications.warning).not.toHaveBeenCalled()
  })

  it("shows one warning for related partial saves and allows a later retry warning", async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-10-14T10:00:00Z"))
    const save = vi.fn().mockResolvedValue({
      _id: "resource",
      projectAssignment: {
        assignedDependencyIds: ["saved"],
        failedDependencyIds: ["failed"],
      },
    })
    const firstClient = withProjectAssignmentNotification(save)
    const secondClient = withProjectAssignmentNotification(save)

    await expect(firstClient()).resolves.toEqual({ _id: "resource" })
    await secondClient()
    expect(notifications.warning).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(2000)
    await firstClient()
    expect(notifications.warning).toHaveBeenCalledTimes(2)
  })

  it("preserves errors without turning a failed save into a partial success", async () => {
    const error = new Error("Save failed")
    const save = vi.fn().mockRejectedValue(error)
    await expect(withProjectAssignmentNotification(save)()).rejects.toBe(error)
    expect(notifications.warning).not.toHaveBeenCalled()
  })
})
