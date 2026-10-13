import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import { tick } from "svelte"
import { ResourceType, type SetInitInfoRequest } from "@budibase/types"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => {
  const createStore = <T>(initial: T) => {
    let value = initial
    const subscribers = new Set<(value: T) => void>()
    return {
      subscribe(subscriber: (value: T) => void) {
        subscriber(value)
        subscribers.add(subscriber)
        return () => subscribers.delete(subscriber)
      },
      set(next: T) {
        value = next
        subscribers.forEach(subscriber => subscriber(value))
      },
      update(updater: (value: T) => T) {
        this.set(updater(value))
      },
      get() {
        return value
      },
    }
  }

  const authState = createStore<{
    initInfo: SetInitInfoRequest
    user: { _id: string }
  }>({
    initInfo: {
      projectTemplate: { templateKey: "project/support" },
    },
    user: { _id: "us_test" },
  })
  const featureFlags = createStore({ PROJECTS: true, TEMPLATES: true })
  const setInitInfo = vi.fn(async (info: SetInitInfoRequest) => {
    authState.update(state => ({ ...state, initInfo: info }))
    return info
  })

  return {
    authState,
    featureFlags,
    setInitInfo,
    clearInitInfoState: vi.fn(() => {
      authState.update(state => ({ ...state, initInfo: {} }))
    }),
    getSelf: vi.fn(),
    fetchTemplates: vi.fn(),
    importTemplate: vi.fn(),
    loadWorkspaces: vi.fn(),
    createWorkspace: vi.fn(),
    isBuilder: vi.fn(() => true),
  }
})

vi.mock("nanoid", () => ({ nanoid: () => "template-modal" }))

vi.mock("@/api", () => ({
  API: { createApp: mocks.createWorkspace },
}))

vi.mock("@/stores/portal", () => ({
  auth: Object.assign(mocks.authState, {
    setInitInfo: mocks.setInitInfo,
    clearInitInfoState: mocks.clearInitInfoState,
    getSelf: mocks.getSelf,
  }),
  featureFlags: mocks.featureFlags,
  projectsStore: {
    fetchTemplates: mocks.fetchTemplates,
    importTemplate: mocks.importTemplate,
  },
  workspacesStore: { load: mocks.loadWorkspaces },
}))

vi.mock("@budibase/shared-core", async importOriginal => {
  const actual = await importOriginal<typeof import("@budibase/shared-core")>()
  return {
    ...actual,
    sdk: {
      ...actual.sdk,
      users: { ...actual.sdk.users, isBuilder: mocks.isBuilder },
    },
  }
})

import ProjectTemplateFlow from "./ProjectTemplateFlow.svelte"
import HomeProjectTabs from "./HomeProjectTabs.svelte"
import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"

const template = {
  key: "project/support",
  version: "1.0.0",
  packageVersion: 1,
  catalogueVersion: "2026-08-27.1",
  name: "Support Template",
  description: "A complete customer-support Project.",
  category: "Operations",
  status: "active" as const,
  owner: "solutions-engineering",
  compatibility: {
    minBudibaseVersion: "0.0.0",
    maxBudibaseVersionExclusive: "9999.0.0",
    requiredFeatures: ["projects"],
  },
}

const importResponse = {
  project: {
    _id: "project_imported",
    _rev: "1-test",
    name: "Support",
    createdAt: "2026-08-27T12:00:00.000Z",
    updatedAt: "2026-08-27T12:00:00.000Z",
  },
  resources: { [ResourceType.PROJECT]: ["project_imported"] },
  unsupportedContent: [],
  requirements: [],
  template: {
    key: template.key,
    version: template.version,
    packageVersion: template.packageVersion,
    catalogueVersion: template.catalogueVersion,
  },
}

const workspaces = [
  { id: "app_dev_current", name: "Operations" },
  { id: "app_dev_other", name: "Finance" },
]

const renderFlow = (props: Record<string, unknown> = {}) =>
  render(ProjectTemplateFlow, {
    props: {
      workspaces,
      currentWorkspaceId: "app_dev_current",
      currentWorkspaceName: "Operations",
      onImported: vi.fn(),
      ...props,
    },
  })

