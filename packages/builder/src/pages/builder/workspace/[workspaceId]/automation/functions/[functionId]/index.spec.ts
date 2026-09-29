import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
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
    save: vi.fn(),
    notificationsSuccess: vi.fn(),
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
      save: mocks.save,
      fetchQueryCatalog: mocks.fetchQueryCatalog,
    }
  ),
}))
vi.mock("@budibase/bbui", () => ({
  Body: MockComponent,
  Badge: MockComponent,
  Button: MockComponent,
  Heading: MockComponent,
  Helpers: { uuid: vi.fn().mockReturnValue("test-session") },
  Icon: MockComponent,
  ProgressCircle: MockComponent,
  notifications: { success: mocks.notificationsSuccess },
}))
vi.mock("@/components/common/TopBar.svelte", () => ({
  default: MockComponent,
}))
vi.mock("../FunctionQueryEditor.svelte", async () => ({
  default: (await import("@/test/mocks/MockFunctionQueryEditor.svelte"))
    .default,
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

  it("uses the saved revision after returning to the same Function during a save", async () => {
    let resolveSave: (value: FunctionResponse) => void = () => undefined
    const pendingSave = new Promise<FunctionResponse>(resolve => {
      resolveSave = resolve
    })
    mocks.fetchOne.mockImplementation(async (id: string) => createFunction(id))
    mocks.save
      .mockImplementationOnce(() => pendingSave)
      .mockImplementationOnce(async () => ({
        ...createFunction("function-a"),
        _rev: "3",
      }))
    mocks.flags.set({ [FeatureFlag.FUNCTIONS]: true })

    render(FunctionPage)
    await screen.findByRole("button", { name: "Save links" })
    await fireEvent.click(screen.getByRole("button", { name: "Save links" }))

    mocks.params.set({ functionId: "function-b" })
    await waitFor(() =>
      expect(mocks.selectResource).toHaveBeenLastCalledWith("function-b")
    )
    mocks.params.set({ functionId: "function-a" })
    await waitFor(() => expect(mocks.fetchOne).toHaveBeenCalledTimes(3))
    await screen.findByRole("button", { name: "Save links" })

    resolveSave({ ...createFunction("function-a"), _rev: "2" })
    await waitFor(() => expect(mocks.notificationsSuccess).toHaveBeenCalled())
    await fireEvent.click(screen.getByRole("button", { name: "Save links" }))

    await waitFor(() => expect(mocks.save).toHaveBeenCalledTimes(2))
    expect(mocks.save).toHaveBeenLastCalledWith(
      expect.objectContaining({ _rev: "2" }),
      expect.objectContaining({ _rev: "2" })
    )
  })
})
