import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/svelte"
import type { ProjectResponse } from "@budibase/types"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import ProjectReadme from "./ProjectReadme.svelte"

const project: ProjectResponse = {
  _id: "project_operations",
  _rev: "1-original",
  name: "Operations",
  readme: "# Getting started\nWelcome to the project.",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
}

describe("ProjectReadme", () => {
  const onSave = vi.fn()
  const onReload = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    const modalContainer = document.createElement("div")
    modalContainer.className = "modal-container"
    document.body.appendChild(modalContainer)
    onSave.mockResolvedValue({ ...project, _rev: "2-saved" })
  })

  afterEach(() => {
    document.querySelectorAll(".modal-container").forEach(node => node.remove())
  })

  it("renders Markdown and offers a return action in focused reading mode", async () => {
    const onBack = vi.fn()
    render(ProjectReadme, { project, focused: true, onBack, onSave, onReload })
    expect(
      screen.getByRole("heading", { name: "Getting started" })
    ).toBeInTheDocument()
    await fireEvent.click(
      screen.getByRole("button", { name: "Back to resources" })
    )
    expect(onBack).toHaveBeenCalledOnce()
  })

  it("shows an add prompt only to builders for an empty guide", async () => {
    const emptyProject = { ...project, readme: "" }
    const { rerender } = render(ProjectReadme, {
      project: emptyProject,
      canEdit: false,
      onSave,
      onReload,
    })
    expect(screen.queryByRole("region", { name: "Project notes" })).toBeNull()

    await rerender({ project: emptyProject, canEdit: true, onSave, onReload })
    expect(
      screen.getByRole("button", { name: "Add project notes" })
    ).toBeInTheDocument()
    await rerender({ project: undefined, canEdit: true, onSave, onReload })
    expect(screen.queryByRole("region", { name: "Project notes" })).toBeNull()
  })

  it("keeps an open modal draft scoped to its original project during selection changes", async () => {
    const { rerender } = render(ProjectReadme, {
      project,
      canEdit: true,
      onSave,
      onReload,
    })
    await fireEvent.click(screen.getByRole("button", { name: "Edit notes" }))
    await fireEvent.input(screen.getByRole("textbox"), {
      target: { value: "Original project's draft" },
    })
    await rerender({
      project: { ...project, _id: "project_finance", name: "Finance" },
      canEdit: true,
      onSave,
      onReload,
    })
    expect(
      within(screen.getByRole("dialog")).getByRole("heading", {
        name: "Edit notes for Operations",
      })
    ).toBeInTheDocument()
    await fireEvent.click(screen.getByRole("button", { name: "Save notes" }))
    await waitFor(() => expect(onSave).toHaveBeenCalledOnce())
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "project_operations",
        _rev: "1-original",
        readme: "Original project's draft",
      })
    )
  })

  it("retains the draft when selection disappears after a failed reload", async () => {
    onSave.mockRejectedValueOnce({ status: 409 })
    onReload.mockRejectedValueOnce(new Error("Latest notes unavailable"))
    const { rerender } = render(ProjectReadme, {
      project,
      canEdit: true,
      onSave,
      onReload,
    })
    await fireEvent.click(screen.getByRole("button", { name: "Edit notes" }))
    await fireEvent.input(screen.getByRole("textbox"), {
      target: { value: "Keep this work" },
    })
    await fireEvent.click(screen.getByRole("button", { name: "Save notes" }))
    await screen.findByText("Latest notes unavailable")
    await rerender({ project: undefined, canEdit: true, onSave, onReload })
    expect(onReload).toHaveBeenCalledExactlyOnceWith(project._id)
    expect(screen.getByText("Latest notes unavailable")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Save notes" })).toBeDisabled()
    expect(
      screen.getByRole("button", { name: "Load latest saved notes" })
    ).toBeInTheDocument()
    expect(screen.getByRole("textbox")).toHaveValue("Keep this work")
    expect(
      within(screen.getByRole("dialog")).getByRole("heading", {
        name: "Edit notes for Operations",
      })
    ).toBeInTheDocument()
  })
})
