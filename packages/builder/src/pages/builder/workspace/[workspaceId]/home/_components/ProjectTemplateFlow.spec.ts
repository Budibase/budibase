import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import { tick } from "svelte"
import { ResourceType } from "@budibase/types"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => {
  let flags = { PROJECTS: true, TEMPLATES: true }
  const subscribers = new Set<(value: typeof flags) => void>()
  return {
    featureFlags: {
      subscribe(subscriber: (value: typeof flags) => void) {
        subscriber(flags)
        subscribers.add(subscriber)
        return () => subscribers.delete(subscriber)
      },
      set(next: typeof flags) {
        flags = next
        subscribers.forEach(subscriber => subscriber(flags))
      },
    },
    fetchTemplates: vi.fn(),
    importTemplate: vi.fn(),
  }
})

vi.mock("nanoid", () => ({ nanoid: () => "template-modal" }))
vi.mock("@/stores/portal", () => ({
  featureFlags: mocks.featureFlags,
  projectsStore: {
    fetchTemplates: mocks.fetchTemplates,
    importTemplate: mocks.importTemplate,
  },
}))

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

const renderFlow = (props: Record<string, unknown> = {}) =>
  render(ProjectTemplateFlow, {
    props: {
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
    mocks.featureFlags.set({ PROJECTS: true, TEMPLATES: true })
    mocks.fetchTemplates.mockResolvedValue([template])
    mocks.importTemplate.mockResolvedValue(importResponse)
  })

  afterEach(() => {
    document.querySelectorAll(".modal-container").forEach(node => node.remove())
  })

  it("imports a discovered template directly into the current workspace", async () => {
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
