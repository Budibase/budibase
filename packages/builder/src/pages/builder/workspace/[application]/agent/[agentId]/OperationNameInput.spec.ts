import { fireEvent, render } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import OperationNameInput from "./OperationNameInput.svelte"

describe("OperationNameInput", () => {
  it("calls onSave with updated value on blur", async () => {
    const onSave = vi.fn()
    const { container } = render(OperationNameInput, {
      value: "Main operation",
      onSave,
    })

    const input = container.querySelector("input")
    expect(input).toBeTruthy()
    if (!input) {
      return
    }

    await fireEvent.input(input, { target: { value: "Customer support op" } })
    await fireEvent.blur(input)

    expect(onSave).toHaveBeenCalledWith("Customer support op")
  })

  it("calls onSave when Enter is pressed", async () => {
    const onSave = vi.fn()
    const { container } = render(OperationNameInput, {
      value: "Main operation",
      onSave,
    })

    const input = container.querySelector("input")
    expect(input).toBeTruthy()
    if (!input) {
      return
    }

    await fireEvent.input(input, { target: { value: "Escalation handler" } })
    await fireEvent.keyDown(input, { key: "Enter" })

    expect(onSave).toHaveBeenCalledWith("Escalation handler")
  })
})
