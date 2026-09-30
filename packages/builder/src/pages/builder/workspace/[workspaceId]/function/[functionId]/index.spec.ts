import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import type { FunctionResponse } from "@budibase/types"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { writable } from "svelte/store"
import MockComponent from "@/test/mocks/MockComponent.svelte"
import MockFunctionTopBar from "./MockFunctionTopBar.svelte"

const mocks = vi.hoisted(() => {
  const { writable } = require("svelte/store")
  return {
    params: writable({ workspaceId: "app_dev_one", functionId: "function-a" }),
    available: writable(false),
    auth: writable({ user: { builder: { global: true } } }),
    canManageFunctions: vi.fn().mockReturnValue(true),
    selectResource: vi.fn(),
    fetchOne: vi.fn(),
    save: vi.fn(),
    compile: vi.fn().mockResolvedValue({ diagnostics: [] }),
    notificationsSuccess: vi.fn(),
    fetchQueryCatalog: vi.fn().mockResolvedValue(undefined),
    compile: vi.fn().mockResolvedValue({ diagnostics: [] }),
  }
})

vi.mock("@roxi/routify", () => ({ params: mocks.params }))
vi.mock("@budibase/frontend-core", () => ({
  Utils: {
    debounce: (callback: (...args: never[]) => void) =>
      Object.assign(callback, { cancel: vi.fn() }),
  },
}))
vi.mock("@/stores/builder/functionsAvailability", () => ({
  functionsAvailable: mocks.available,
}))
vi.mock("@/stores/builder/functions", () => ({
  toCapabilityInputs: () => [],
  functionStore: Object.assign(
    writable({
      queryCatalog: [],
      catalogLoading: false,
    }),
    {
      fetchOne: mocks.fetchOne,
      save: mocks.save,
      compile: mocks.compile,
      fetchQueryCatalog: mocks.fetchQueryCatalog,
      compile: mocks.compile,
    }
  ),
}))
vi.mock("@/stores/portal", () => ({ auth: mocks.auth }))
vi.mock("../permissions", () => ({
  canManageFunctions: mocks.canManageFunctions,
}))
vi.mock("@/stores/builder", () => ({
  builderStore: { selectResource: mocks.selectResource },
}))
vi.mock("@budibase/bbui", () => ({
  Badge: MockComponent,
  Body: MockComponent,
  Button: MockComponent,
  Heading: MockComponent,
  Helpers: { uuid: vi.fn().mockReturnValue("test-session") },
  Icon: MockComponent,
  ProgressCircle: MockComponent,
  Tab: MockComponent,
  Tabs: MockComponent,
  notifications: { success: mocks.notificationsSuccess },
}))
vi.mock("@/components/common/TopBar.svelte", () => ({
  default: MockFunctionTopBar,
}))
vi.mock("../FunctionCodeEditor.svelte", async () => ({
  default: (await import("@/test/mocks/MockFunctionCodeEditor.svelte")).default,
}))
vi.mock("../FunctionLogs.svelte", () => ({ default: MockComponent }))
vi.mock("../FunctionQueryEditor.svelte", async () => ({
  default: (await import("@/test/mocks/MockFunctionQueryEditor.svelte"))
    .default,
}))
vi.mock("../FunctionLogs.svelte", () => ({ default: MockComponent }))
vi.mock("../FunctionTrustNotice.svelte", () => ({ default: MockComponent }))

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
    mocks.fetchOne.mockReset()
    mocks.save.mockReset()
    mocks.params.set({ workspaceId: "app_dev_one", functionId: "function-a" })
    mocks.available.set(false)
    mocks.canManageFunctions.mockReturnValue(true)
  })

  it("distinguishes unavailable Functions from missing author permission", async () => {
    mocks.canManageFunctions.mockReturnValue(false)
    render(FunctionPage)

    expect(screen.getByText("Functions are not available")).toBeInTheDocument()
    mocks.available.set(true)

    expect(
      await screen.findByText("You don't have permission to manage Functions")
    ).toBeInTheDocument()
    expect(mocks.fetchOne).not.toHaveBeenCalled()
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

    mocks.available.set(true)
    await waitFor(() =>
      expect(mocks.fetchOne).toHaveBeenCalledWith("function-a")
    )
    expect(mocks.selectResource).not.toHaveBeenCalled()

    mocks.params.set({ workspaceId: "app_dev_one", functionId: "function-b" })
    await waitFor(() =>
      expect(screen.getByTestId("function-name")).toHaveTextContent(
        "function-b"
      )
    )
    expect(mocks.selectResource).toHaveBeenLastCalledWith("function-b")

    resolveFirst(createFunction("function-a"))
    await firstResponse
    await waitFor(() =>
      expect(mocks.selectResource).toHaveBeenLastCalledWith("function-b")
    )
    expect(screen.getByTestId("function-name")).toHaveTextContent("function-b")
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
    mocks.available.set(true)

    render(FunctionPage)
    await screen.findByRole("button", { name: "Save links" })
    await fireEvent.click(screen.getByRole("button", { name: "Save links" }))

    mocks.params.set({ workspaceId: "app_dev_one", functionId: "function-b" })
    await waitFor(() =>
      expect(mocks.selectResource).toHaveBeenLastCalledWith("function-b")
    )
    mocks.params.set({ workspaceId: "app_dev_one", functionId: "function-a" })
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

  it("does not save the newly selected Function source into the previous Function", async () => {
    let resolveSave: (value: FunctionResponse) => void = () => undefined
    const pendingSave = new Promise<FunctionResponse>(resolve => {
      resolveSave = resolve
    })
    const functionA = { ...createFunction("function-a"), source: "A original" }
    const functionB = { ...createFunction("function-b"), source: "B original" }
    mocks.fetchOne.mockImplementation(async (id: string) =>
      id === functionA._id ? functionA : functionB
    )
    mocks.save.mockImplementationOnce(() => pendingSave)
    mocks.save.mockImplementation(async (fn, request) => ({
      ...fn,
      ...request,
    }))
    mocks.available.set(true)
    render(FunctionPage)

    await fireEvent.input(await screen.findByRole("textbox"), {
      target: { value: "A edited" },
    })
    await waitFor(() => expect(mocks.save).toHaveBeenCalledTimes(1))
    mocks.params.set({ workspaceId: "app_dev_one", functionId: "function-b" })
    await screen.findByDisplayValue("B original")
    resolveSave({ ...functionA, _rev: "2", source: "A edited" })
    await pendingSave
    await new Promise(resolve => setTimeout(resolve, 600))

    expect(screen.getByTestId("function-name")).toHaveTextContent("function-b")
    expect(screen.getByRole("textbox")).toHaveValue("B original")
    expect(mocks.save).toHaveBeenCalledTimes(1)
    expect(mocks.save).toHaveBeenCalledWith(
      expect.objectContaining({ _id: "function-a" }),
      expect.objectContaining({ source: "A edited" })
    )
  })

  it("saves edits to the newly selected Function after a previous save finishes", async () => {
    let resolveSave: (value: FunctionResponse) => void = () => undefined
    const pendingSave = new Promise<FunctionResponse>(resolve => {
      resolveSave = resolve
    })
    mocks.fetchOne.mockImplementation(async (id: string) => createFunction(id))
    mocks.save.mockImplementationOnce(() => pendingSave)
    mocks.save.mockImplementation(async (fn, request) => ({
      ...fn,
      ...request,
    }))
    mocks.available.set(true)
    render(FunctionPage)

    await fireEvent.input(await screen.findByRole("textbox"), {
      target: { value: "A edited" },
    })
    await waitFor(() => expect(mocks.save).toHaveBeenCalledTimes(1))
    mocks.params.set({ workspaceId: "app_dev_one", functionId: "function-b" })
    await waitFor(() =>
      expect(screen.getByTestId("function-name")).toHaveTextContent(
        "function-b"
      )
    )
    await fireEvent.input(screen.getByRole("textbox"), {
      target: { value: "B edited" },
    })
    await new Promise(resolve => setTimeout(resolve, 600))
    resolveSave({
      ...createFunction("function-a"),
      _rev: "2",
      source: "A edited",
    })
    await pendingSave
    await waitFor(() => expect(mocks.save).toHaveBeenCalledTimes(2))

    expect(screen.getByTestId("function-name")).toHaveTextContent("function-b")
    expect(mocks.save).toHaveBeenLastCalledWith(
      expect.objectContaining({ _id: "function-b" }),
      expect.objectContaining({ source: "B edited" })
    )
  })

  it("does not show a previous Function's save error on the selected Function", async () => {
    let rejectSave: (error: Error) => void = () => undefined
    const pendingSave = new Promise<FunctionResponse>((_resolve, reject) => {
      rejectSave = reject
    })
    mocks.fetchOne.mockImplementation(async (id: string) => createFunction(id))
    mocks.save.mockImplementationOnce(() => pendingSave)
    mocks.available.set(true)
    render(FunctionPage)

    await fireEvent.input(await screen.findByRole("textbox"), {
      target: { value: "A edited" },
    })
    await waitFor(() => expect(mocks.save).toHaveBeenCalledTimes(1))
    mocks.params.set({ workspaceId: "app_dev_one", functionId: "function-b" })
    await waitFor(() =>
      expect(screen.getByTestId("function-name")).toHaveTextContent(
        "function-b"
      )
    )
    rejectSave(new Error("A save failed"))
    await pendingSave.catch(() => undefined)
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(screen.getByTestId("function-name")).toHaveTextContent("function-b")
  })
})
