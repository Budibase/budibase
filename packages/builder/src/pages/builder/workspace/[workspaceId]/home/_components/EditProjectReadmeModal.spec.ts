import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import {
  MAX_PROJECT_README_LENGTH,
  type ProjectResponse,
} from "@budibase/types"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MockModalContent from "@/test/mocks/MockModalContent.svelte"

vi.mock("@budibase/bbui", async importOriginal => {
  const actual = await importOriginal<typeof import("@budibase/bbui")>()
  return { ...actual, ModalContent: MockModalContent }
})

import EditProjectReadmeModal from "./EditProjectReadmeModal.svelte"

const project: ProjectResponse = {
  _id: "project_operations",
  _rev: "1-original",
  name: "Operations",
  description: "Team tools",
  color: "#8CA171",
  readme: "# Getting started\nOriginal guide",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
}

describe("EditProjectReadmeModal", () => {
  const onSave = vi.fn()
  const onReload = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    onSave.mockResolvedValue({ ...project, _rev: "2-saved" })
  })

  it("previews the current draft and saves it using the revision loaded at open", async () => {
    render(EditProjectReadmeModal, { project, onSave, onReload })

    await fireEvent.input(screen.getByRole("textbox"), {
      target: { value: "# Setup\nFollow these instructions." },
    })
    await fireEvent.click(screen.getByRole("button", { name: "Preview" }))
    expect(screen.getByRole("heading", { name: "Setup" })).toBeInTheDocument()
    await fireEvent.click(screen.getByRole("button", { name: "Save notes" }))

    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith({
        _id: project._id,
        _rev: "1-original",
        name: project.name,
        description: project.description,
        color: project.color,
        readme: "# Setup\nFollow these instructions.",
      })
    )
  })

  it("keeps the draft after a failed save and retries with the same revision", async () => {
    onSave.mockRejectedValueOnce(new Error("Connection lost"))
    render(EditProjectReadmeModal, { project, onSave, onReload })
    await fireEvent.input(screen.getByRole("textbox"), {
      target: { value: "My unsaved changes" },
    })
    await fireEvent.click(screen.getByRole("button", { name: "Save notes" }))

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Connection lost"
    )
    expect(screen.getByRole("textbox")).toHaveValue("My unsaved changes")
    await fireEvent.click(screen.getByRole("button", { name: "Save notes" }))
    expect(onSave).toHaveBeenLastCalledWith(
      expect.objectContaining({
        _rev: "1-original",
        readme: "My unsaved changes",
      })
    )
    expect(onReload).not.toHaveBeenCalled()
  })

  it("requires deliberate conflict reconciliation and keeps latest project metadata", async () => {
    const latestProject = {
      ...project,
      _rev: "2-teammate",
      name: "Renamed operations",
      description: "Updated summary",
      color: "#123456",
      readme: "# Latest guide\nA teammate's saved work",
    }
    onSave.mockRejectedValueOnce({ status: 409, message: "conflict" })
    onReload.mockResolvedValue(latestProject)
    render(EditProjectReadmeModal, { project, onSave, onReload })
    await fireEvent.input(screen.getByRole("textbox"), {
      target: { value: "My draft survives" },
    })
    await fireEvent.click(screen.getByRole("button", { name: "Save notes" }))

    await screen.findByRole("heading", { name: "Latest guide" })
    expect(screen.getByRole("textbox")).toHaveValue("My draft survives")
    expect(screen.getByRole("button", { name: "Save notes" })).toBeDisabled()
    expect(onSave).toHaveBeenCalledOnce()
    await fireEvent.click(
      screen.getByRole("button", { name: "Use latest revision" })
    )
    expect(screen.getByRole("textbox")).toHaveValue("My draft survives")
    await fireEvent.click(screen.getByRole("button", { name: "Save notes" }))

    expect(onSave).toHaveBeenLastCalledWith({
      _id: project._id,
      _rev: "2-teammate",
      name: latestProject.name,
      description: latestProject.description,
      color: latestProject.color,
      readme: "My draft survives",
    })
  })

  it("keeps the editor and revision blocked if loading the latest notes fails", async () => {
    onSave.mockRejectedValueOnce({ status: 409 })
    onReload.mockRejectedValueOnce(new Error("Latest notes unavailable"))
    render(EditProjectReadmeModal, { project, onSave, onReload })
    await fireEvent.input(screen.getByRole("textbox"), {
      target: { value: "A retained draft" },
    })
    await fireEvent.click(screen.getByRole("button", { name: "Save notes" }))
    await screen.findByText("Latest notes unavailable")
    expect(screen.getByRole("button", { name: "Save notes" })).toBeDisabled()
    expect(screen.getByRole("textbox")).toHaveValue("A retained draft")

    onReload.mockResolvedValueOnce({ ...project, _rev: "3-latest" })
    await fireEvent.click(
      screen.getByRole("button", { name: "Load latest saved notes" })
    )
    await screen.findByRole("button", { name: "Use latest revision" })
    expect(screen.getByRole("button", { name: "Save notes" })).toBeDisabled()
    expect(onSave).toHaveBeenCalledOnce()
  })

  it("does not move an open draft to a newly selected project", async () => {
    const { rerender } = render(EditProjectReadmeModal, {
      project,
      onSave,
      onReload,
    })
    await fireEvent.input(screen.getByRole("textbox"), {
      target: { value: "Operations draft" },
    })
    await rerender({
      project: { ...project, _id: "project_finance", name: "Finance" },
      onSave,
      onReload,
    })
    await fireEvent.click(screen.getByRole("button", { name: "Save notes" }))
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "project_operations",
        _rev: "1-original",
        readme: "Operations draft",
      })
    )
  })

  it("saves an empty string to explicitly clear the guide", async () => {
    render(EditProjectReadmeModal, { project, onSave, onReload })
    await fireEvent.input(screen.getByRole("textbox"), {
      target: { value: "" },
    })
    await fireEvent.click(screen.getByRole("button", { name: "Save notes" }))
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ readme: "" }))
  })

  it("keeps an over-limit draft available while preventing an invalid save", async () => {
    render(EditProjectReadmeModal, { project, onSave, onReload })
    const draft = "a".repeat(MAX_PROJECT_README_LENGTH + 1)
    await fireEvent.input(screen.getByRole("textbox"), {
      target: { value: draft },
    })
    expect(screen.getByRole("button", { name: "Save notes" })).toBeDisabled()
    expect(screen.getByRole("textbox")).toHaveValue(draft)
    expect(onSave).not.toHaveBeenCalled()
  })
})
