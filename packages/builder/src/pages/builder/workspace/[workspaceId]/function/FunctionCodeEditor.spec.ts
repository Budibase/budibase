import { themeStore } from "@/stores/portal"
import { Theme, type FunctionQueryCapability } from "@budibase/types"
import {
  acceptCompletion,
  completionStatus,
  startCompletion,
} from "@codemirror/autocomplete"
import { EditorView } from "@codemirror/view"
import { render, screen, waitFor } from "@testing-library/svelte"
import { get } from "svelte/store"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import FunctionCodeEditor from "./FunctionCodeEditor.svelte"
import {
  createFunctionTypeService,
  type FunctionCompletionRequest,
  type FunctionCompletionResponse,
} from "./functionTypeService"

class CompletionWorker {
  private service = createFunctionTypeService()
  onmessage?: (_event: MessageEvent<FunctionCompletionResponse>) => void
  postMessage(request: FunctionCompletionRequest) {
    queueMicrotask(() => {
      this.onmessage?.(
        new MessageEvent("message", {
          data: { id: request.id, completions: this.service.complete(request) },
        })
      )
    })
  }
  terminate() {
    this.service.destroy()
  }
}

const capability: FunctionQueryCapability = {
  capabilityId: "cap_customers",
  queryId: "query_customers",
  datasourceAlias: "mongoDB",
  queryAlias: "readQuery",
  parameterNames: [],
  responseSchema: { fields: [{ name: "name", type: "string" }] },
}

const querySource = `import { queries } from "@budibase/functions"
async function run() {
  const res = await queries.mongoDB.readQuery()
  `

describe("FunctionCodeEditor", () => {
  const initialTheme = get(themeStore).theme

  beforeEach(() => {
    vi.stubGlobal("Worker", CompletionWorker)
    document.body.className = "spectrum"
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    themeStore.set({ theme: initialTheme })
  })

  it.each([
    { expression: "res.", label: "data" },
    { expression: "res.data[0].", label: "name" },
    { expression: "res.data.map(row => row.", label: "name" },
  ])(
    "completes inferred query results at $expression",
    async ({ expression, label }) => {
      const view = render(FunctionCodeEditor, {
        value: querySource + expression,
        capabilities: [capability],
      })
      const editor = EditorView.findFromDOM(
        view.container.querySelector<HTMLElement>(".cm-editor")!
      )!
      editor.dispatch({ selection: { anchor: editor.state.doc.length } })
      startCompletion(editor)
      await waitFor(() =>
        expect(screen.getByRole("option")).toHaveTextContent(label)
      )
    }
  )

  it("updates suggestions when an existing Function's query schema changes", async () => {
    const value = querySource + "res.data[0]."
    const view = render(FunctionCodeEditor, {
      value,
      capabilities: [capability],
    })
    const editor = EditorView.findFromDOM(
      view.container.querySelector<HTMLElement>(".cm-editor")!
    )!
    await view.rerender({
      value,
      capabilities: [
        {
          ...capability,
          responseSchema: { fields: [{ name: "total", type: "number" }] },
        },
      ],
    })
    editor.dispatch({ selection: { anchor: editor.state.doc.length } })
    startCompletion(editor)
    await waitFor(() =>
      expect(screen.getByRole("option")).toHaveTextContent("total")
    )
    expect(screen.getByRole("option")).toHaveTextContent("number")
    expect(
      screen.queryByText("name", { selector: ".cm-completionLabel" })
    ).not.toBeInTheDocument()
  })

  it("automatically completes a row field while typing", async () => {
    const createRange = document.createRange.bind(document)
    vi.spyOn(document, "createRange").mockImplementation(() =>
      Object.assign(createRange(), {
        getClientRects: () => [],
        getBoundingClientRect: () => ({ left: 0, right: 0, top: 0, bottom: 0 }),
      })
    )
    const value = querySource + "res.data[0]"
    const view = render(FunctionCodeEditor, {
      value,
      capabilities: [capability],
    })
    const editor = EditorView.findFromDOM(
      view.container.querySelector<HTMLElement>(".cm-editor")!
    )!
    editor.dispatch({ selection: { anchor: editor.state.doc.length } })
    editor.dispatch({
      changes: { from: editor.state.doc.length, insert: "." },
      selection: { anchor: editor.state.doc.length + 1 },
      userEvent: "input.type",
    })
    await waitFor(() => screen.getByRole("option"))
    editor.dispatch({
      changes: { from: editor.state.doc.length, insert: "na" },
      selection: { anchor: editor.state.doc.length + 2 },
      userEvent: "input.type",
    })
    await waitFor(() => {
      acceptCompletion(editor)
      expect(editor.state.doc.toString()).toBe(value + ".name")
    })
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
