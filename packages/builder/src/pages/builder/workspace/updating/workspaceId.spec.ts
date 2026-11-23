import { render } from "@testing-library/svelte"
import { get, type Writable } from "svelte/store"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MockSlot from "@/test/mocks/MockSlot.svelte"
import UpdatingWorkspace from "./[workspaceId].svelte"

const mocks = vi.hoisted(() => ({
  workspaceStore: require("svelte/store").writable({ appId: "" }),
})) as { workspaceStore: Writable<{ appId: string }> }

vi.mock("@budibase/frontend-core", () => ({ Updating: MockSlot }))
vi.mock("@roxi/routify", async () => {
  const { writable } = await import("svelte/store")
  return { redirect: writable(vi.fn()), params: writable({}) }
})
vi.mock("@/api", () => ({ API: { getMigrationStatus: vi.fn() } }))
vi.mock("@/stores/builder", () => ({
  workspaceStore: mocks.workspaceStore,
}))

describe("updating workspace route", () => {
  beforeEach(() => {
    mocks.workspaceStore.set({ appId: "" })
  })

  it("stores the internal ID for a shortened workspace URL", () => {
    render(UpdatingWorkspace, { workspaceId: "dev_28bf" })

    expect(get(mocks.workspaceStore).appId).toBe("app_dev_28bf")
  })
})
