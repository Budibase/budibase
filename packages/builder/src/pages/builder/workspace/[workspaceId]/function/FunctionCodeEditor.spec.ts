import { themeStore } from "@/stores/portal"
import { Theme } from "@budibase/types"
import { completionStatus, startCompletion } from "@codemirror/autocomplete"
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

  it.each(["inputs.", "const value = inputs.", "fn(inputs."])(
    "completes authored inputs with their declared types in %s",
    async value => {
      const view = render(FunctionCodeEditor, {
        value,
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
    }
  )

  it.each([
    "user.inputs.",
    "user . inputs.",
    "user?.inputs.",
    "myinputs.",
    '"inputs.',
    "// inputs.",
  ])("does not offer Function inputs for %s", async value => {
    const view = render(FunctionCodeEditor, {
      value,
      inputSchema: [{ name: "customerId", type: "string" }],
    })
    const editor = EditorView.findFromDOM(
      view.container.querySelector<HTMLElement>(".cm-editor")!
    )!
    editor.dispatch({ selection: { anchor: editor.state.doc.length } })
    startCompletion(editor)

    await waitFor(() =>
      expect(completionStatus(editor.state)).not.toBe("pending")
    )
    expect(screen.queryByRole("option")).not.toBeInTheDocument()
  })

  it("keeps light syntax colors readable against the white editor background", () => {
    themeStore.set({ theme: Theme.LIGHT })
    const view = render(FunctionCodeEditor, {
      value:
        'const value: string = "hello"; // comment\nconst result = fn(42, true)',
    })
    const spans = view.container.querySelectorAll(".cm-line span")

    expect(spans.length).toBeGreaterThan(0)
    for (const span of spans) {
      const channels = getComputedStyle(span).color.match(/\d+/g)!.map(Number)
      const luminance = channels
        .map(channel => {
          const value = channel / 255
          return value <= 0.04045
            ? value / 12.92
            : ((value + 0.055) / 1.055) ** 2.4
        })
        .reduce(
          (sum, channel, index) =>
            sum + channel * [0.2126, 0.7152, 0.0722][index],
          0
        )
      expect(1.05 / (luminance + 0.05)).toBeGreaterThanOrEqual(4.5)
    }
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
