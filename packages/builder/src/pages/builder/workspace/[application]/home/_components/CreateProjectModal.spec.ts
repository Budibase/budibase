import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import MockBody from "@/test/mocks/MockBody.svelte"
import MockColorPicker from "@/test/mocks/MockColorPicker.svelte"
import MockInput from "@/test/mocks/MockInput.svelte"
import MockModalContent from "@/test/mocks/MockModalContent.svelte"

vi.mock("@budibase/bbui", () => ({
  keepOpen: Symbol("keepOpen"),
  Body: MockBody,
  ColorPicker: MockColorPicker,
  Input: MockInput,
  ModalContent: MockModalContent,
  TextArea: MockInput,
}))

import CreateProjectModal from "./CreateProjectModal.svelte"

describe("CreateProjectModal", () => {
  it("submits without a colour after the colour picker is cleared", async () => {
    const onConfirm = vi.fn()

    render(CreateProjectModal, {
      props: {
        onConfirm,
      },
    })

    await fireEvent.input(screen.getByLabelText("Name"), {
      target: { value: "Operations" },
    })
    await fireEvent.click(screen.getByText("Clear color"))
    await fireEvent.click(screen.getByText("Create"))

    expect(onConfirm).toHaveBeenCalledWith({
      name: "Operations",
      description: undefined,
      color: undefined,
    })
  })

  it("edits an existing project", async () => {
    const onConfirm = vi.fn()

    render(CreateProjectModal, {
      props: {
        project: {
          _id: "project_1",
          _rev: "1-rev",
          name: "Operations",
          description: "Original description",
          color: "#8CA171",
          createdAt: "2026-01-01T00:00:00.000Z",
        },
        onConfirm,
      },
    })

    expect(screen.getByLabelText("Name")).toHaveValue("Operations")
    await fireEvent.input(screen.getByLabelText("Description"), {
      target: { value: "Updated description" },
    })
    await fireEvent.click(screen.getByText("Save"))

    expect(onConfirm).toHaveBeenCalledWith({
      name: "Operations",
      description: "Updated description",
      color: "#8CA171",
    })
  })
})
