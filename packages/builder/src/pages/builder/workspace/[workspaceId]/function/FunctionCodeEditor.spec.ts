import { themeStore } from "@/stores/portal"
import { Theme } from "@budibase/types"
import { startCompletion } from "@codemirror/autocomplete"
import { EditorView } from "@codemirror/view"
import { render, screen, waitFor } from "@testing-library/svelte"
import { get } from "svelte/store"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import FunctionCodeEditor from "./FunctionCodeEditor.svelte"

describe("FunctionCodeEditor", () => {
  const initialTheme = get(themeStore).theme

  beforeEach(() => {
    document.body.className = "spectrum"
  })

  afterEach(() => {
    themeStore.set({ theme: initialTheme })
  })

  it("renders TypeScript source and located compiler diagnostics", async () => {
    const view = render(FunctionCodeEditor, {
      value: "const broken: string = 42",
      diagnostics: [
        {
          code: "TS2322",
          message: "Type 'number' is not assignable to type 'string'.",
          line: 1,
          column: 7,
        },
      ],
    })

    expect(view.container).toHaveTextContent("const broken: string = 42")
    await waitFor(() => {
      expect(
        view.container.querySelector(".cm-lintRange-error")
      ).toBeInTheDocument()
    })
  })

  it("completes authored inputs with their declared types", async () => {
    const view = render(FunctionCodeEditor, {
      value: "inputs.",
      inputSchema: [
        {
          name: "customerId",
          type: "string",
        },
      ],
    })
    const editor = EditorView.findFromDOM(
      view.container.querySelector<HTMLElement>(".cm-editor")!
    )!
    editor.dispatch({ selection: { anchor: editor.state.doc.length } })
    startCompletion(editor)
    await waitFor(() =>
      expect(screen.getByRole("option")).toHaveTextContent("customerId")
    )
    expect(screen.getByRole("option")).toHaveTextContent("string")
  })

  it("updates the editor theme when the builder theme changes", async () => {
    themeStore.set({ theme: Theme.LIGHT })
    const view = render(FunctionCodeEditor)
    const editor = EditorView.findFromDOM(
      view.container.querySelector<HTMLElement>(".cm-editor")!
    )!

    expect(editor.state.facet(EditorView.darkTheme)).toBe(false)

    themeStore.set({ theme: Theme.DARK })
    await waitFor(() =>
      expect(editor.state.facet(EditorView.darkTheme)).toBe(true)
    )

    themeStore.set({ theme: Theme.LIGHT })
    await waitFor(() =>
      expect(editor.state.facet(EditorView.darkTheme)).toBe(false)
    )
  })
})
