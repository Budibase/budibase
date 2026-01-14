import { describe, it, expect, vi } from "vitest"
import blank from "@/templates/screenTemplating/blank"
import type { Screen } from "@budibase/types"

const mockGetDefaultLayoutPreference = vi.fn(() => "grid")

vi.mock("@/stores/preferences", () => ({
  getDefaultLayoutPreference: mockGetDefaultLayoutPreference,
}))

describe("blank screen template", () => {
  it("uses the default layout preference for new screens", () => {
    mockGetDefaultLayoutPreference.mockReturnValue("flex")

    const result = blank({
      route: "/example",
      screens: [] as Screen[],
      workspaceAppId: "app_dev_test",
    })

    expect(result[0].data.props.layout).toBe("flex")
    expect(mockGetDefaultLayoutPreference).toHaveBeenCalled()
  })
})
