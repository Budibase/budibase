import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type {
  FunctionInputDefinition,
  FunctionInputType,
} from "@budibase/types"
import FunctionInputsEditor from "./FunctionInputsEditor.svelte"

const types: FunctionInputType[] = [
  "string",
  "number",
  "boolean",
  "object",
  "array",
]

describe("FunctionInputsEditor", () => {
  beforeEach(() => {
    document.body.className = "spectrum"
  })

  it("shows the generic fallback and saves a new input definition", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    render(FunctionInputsEditor, { onSave })
    expect(
      screen.getByText(/accepts a generic JSON object/)
    ).toBeInTheDocument()
    await fireEvent.click(screen.getByRole("button", { name: "Add input" }))
    await fireEvent.input(
      within(
        screen.getByRole("group", { name: "Input 1" })
      ).getByPlaceholderText("customerId"),
      {
        target: { value: "customerId" },
      }
    )
    await fireEvent.input(
      within(screen.getByRole("group", { name: "Input 1" })).getAllByRole(
        "textbox"
      )[1],
      {
        target: { value: "Customer identifier" },
      }
    )
    await fireEvent.click(screen.getByRole("button", { name: /string/ }))
    await fireEvent.click(await screen.findByRole("option", { name: /number/ }))
    await fireEvent.click(screen.getByRole("button", { name: "Save inputs" }))
    expect(onSave).toHaveBeenCalledWith([
      {
        name: "customerId",
        type: "number",
        required: true,
        description: "Customer identifier",
      },
    ])
  })

  it.each(types)("edits required and optional %s definitions", async type => {
    const inputSchema: FunctionInputDefinition[] = [
      { name: "required", type, required: true, description: "Required value" },
      { name: "optional", type, required: false },
    ]
    const onSave = vi.fn().mockResolvedValue(undefined)
    render(FunctionInputsEditor, { inputSchema, onSave })
    expect(
      within(screen.getByRole("group", { name: "Input 1" })).getByRole(
        "button",
        { name: new RegExp(type) }
      )
    ).toBeInTheDocument()
    expect(
      within(screen.getByRole("group", { name: "Input 2" })).getByRole(
        "button",
        { name: new RegExp(type) }
      )
    ).toBeInTheDocument()
    expect(
      within(screen.getByRole("group", { name: "Input 1" })).getByRole(
        "checkbox",
        { name: /Required/ }
      )
    ).toBeChecked()
    expect(
      within(screen.getByRole("group", { name: "Input 2" })).getByRole(
        "checkbox",
        { name: /Required/ }
      )
    ).not.toBeChecked()
    await fireEvent.click(
      within(screen.getByRole("group", { name: "Input 1" })).getByRole(
        "checkbox",
        { name: /Required/ }
      )
    )
    await fireEvent.click(
      within(screen.getByRole("group", { name: "Input 2" })).getByRole(
        "checkbox",
        { name: /Required/ }
      )
    )
    await fireEvent.click(screen.getByRole("button", { name: "Save inputs" }))
    expect(onSave).toHaveBeenCalledWith([
      { ...inputSchema[0], required: false },
      { ...inputSchema[1], required: true },
    ])
  })

  it("blocks duplicate or invalid names and reports dirty changes", async () => {
    const onSave = vi.fn()
    const onDirtyChange = vi.fn()
    render(FunctionInputsEditor, {
      inputSchema: [{ name: "name", type: "string", required: true }],
      onSave,
      onDirtyChange,
    })
    await fireEvent.click(screen.getByRole("button", { name: "Add input" }))
    await fireEvent.input(
      within(
        screen.getByRole("group", { name: "Input 2" })
      ).getByPlaceholderText("customerId"),
      {
        target: { value: "name" },
      }
    )
    expect(screen.getByRole("alert")).toHaveTextContent(
      "input names must be unique"
    )
    expect(screen.getByRole("button", { name: "Save inputs" })).toBeDisabled()
    expect(onDirtyChange).toHaveBeenLastCalledWith(true)
    await fireEvent.input(
      within(
        screen.getByRole("group", { name: "Input 2" })
      ).getByPlaceholderText("customerId"),
      {
        target: { value: "bad name" },
      }
    )
    expect(screen.getByRole("alert")).toHaveTextContent(
      "use a valid identifier"
    )
    expect(onSave).not.toHaveBeenCalled()
  })

  it("saves removal of the last definition as the generic fallback", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    render(FunctionInputsEditor, {
      inputSchema: [{ name: "name", type: "string", required: true }],
      onSave,
    })
    await fireEvent.click(
      screen.getByRole("button", { name: "Remove input 1" })
    )
    await fireEvent.click(screen.getByRole("button", { name: "Save inputs" }))
    expect(onSave).toHaveBeenCalledWith([])
  })

  it("keeps edits and shows a save failure", async () => {
    const onSave = vi.fn().mockRejectedValue(new Error("Revision conflict"))
    render(FunctionInputsEditor, { onSave })
    await fireEvent.click(screen.getByRole("button", { name: "Add input" }))
    await fireEvent.input(
      within(
        screen.getByRole("group", { name: "Input 1" })
      ).getByPlaceholderText("customerId"),
      {
        target: { value: "name" },
      }
    )
    await fireEvent.click(screen.getByRole("button", { name: "Save inputs" }))
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Revision conflict")
    )
    expect(
      within(
        screen.getByRole("group", { name: "Input 1" })
      ).getByPlaceholderText("customerId")
    ).toHaveValue("name")
  })
})
