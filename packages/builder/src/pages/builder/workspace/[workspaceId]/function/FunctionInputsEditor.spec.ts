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

  it("saves a new input definition", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    render(FunctionInputsEditor, { onSave })
    await fireEvent.click(screen.getByRole("button", { name: /Add input/ }))
    await fireEvent.input(
      within(
        screen.getByRole("group", { name: "Input 1" })
      ).getByPlaceholderText("Enter input name"),
      {
        target: { value: "customerId" },
      }
    )
    await fireEvent.click(screen.getByRole("button", { name: /String/ }))
    await fireEvent.click(await screen.findByRole("option", { name: /Number/ }))
    await fireEvent.click(screen.getByRole("button", { name: "Save" }))
    expect(onSave).toHaveBeenCalledWith([
      {
        name: "customerId",
        type: "number",
      },
    ])
  })

  it.each(types)(
    "edits %s definitions without required controls",
    async type => {
      const inputSchema: FunctionInputDefinition[] = [{ name: "value", type }]
      const onSave = vi.fn().mockResolvedValue(undefined)
      render(FunctionInputsEditor, { inputSchema, onSave })
      await fireEvent.input(screen.getByPlaceholderText("Enter input name"), {
        target: { value: "renamed" },
      })
      await fireEvent.click(screen.getByRole("button", { name: "Save" }))
      expect(screen.queryByRole("checkbox")).not.toBeInTheDocument()
      expect(onSave).toHaveBeenCalledWith([{ name: "renamed", type }])
    }
  )

  it("validates only on save and allows corrections to be saved", async () => {
    const onSave = vi.fn()
    const onDirtyChange = vi.fn()
    render(FunctionInputsEditor, {
      inputSchema: [{ name: "name", type: "string" }],
      onSave,
      onDirtyChange,
    })
    await fireEvent.click(screen.getByRole("button", { name: /Add input/ }))
    await fireEvent.input(
      within(
        screen.getByRole("group", { name: "Input 2" })
      ).getByPlaceholderText("Enter input name"),
      {
        target: { value: "name" },
      }
    )
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    await fireEvent.click(screen.getByRole("button", { name: "Save" }))
    expect(
      within(screen.getByRole("group", { name: "Input 2" })).getByRole("alert")
    ).toHaveTextContent("input names must be unique")
    expect(screen.getByRole("button", { name: "Save" })).toBeEnabled()
    expect(onDirtyChange).toHaveBeenLastCalledWith(true)
    await fireEvent.input(
      within(
        screen.getByRole("group", { name: "Input 2" })
      ).getByPlaceholderText("Enter input name"),
      {
        target: { value: "bad name" },
      }
    )
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    await fireEvent.click(screen.getByRole("button", { name: "Save" }))
    expect(
      within(screen.getByRole("group", { name: "Input 2" })).getByRole("alert")
    ).toHaveTextContent("use a valid identifier")
    expect(onSave).not.toHaveBeenCalled()
    await fireEvent.input(
      within(
        screen.getByRole("group", { name: "Input 2" })
      ).getByPlaceholderText("Enter input name"),
      { target: { value: "customerId" } }
    )
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    await fireEvent.click(screen.getByRole("button", { name: "Save" }))
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(onSave).toHaveBeenCalledWith([
      { name: "name", type: "string" },
      { name: "customerId", type: "string" },
    ])
  })

  it("clears duplicate errors when the other input is renamed", async () => {
    render(FunctionInputsEditor, {
      inputSchema: [{ name: "name", type: "string" }],
      onSave: vi.fn(),
    })
    await fireEvent.click(screen.getByRole("button", { name: /Add input/ }))
    await fireEvent.input(
      within(
        screen.getByRole("group", { name: "Input 2" })
      ).getByPlaceholderText("Enter input name"),
      { target: { value: "name" } }
    )
    await fireEvent.click(screen.getByRole("button", { name: "Save" }))
    await fireEvent.input(
      within(
        screen.getByRole("group", { name: "Input 1" })
      ).getByPlaceholderText("Enter input name"),
      { target: { value: "customerId" } }
    )
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("saves removal of the last definition as the generic fallback", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    render(FunctionInputsEditor, {
      inputSchema: [{ name: "name", type: "string" }],
      onSave,
    })
    await fireEvent.click(
      screen.getByRole("button", { name: "Remove input 1" })
    )
    await fireEvent.click(screen.getByRole("button", { name: "Save" }))
    expect(onSave).toHaveBeenCalledWith([])
  })

  it("keeps edits and shows a save failure", async () => {
    const onSave = vi.fn().mockRejectedValue(new Error("Revision conflict"))
    render(FunctionInputsEditor, { onSave })
    await fireEvent.click(screen.getByRole("button", { name: /Add input/ }))
    await fireEvent.input(
      within(
        screen.getByRole("group", { name: "Input 1" })
      ).getByPlaceholderText("Enter input name"),
      {
        target: { value: "name" },
      }
    )
    await fireEvent.click(screen.getByRole("button", { name: "Save" }))
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Revision conflict")
    )
    expect(
      within(
        screen.getByRole("group", { name: "Input 1" })
      ).getByPlaceholderText("Enter input name")
    ).toHaveValue("name")
  })
})
