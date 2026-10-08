import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import MockBody from "@/test/mocks/MockBody.svelte"
import MockDropzone from "@/test/mocks/MockDropzone.svelte"
import MockInput from "@/test/mocks/MockInput.svelte"
import MockModalContent from "@/test/mocks/MockModalContent.svelte"
import MockSlot from "@/test/mocks/MockSlot.svelte"

vi.mock("@budibase/bbui", async () => {
  const { default: Toggle } = await import("@budibase/bbui/Form/Toggle.svelte")
  return {
    Body: MockBody,
    Dropzone: MockDropzone,
    Input: MockInput,
    Layout: MockSlot,
    ModalContent: MockModalContent,
    Toggle,
  }
})

import ImportProjectModal from "./ImportProjectModal.svelte"

describe("ImportProjectModal", () => {
  it("shows filename encryption and requires a password before importing", async () => {
    const onConfirm = vi.fn()
    const file = new File(["project"], "project.enc.tar.gz")
    render(ImportProjectModal, { onConfirm })

    await fireEvent.change(screen.getByLabelText("Project export"), {
      target: { files: [file] },
    })

    expect(screen.getByRole("checkbox")).toBeChecked()
    expect(screen.getByRole("checkbox")).toBeDisabled()
    expect(screen.getByRole("button", { name: "Import" })).toBeDisabled()

    await fireEvent.input(screen.getByLabelText("Password"), {
      target: { value: " password " },
    })
    await fireEvent.click(screen.getByRole("button", { name: "Import" }))

    expect(onConfirm).toHaveBeenCalledExactlyOnceWith({
      file,
      encryptPassword: "password",
    })
  })
})