describe("ProjectTemplateFlow", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    const modalContainer = document.createElement("div")
    modalContainer.className = "modal-container"
    document.body.appendChild(modalContainer)

    mocks.authState.set({
      initInfo: { projectTemplate: { templateKey: template.key } },
      user: { _id: "us_test" },
    })
    mocks.featureFlags.set({ PROJECTS: true, TEMPLATES: true })
    mocks.fetchTemplates.mockResolvedValue([template])
    mocks.importTemplate.mockResolvedValue(importResponse)
    mocks.createWorkspace.mockResolvedValue({
      appId: "app_dev_created",
      instance: { _id: "app_dev_created" },
    })
    mocks.isBuilder.mockReturnValue(true)
  })

  afterEach(() => {
    document.querySelectorAll(".modal-container").forEach(node => node.remove())
  })

  it("imports into the current workspace and reports completion", async () => {
    const onImported = vi.fn()
    renderFlow({ onImported })

    await screen.findByRole("heading", { name: "Use Support Template" })
    await fireEvent.click(
      screen.getByRole("button", { name: "Import project" })
    )

    await waitFor(() =>
      expect(mocks.importTemplate).toHaveBeenCalledWith({
        templateKey: template.key,
        workspaceId: "app_dev_current",
      })
    )
    expect(onImported).toHaveBeenCalledWith({
      response: importResponse,
      workspaceId: "app_dev_current",
    })
    expect(mocks.clearInitInfoState).toHaveBeenCalled()
  })

  it("imports into another workspace using the native destination control", async () => {
    const onImported = vi.fn()
    renderFlow({ onImported })
    await screen.findByRole("heading", { name: "Use Support Template" })
    await fireEvent.click(screen.getByLabelText("Destination workspace"))
    await fireEvent.click(await screen.findByText("Finance"))
    await fireEvent.click(
      screen.getByRole("button", { name: "Import project" })
    )

    await waitFor(() =>
      expect(onImported).toHaveBeenCalledWith({
        response: importResponse,
        workspaceId: "app_dev_other",
      })
    )
    expect(mocks.importTemplate).toHaveBeenCalledWith({
      templateKey: template.key,
      workspaceId: "app_dev_other",
    })
  })

  it("clears a dormant intent when templates are disabled", async () => {
    mocks.featureFlags.set({ PROJECTS: true, TEMPLATES: false })
    renderFlow()

    await waitFor(() => expect(mocks.setInitInfo).toHaveBeenCalledWith({}))
    expect(mocks.fetchTemplates).not.toHaveBeenCalled()
    expect(
      screen.queryByRole("heading", { name: "Use Support Template" })
    ).not.toBeInTheDocument()
  })

  it("retains the intent when the catalogue is temporarily unavailable", async () => {
    mocks.fetchTemplates.mockRejectedValueOnce(new Error("unavailable"))
    renderFlow()

    await waitFor(() => expect(mocks.fetchTemplates).toHaveBeenCalled())
    expect(mocks.setInitInfo).not.toHaveBeenCalled()
    expect(mocks.authState.get().initInfo).toEqual({
      projectTemplate: { templateKey: template.key },
    })
  })

  it("retries a pending intent instead of opening discovery", async () => {
    mocks.fetchTemplates
      .mockRejectedValueOnce(new Error("unavailable"))
      .mockResolvedValueOnce([template])
    const { component } = renderFlow()

    await waitFor(() => expect(mocks.fetchTemplates).toHaveBeenCalledOnce())
    await component.showGallery()

    expect(mocks.fetchTemplates).toHaveBeenCalledTimes(2)
    expect(
      await screen.findByRole("heading", { name: "Use Support Template" })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("heading", { name: "Project templates" })
    ).not.toBeInTheDocument()
  })

  it("does not open discovery while intent resolution is pending", async () => {
    let resolveTemplates!: (templates: (typeof template)[]) => void
    mocks.fetchTemplates.mockReturnValueOnce(
      new Promise(resolve => {
        resolveTemplates = resolve
      })
    )
    const { component } = renderFlow()

    await waitFor(() => expect(mocks.fetchTemplates).toHaveBeenCalledOnce())
    await component.showGallery()

    expect(mocks.fetchTemplates).toHaveBeenCalledOnce()
    expect(
      screen.queryByRole("heading", { name: "Project templates" })
    ).not.toBeInTheDocument()

    resolveTemplates([template])
    expect(
      await screen.findByRole("heading", { name: "Use Support Template" })
    ).toBeInTheDocument()
  })

  it("awaits intent clearing before cancellation", async () => {
    renderFlow()
    await screen.findByRole("heading", { name: "Use Support Template" })

    await fireEvent.keyDown(document, { key: "Escape" })

    await waitFor(() => expect(mocks.setInitInfo).toHaveBeenCalledWith({}))
    await waitFor(() =>
      expect(
        screen.queryByRole("heading", { name: "Use Support Template" })
      ).not.toBeInTheDocument()
    )
  })

  it("resets the destination when a template intent is reopened", async () => {
    const onImported = vi.fn()
    const { component } = renderFlow({ canCreateWorkspace: true, onImported })
    await screen.findByRole("heading", { name: "Use Support Template" })
    await fireEvent.click(screen.getByLabelText("Destination workspace"))
    await fireEvent.click(await screen.findByText("Create a new workspace"))
    await fireEvent.input(screen.getByLabelText("Workspace name"), {
      target: { value: "Abandoned destination" },
    })
    await fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    await waitFor(() =>
      expect(
        screen.queryByRole("heading", { name: "Use Support Template" })
      ).not.toBeInTheDocument()
    )

    mocks.authState.set({
      initInfo: { projectTemplate: { templateKey: template.key } },
      user: { _id: "us_test" },
    })
    await component.showGallery()
    await fireEvent.click(
      await screen.findByRole("button", { name: "Import project" })
    )

    await waitFor(() =>
      expect(onImported).toHaveBeenCalledWith({
        response: importResponse,
        workspaceId: "app_dev_current",
      })
    )
    expect(mocks.createWorkspace).not.toHaveBeenCalled()
  })

  it("does not close while an import is in flight", async () => {
    let resolveImport!: (response: typeof importResponse) => void
    const pendingImport = new Promise<typeof importResponse>(resolve => {
      resolveImport = resolve
    })
    mocks.importTemplate.mockReturnValue(pendingImport)
    renderFlow()

    await screen.findByRole("heading", { name: "Use Support Template" })
    await fireEvent.click(
      screen.getByRole("button", { name: "Import project" })
    )
    await fireEvent.keyDown(document, { key: "Escape" })

    expect(
      screen.getByRole("heading", { name: "Use Support Template" })
    ).toBeInTheDocument()

    resolveImport(importResponse)
    await waitFor(() =>
      expect(
        screen.queryByRole("heading", { name: "Use Support Template" })
      ).not.toBeInTheDocument()
    )
  })

  it("retries into a workspace that was already created", async () => {
    mocks.importTemplate
      .mockRejectedValueOnce(new Error("import failed"))
      .mockResolvedValueOnce(importResponse)
    renderFlow({ canCreateWorkspace: true })

    await screen.findByRole("heading", { name: "Use Support Template" })
    await fireEvent.click(screen.getByLabelText("Destination workspace"))
    await fireEvent.click(await screen.findByText("Create a new workspace"))
    await fireEvent.input(screen.getByLabelText("Workspace name"), {
      target: { value: "Customer success" },
    })
    await fireEvent.click(
      screen.getByRole("button", { name: "Import project" })
    )

    await screen.findByText("Customer success")
    await fireEvent.click(
      await screen.findByRole("button", { name: "Import project" })
    )

    await waitFor(() => expect(mocks.importTemplate).toHaveBeenCalledTimes(2))
    expect(mocks.createWorkspace).toHaveBeenCalledTimes(1)
    expect(mocks.importTemplate).toHaveBeenNthCalledWith(2, {
      templateKey: template.key,
      workspaceId: "app_dev_created",
    })
  })

  it("retries workspace preparation without creating another workspace", async () => {
    mocks.loadWorkspaces
      .mockRejectedValueOnce(new Error("load failed"))
      .mockResolvedValueOnce(undefined)
    renderFlow({ canCreateWorkspace: true })

    await screen.findByRole("heading", { name: "Use Support Template" })
    await fireEvent.click(screen.getByLabelText("Destination workspace"))
    await fireEvent.click(await screen.findByText("Create a new workspace"))
    await fireEvent.input(screen.getByLabelText("Workspace name"), {
      target: { value: "Customer success" },
    })
    await fireEvent.click(
      screen.getByRole("button", { name: "Import project" })
    )

    await screen.findByText("Customer success")
    await fireEvent.click(
      await screen.findByRole("button", { name: "Import project" })
    )

    await waitFor(() => expect(mocks.importTemplate).toHaveBeenCalledOnce())
    expect(mocks.createWorkspace).toHaveBeenCalledOnce()
    expect(mocks.loadWorkspaces).toHaveBeenCalledTimes(2)
    expect(mocks.importTemplate).toHaveBeenCalledWith({
      templateKey: template.key,
      workspaceId: "app_dev_created",
    })
  })

  it("imports a discovered template directly into the current workspace", async () => {
    mocks.authState.set({ initInfo: {}, user: { _id: "us_test" } })
    const onImported = vi.fn()
    const { component: tabs } = render(HomeProjectTabs)
    const opener = screen.getByRole("button", {
      name: "Project create and import actions",
    })
    const { component } = renderFlow({
      onImported,
      onGalleryClose: () => tabs.focusCreateAction(),
    })
    opener.focus()

    await component.showGallery()
    await screen.findByRole("heading", { name: "Project templates" })
    await fireEvent.click(
      screen.getByRole("button", { name: "Use Support Template" })
    )

    await waitFor(() =>
      expect(mocks.importTemplate).toHaveBeenCalledWith({
        templateKey: template.key,
        workspaceId: "app_dev_current",
      })
    )
    expect(onImported).toHaveBeenCalledWith({
      response: importResponse,
      workspaceId: "app_dev_current",
    })
    await waitFor(() =>
      expect(
        screen.queryByRole("heading", { name: "Project templates" })
      ).not.toBeInTheDocument()
    )
    expect(opener).toHaveFocus()
  })

  it("lets the import summary own focus after the gallery closes", async () => {
    mocks.authState.set({ initInfo: {}, user: { _id: "us_test" } })
    const { component: tabs } = render(HomeProjectTabs)
    const { component: summary } = render(ConfirmDialog, {
      props: { title: "Project imported", okText: "Done", warning: false },
    })
    const { component } = renderFlow({
      onGalleryClose: () => tabs.focusCreateAction(),
      onImported: async () => {
        summary.show()
        await tick()
      },
    })

    await component.showGallery()
    await fireEvent.click(
      await screen.findByRole("button", { name: "Use Support Template" })
    )

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Done" })).toHaveFocus()
    )
  })

  it("ignores import completion after the current workspace changes", async () => {
    mocks.authState.set({ initInfo: {}, user: { _id: "us_test" } })
    let resolveImport!: (response: typeof importResponse) => void
    mocks.importTemplate.mockReturnValueOnce(
      new Promise(resolve => {
        resolveImport = resolve
      })
    )
    const onImported = vi.fn()
    const onGalleryClose = vi.fn()
    const { component, rerender } = renderFlow({ onImported, onGalleryClose })
    await component.showGallery()
    await fireEvent.click(
      await screen.findByRole("button", { name: "Use Support Template" })
    )
    await rerender({
      currentWorkspaceId: "app_dev_other",
      currentWorkspaceName: "Finance",
      onImported,
      onGalleryClose,
    })
    resolveImport(importResponse)

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Use Support Template" })
      ).toBeEnabled()
    )
    expect(mocks.importTemplate).toHaveBeenCalledWith({
      templateKey: template.key,
      workspaceId: "app_dev_current",
    })
    expect(onImported).not.toHaveBeenCalled()
    expect(onGalleryClose).not.toHaveBeenCalled()
  })

  it("ignores import completion after leaving the gallery page", async () => {
    mocks.authState.set({ initInfo: {}, user: { _id: "us_test" } })
    let resolveImport!: (response: typeof importResponse) => void
    const importing = new Promise<typeof importResponse>(resolve => {
      resolveImport = resolve
    })
    mocks.importTemplate.mockReturnValueOnce(importing)
    const onImported = vi.fn()
    const { component, unmount } = renderFlow({ onImported })
    await component.showGallery()
    await fireEvent.click(
      await screen.findByRole("button", { name: "Use Support Template" })
    )
    unmount()
    resolveImport(importResponse)
    await importing
    await tick()

    expect(onImported).not.toHaveBeenCalled()
  })

  it("shows discovery while the catalogue loads and ignores re-entry", async () => {
    mocks.authState.set({ initInfo: {}, user: { _id: "us_test" } })
    let resolveTemplates!: (templates: (typeof template)[]) => void
    mocks.fetchTemplates.mockReturnValueOnce(
      new Promise(resolve => {
        resolveTemplates = resolve
      })
    )
    const { component } = renderFlow()

    const loading = component.showGallery()
    expect(await screen.findByText("Loading templates…")).toBeInTheDocument()
    expect(
      screen
        .getByRole("dialog", { name: "Project templates" })
        .contains(document.activeElement)
    ).toBe(true)
    expect(screen.getByText(/Imports a new project into/)).toHaveTextContent(
      "Operations"
    )
    await component.showGallery()
    expect(mocks.fetchTemplates).toHaveBeenCalledOnce()

    resolveTemplates([template])
    await loading
    expect(
      screen.getByRole("button", { name: "Use Support Template" })
    ).toBeEnabled()
  })

  it("retries catalogue loading inside discovery", async () => {
    mocks.authState.set({ initInfo: {}, user: { _id: "us_test" } })
    mocks.fetchTemplates.mockRejectedValueOnce(new Error("unavailable"))
    const { component } = renderFlow()

    await component.showGallery()
    const retryButton = await screen.findByRole("button", { name: "Try again" })
    retryButton.focus()
    await fireEvent.click(retryButton)

    expect(
      await screen.findByRole("button", { name: "Use Support Template" })
    ).toBeEnabled()
    await waitFor(() =>
      expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(
        true
      )
    )
    expect(retryButton).not.toBeInTheDocument()
  })

  it("reloads discovery and restores focus when reopened after an error", async () => {
    mocks.authState.set({ initInfo: {}, user: { _id: "us_test" } })
    mocks.fetchTemplates.mockRejectedValueOnce(new Error("unavailable"))
    const { component } = renderFlow()

    await component.showGallery()
    await fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    )
    await component.showGallery()

    expect(
      await screen.findByRole("button", { name: "Use Support Template" })
    ).toBeEnabled()
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(
      true
    )
    expect(mocks.fetchTemplates).toHaveBeenCalledTimes(2)
  })

  it("reopens discovery while the original catalogue request is pending", async () => {
    mocks.authState.set({ initInfo: {}, user: { _id: "us_test" } })
    let resolveTemplates!: (templates: (typeof template)[]) => void
    mocks.fetchTemplates.mockReturnValueOnce(
      new Promise(resolve => {
        resolveTemplates = resolve
      })
    )
    const { component } = renderFlow()

    const loading = component.showGallery()
    await screen.findByText("Loading templates…")
    await fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    )
    await component.showGallery()
    await screen.findByText("Loading templates…")
    resolveTemplates([template])
    await loading

    expect(
      await screen.findByRole("button", { name: "Use Support Template" })
    ).toBeEnabled()
    expect(mocks.fetchTemplates).toHaveBeenCalledOnce()
  })

  it("keeps discovery open when an import fails", async () => {
    mocks.authState.set({ initInfo: {}, user: { _id: "us_test" } })
    mocks.importTemplate.mockRejectedValueOnce(new Error("import failed"))
    const { component } = renderFlow()

    await component.showGallery()
    await fireEvent.click(
      await screen.findByRole("button", { name: "Use Support Template" })
    )

    await waitFor(() => expect(mocks.importTemplate).toHaveBeenCalled())
    expect(
      screen.getByRole("heading", { name: "Project templates" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Use Support Template" })
    ).toBeEnabled()
  })

  it("returns focus to Project actions when discovery is cancelled during retry", async () => {
    mocks.authState.set({ initInfo: {}, user: { _id: "us_test" } })
    let resolveTemplates!: (templates: (typeof template)[]) => void
    mocks.fetchTemplates
      .mockRejectedValueOnce(new Error("unavailable"))
      .mockReturnValueOnce(
        new Promise(resolve => {
          resolveTemplates = resolve
        })
      )
    const { component: tabs } = render(HomeProjectTabs)
    const opener = screen.getByRole("button", {
      name: "Project create and import actions",
    })
    const { component } = renderFlow({
      onGalleryClose: () => tabs.focusCreateAction(),
    })
    opener.focus()

    await component.showGallery()
    await fireEvent.click(
      await screen.findByRole("button", { name: "Try again" })
    )
    await screen.findByText("Loading templates…")
    await fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    resolveTemplates([template])
    await tick()

    await waitFor(() =>
      expect(
        screen.queryByRole("heading", { name: "Project templates" })
      ).not.toBeInTheDocument()
    )
    expect(opener).toHaveFocus()
  })
})
