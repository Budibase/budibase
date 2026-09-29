import { render, screen, waitFor } from "@testing-library/svelte"
import type { FunctionResponse } from "@budibase/types"
import { FeatureFlag } from "@budibase/types"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { writable } from "svelte/store"
import MockComponent from "@/test/mocks/MockComponent.svelte"

const mocks = vi.hoisted(() => {
  const { writable } = require("svelte/store")
  return {
    params: writable({ functionId: "function-a" }),
    flags: writable({ ["FUNCTIONS"]: false }),
    selectResource: vi.fn(),
    fetchOne: vi.fn(),
    fetchQueryCatalog: vi.fn().mockResolvedValue(undefined),
  }
})

vi.mock("@roxi/routify", () => ({ params: mocks.params }))
vi.mock("@/stores/portal", () => ({ featureFlags: mocks.flags }))
vi.mock("@/stores/builder", () => ({
  builderStore: { selectResource: mocks.selectResource },
  functionStore: Object.assign(
    writable({
      queryCatalog: [],
      catalogLoading: false,
    }),
    {
      fetchOne: mocks.fetchOne,
      fetchQueryCatalog: mocks.fetchQueryCatalog,
    }
  ),
}))
vi.mock("@budibase/bbui", () => ({
  Body: MockComponent,
  Button: MockComponent,
  Heading: MockComponent,
  Icon: MockComponent,
  ProgressCircle: MockComponent,
  notifications: { success: vi.fn() },
}))
vi.mock("@/components/common/TopBar.svelte", () => ({
  default: MockComponent,
}))
vi.mock("../FunctionQueryEditor.svelte", () => ({
  default: MockComponent,
}))

import FunctionPage from "./index.svelte"

const createFunction = (id: string): FunctionResponse => ({
  _id: id,
  _rev: "1",
  name: id,
  appId: "workspace-a",
  source: "",
  capabilities: [],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  readiness: "build_required",
})

describe("Function editor route", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.params.set({ functionId: "function-a" })
    mocks.flags.set({ [FeatureFlag.FUNCTIONS]: false })
  })

  it("loads only when enabled and ignores a late response from the previous route", async () => {
    let resolveFirst: (value: FunctionResponse) => void = () => undefined
    const firstResponse = new Promise<FunctionResponse>(resolve => {
      resolveFirst = resolve
    })
    mocks.fetchOne.mockImplementation((id: string) =>
      id === "function-a"
        ? firstResponse
        : Promise.resolve(createFunction("function-b"))
    )

    render(FunctionPage)
    expect(mocks.fetchOne).not.toHaveBeenCalled()
    expect(mocks.selectResource).not.toHaveBeenCalled()

    mocks.flags.set({ [FeatureFlag.FUNCTIONS]: true })
    await waitFor(() =>
      expect(mocks.fetchOne).toHaveBeenCalledWith("function-a")
    )
    expect(mocks.selectResource).not.toHaveBeenCalled()

    mocks.params.set({ functionId: "function-b" })
    await waitFor(() =>
      expect(screen.getAllByText("function-b").length).toBeGreaterThan(0)
    )
    expect(mocks.selectResource).toHaveBeenLastCalledWith("function-b")

    resolveFirst(createFunction("function-a"))
    await firstResponse
    await waitFor(() =>
      expect(mocks.selectResource).toHaveBeenLastCalledWith("function-b")
    )
    expect(screen.queryByText("function-a")).not.toBeInTheDocument()
  })
})
