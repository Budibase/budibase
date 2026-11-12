import { themeStore } from "@/stores/portal"
import { Theme } from "@budibase/types"
import {
  acceptCompletion,
  completionStatus,
  startCompletion,
} from "@codemirror/autocomplete"
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
    { prefix: "inp", reference: "inputs", detail: "Function inputs" },
    { prefix: "que", reference: "queries", detail: "Linked queries" },
    { prefix: "cust", reference: "inputs.customerId", detail: "string" },
    {
      prefix: "find",
      reference: "queries.crm.findCustomer",
      detail: "customerId",
    },
    { prefix: "cr", reference: "queries.crm", detail: "queries.crm" },
  ])(
    "inserts $reference when typing $prefix",
    async ({ prefix, reference, detail }) => {
      const view = render(FunctionCodeEditor, {
        value: `const result = ${prefix}`,
        inputSchema: [{ name: "customerId", type: "string" }],
        capabilities: [
          {
            capabilityId: "cap_customer",
            queryId: "query_customer",
            datasourceAlias: "crm",
            queryAlias: "findCustomer",
            parameterNames: ["customerId"],
          },
        ],
      })
      const editor = EditorView.findFromDOM(
        view.container.querySelector<HTMLElement>(".cm-editor")!
      )!
      editor.dispatch({ selection: { anchor: editor.state.doc.length } })
      startCompletion(editor)
      await waitFor(() =>
        expect(
          screen.getByRole("option", {
            name: name => name.replace(/\s/g, "").startsWith(reference),
          })
        ).toBeInTheDocument()
      )
      expect(
        screen.getByRole("option", {
          name: name => name.replace(/\s/g, "").startsWith(reference),
        })
      ).toHaveTextContent(detail)
      await waitFor(() => expect(acceptCompletion(editor)).toBe(true))
      expect(editor.state.doc.toString()).toBe(`const result = ${reference}`)
    }
  )

  it.each([
    { prefix: "inp", namespace: "inputs" },
    { prefix: "que", namespace: "queries" },
  ])(
    "suggests $namespace without configured fields or queries",
    async ({ prefix, namespace }) => {
      const view = render(FunctionCodeEditor)
      const editor = EditorView.findFromDOM(
        view.container.querySelector<HTMLElement>(".cm-editor")!
      )!
      editor.focus()
      editor.dispatch({
        changes: { from: 0, insert: prefix },
        selection: { anchor: prefix.length },
        userEvent: "input.type",
      })
      await waitFor(() =>
        expect(screen.getByRole("option")).toHaveTextContent(namespace)
      )
      await waitFor(() => expect(acceptCompletion(editor)).toBe(true))
      expect(editor.state.doc.toString()).toBe(namespace)
    }
  )

  it("distinguishes query names shared by linked datasources", async () => {
    const view = render(FunctionCodeEditor, {
      value: "find",
      capabilities: ["crm", "billing"].map(datasourceAlias => ({
        capabilityId: `cap_${datasourceAlias}`,
        queryId: `query_${datasourceAlias}`,
        datasourceAlias,
        queryAlias: "findCustomer",
        parameterNames: [],
      })),
    })
    const editor = EditorView.findFromDOM(
      view.container.querySelector<HTMLElement>(".cm-editor")!
    )!
    editor.dispatch({ selection: { anchor: editor.state.doc.length } })
    startCompletion(editor)
    await waitFor(() => expect(screen.getAllByRole("option")).toHaveLength(2))
    expect(screen.getByRole("listbox")).toHaveTextContent(
      "queries.crm.findCustomer"
    )
    expect(screen.getByRole("listbox")).toHaveTextContent(
      "queries.billing.findCustomer"
    )
  })

  it.each([
    '"cust',
    '"inp',
    "// find",
    "// que",
    "user.cust",
    "user.inp",
    "user?.find",
    "user?.que",
    "const cust",
  ])("does not suggest qualified references in %s", async value => {
    const view = render(FunctionCodeEditor, {
      value,
      inputSchema: [{ name: "customerId", type: "string" }],
      capabilities: [
        {
          capabilityId: "cap_customer",
          queryId: "query_customer",
          datasourceAlias: "crm",
          queryAlias: "findCustomer",
          parameterNames: [],
        },
      ],
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
