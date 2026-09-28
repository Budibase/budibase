import { API } from "@/api"
import { notifications } from "@budibase/bbui"
import { fireEvent, render, screen } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import GenerateFunctionCode from "./GenerateFunctionCode.svelte"

vi.mock("@/api", () => ({
  API: { generateFunctionCode: vi.fn() },
}))

describe("GenerateFunctionCode", () => {
  beforeEach(() => {
    document.body.className = "spectrum"
    document.body.innerHTML = '<div class="modal-container"></div>'
    vi.resetAllMocks()
    vi.spyOn(notifications, "error").mockImplementation(() => {})
  })

  it("lets an author review generated Function code before replacing the draft", async () => {
    const code =
      "export default async function () { return { output: { ok: true } } }"
    vi.mocked(API.generateFunctionCode).mockResolvedValue({ code })
    const onApply = vi.fn()
    render(GenerateFunctionCode, {
      functionName: "Example",
      source: "current source",
      capabilities: [],
      onApply,
    })

    await fireEvent.click(
      screen.getByRole("button", { name: /Help write code/ })
    )
    await fireEvent.input(
      screen.getByPlaceholderText(
        "Describe the inputs, linked queries, and output you need..."
      ),
      { target: { value: "Return success" } }
    )
    await fireEvent.click(screen.getByRole("button", { name: /Generate code/ }))
    await screen.findByRole("textbox", { name: "Review the generated code" })
    await fireEvent.click(
      screen.getByRole("button", { name: "Replace current code" })
    )

    expect(API.generateFunctionCode).toHaveBeenCalledWith({
      prompt: "Return success",
      functionName: "Example",
      source: "current source",
      queries: [],
    })
    expect(onApply).toHaveBeenCalledWith(code)
  })

  it("shows generation errors as a notification", async () => {
    vi.mocked(API.generateFunctionCode).mockRejectedValue(
      new Error("No available LLM configurations")
    )
    render(GenerateFunctionCode, {
      functionName: "Example",
      source: "current source",
      capabilities: [],
      onApply: vi.fn(),
    })

    await fireEvent.click(
      screen.getByRole("button", { name: /Help write code/ })
    )
    await fireEvent.input(
      screen.getByPlaceholderText(
        "Describe the inputs, linked queries, and output you need..."
      ),
      { target: { value: "Return success" } }
    )
    await fireEvent.click(screen.getByRole("button", { name: /Generate code/ }))

    expect(notifications.error).toHaveBeenCalledWith(
      "No available LLM configurations"
    )
    expect(screen.getByRole("button", { name: /Generate code/ })).toBeEnabled()
  })
})
