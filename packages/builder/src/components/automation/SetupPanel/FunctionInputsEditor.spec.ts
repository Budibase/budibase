import { EditorView } from "@codemirror/view"
import { fireEvent, render, screen } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { FunctionInputType, JSONValue } from "@budibase/types"
import { encodeJSBinding } from "@budibase/string-templates"
import FunctionInputsEditor from "./FunctionInputsEditor.svelte"

const cases: { type: FunctionInputType; text: string; value: JSONValue }[] = [
  { type: "string", text: "Ada", value: "Ada" },
  { type: "number", text: "0", value: 0 },
  { type: "object", text: '{"nested":true}', value: { nested: true } },
  { type: "array", text: "[1,null]", value: [1, null] },
]

describe("Function automation input fields", () => {
  beforeEach(() => {
    document.body.className = "spectrum"
  })

  it.each(["string", "number", "boolean", "object", "array"] as const)(
    "displays JavaScript bindings in %s fields",
    type => {
      render(FunctionInputsEditor, {
        inputSchema: [{ name: "value", type }],
        value: { value: encodeJSBinding("return null") },
      })
      expect(screen.getByRole("textbox")).toHaveValue("(JavaScript function)")
      expect(screen.getByRole("textbox")).toHaveAttribute("readonly")
    }
  )

  it.each(cases)(
    "saves a $type field and preserves other inputs",
    async ({ type, text, value }) => {
      const onchange = vi.fn()
      render(FunctionInputsEditor, {
        inputSchema: [{ name: "value", type }],
        value: { other: "keep" },
        onchange,
      })
      const field = screen.getByRole(
        type === "number" ? "spinbutton" : "textbox"
      )
      if (type === "object" || type === "array") {
        const editor = EditorView.findFromDOM(field)!
        editor.dispatch({
          changes: { from: 0, to: editor.state.doc.length, insert: text },
        })
      } else {
        await fireEvent.input(field, { target: { value: text } })
      }
      await fireEvent.blur(field)
      expect(onchange).toHaveBeenCalledWith({ value, other: "keep" })
      expect(field.getAttribute("placeholder")).toBeFalsy()
    }
  )

  it("saves a boolean using the bindable Select", async () => {
    const onchange = vi.fn()
    render(FunctionInputsEditor, {
      inputSchema: [{ name: "enabled", type: "boolean" }],
      onchange,
    })
    await fireEvent.click(
      screen.getByRole("button", { name: /Choose an option/ })
    )
    await fireEvent.click(
      screen.getByRole("option", { name: /False/, hidden: true })
    )
    expect(onchange).toHaveBeenCalledWith({ enabled: false })
  })

  it("rejects invalid JSON and saves a correction", async () => {
    const onchange = vi.fn()
    render(FunctionInputsEditor, {
      inputSchema: [{ name: "items", type: "array" }],
      onchange,
    })
    const field = screen.getByRole("textbox")
    const editor = EditorView.findFromDOM(field)!
    editor.dispatch({ changes: { from: 0, insert: "invalid" } })
    await fireEvent.blur(field)
    editor.dispatch({
      changes: { from: 0, to: editor.state.doc.length, insert: "[42]" },
    })
    await fireEvent.blur(field)
    expect(onchange).toHaveBeenCalledExactlyOnceWith({ items: [42] })
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("saves readable bindings as runtime expressions", async () => {
    const onchange = vi.fn()
    render(FunctionInputsEditor, {
      inputSchema: [{ name: "count", type: "number" }],
      value: { count: "{{ trigger.fields.count }}" },
      bindings: [
        {
          category: "Trigger",
          readableBinding: "Trigger.Count",
          runtimeBinding: "trigger.fields.count",
        },
      ],
      onchange,
    })
    const field = screen.getByRole("textbox")
    await fireEvent.input(field, {
      target: { value: "{{ Trigger.Count }}" },
    })
    await fireEvent.blur(field)
    expect(onchange).toHaveBeenCalledWith({
      count: "{{ trigger.fields.count }}",
    })
  })

  it("clears a number binding and restores numeric entry", async () => {
    const onchange = vi.fn()
    const { rerender } = render(FunctionInputsEditor, {
      inputSchema: [{ name: "count", type: "number" }],
      value: { count: "{{ trigger.fields.count }}" },
      onchange,
    })
    await fireEvent.click(screen.getByLabelText("x"))
    await rerender({ value: {} })

    expect(onchange).toHaveBeenCalledExactlyOnceWith({})
    expect(screen.getByRole("spinbutton")).toHaveValue(null)
    expect(screen.getByLabelText("lightning")).toBeInTheDocument()
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
  })

  it("omits a cleared string input", async () => {
    const onchange = vi.fn()
    render(FunctionInputsEditor, {
      inputSchema: [{ name: "value", type: "string" }],
      value: { value: "remove", other: false },
      onchange,
    })
    const field = screen.getByRole("textbox")
    await fireEvent.input(field, { target: { value: "" } })
    await fireEvent.blur(field)
    expect(onchange).toHaveBeenCalledWith({ other: false })
  })

  it("preserves omission when an unchanged blank string field loses focus", async () => {
    const onchange = vi.fn()
    render(FunctionInputsEditor, {
      inputSchema: [{ name: "value", type: "string" }],
      value: { other: "keep" },
      onchange,
    })
    const field = screen.getByRole("textbox")
    await fireEvent.focus(field)
    await fireEvent.blur(field)
    expect(onchange).not.toHaveBeenCalled()
  })

  it("stores constructor as an own input in the serialized payload", async () => {
    const onchange = vi.fn()
    render(FunctionInputsEditor, {
      inputSchema: [{ name: "constructor", type: "object" }],
      value: { other: "keep" },
      onchange,
    })
    const field = screen.getByRole("textbox")
    const editor = EditorView.findFromDOM(field)!
    editor.dispatch({
      changes: {
        from: 0,
        to: editor.state.doc.length,
        insert: '{"nested":true}',
      },
    })
    await fireEvent.blur(field)
    expect(JSON.stringify(onchange.mock.calls[0][0])).toBe(
      '{"other":"keep","constructor":{"nested":true}}'
    )
  })

  it("does not display inherited properties as omitted input values", () => {
    render(FunctionInputsEditor, {
      inputSchema: [{ name: "toString", type: "string" }],
      value: {},
    })
    expect(screen.getByRole("textbox")).toHaveValue("")
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("shows only a message when no inputs are declared", () => {
    render(FunctionInputsEditor, {
      inputSchema: [],
      value: { existing: true },
    })
    expect(screen.getByText("This Function has no inputs.")).toBeInTheDocument()
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument()
  })
})
