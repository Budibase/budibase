import { describe, it, expect, beforeEach, vi } from "vitest"
import { get } from "svelte/store"
import { API } from "@/api"
import {
  userPreferences,
  getDefaultLayoutPreference,
  DEFAULT_SCREEN_LAYOUT,
} from "@/stores/preferences"

vi.mock("@/api", () => ({
  API: {
    updateSelf: vi.fn(),
  },
}))

describe("userPreferences store", () => {
  beforeEach(() => {
    userPreferences.syncDefaultLayout(DEFAULT_SCREEN_LAYOUT)
    vi.mocked(API.updateSelf).mockReset()
  })

  it("updates the default layout preference and persists it", async () => {
    vi.mocked(API.updateSelf).mockResolvedValue(undefined)

    const updatePromise = userPreferences.updateDefaultLayout("flex")
    expect(get(userPreferences.store).savingDefaultLayout).toBe(true)

    await updatePromise
    expect(API.updateSelf).toHaveBeenCalledWith({ defaultLayout: "flex" })

    const state = get(userPreferences.store)
    expect(state.defaultLayout).toBe("flex")
    expect(state.savingDefaultLayout).toBe(false)
  })

  it("restores the previous layout when persisting fails", async () => {
    vi.mocked(API.updateSelf).mockRejectedValue(new Error("failed"))

    await expect(
      userPreferences.updateDefaultLayout("flex")
    ).rejects.toThrow("failed")

    const state = get(userPreferences.store)
    expect(state.defaultLayout).toBe(DEFAULT_SCREEN_LAYOUT)
    expect(state.savingDefaultLayout).toBe(false)
  })

  it("skips API calls when the layout has not changed", async () => {
    await userPreferences.updateDefaultLayout(DEFAULT_SCREEN_LAYOUT)

    expect(API.updateSelf).not.toHaveBeenCalled()
    const state = get(userPreferences.store)
    expect(state.defaultLayout).toBe(DEFAULT_SCREEN_LAYOUT)
  })

  it("falls back to the default layout when no preference is stored", () => {
    userPreferences.update(() => {
      // @ts-expect-error forcing undefined to verify the fallback
      return {
        defaultLayout: undefined,
        savingDefaultLayout: false,
      }
    })

    expect(getDefaultLayoutPreference()).toBe(DEFAULT_SCREEN_LAYOUT)
  })
})
