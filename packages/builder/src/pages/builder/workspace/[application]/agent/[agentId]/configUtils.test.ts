import { EditorState } from "@codemirror/state"
import { EditorView } from "@codemirror/view"
import type { EnrichedBinding } from "@budibase/types"
import { describe, expect, it, vi } from "vitest"

import { buildAgentPromptCompletionOptions } from "./configUtils"

const tableBinding: EnrichedBinding = {
  runtimeBinding: "find_rows",
  readableBinding: "budibase.Find rows",
  category: "Budibase",
  display: {
    name: "Find rows",
    type: "tool",
    rank: 1,
  },
}

const webSearchBinding: EnrichedBinding = {
  runtimeBinding: "search_web_search",
  readableBinding: "search.web_search",
  category: "Knowledge sources",
  display: {
    name: "Web search",
    type: "tool",
    rank: 0,
  },
}

const createEditor = () =>
  new EditorView({
    state: EditorState.create({ doc: "{{ " }),
    parent: document.createElement("div"),
  })

describe("buildAgentPromptCompletionOptions", () => {
  it("opens web search configuration without inserting a binding", () => {
    const onConfigureWebSearch = vi.fn()
    const completions = buildAgentPromptCompletionOptions({
      promptBindings: [tableBinding],
      webSearchBinding: {
        ...webSearchBinding,
        runtimeBinding: "",
      },
      webSearchConfigured: false,
      onConfigureWebSearch,
    })
    const completion = completions.find(option => option.label === "Web search")
    const editor = createEditor()

    expect(completion).toBeDefined()
    expect(typeof completion?.apply).toBe("function")
    if (typeof completion?.apply === "function") {
      completion.apply(editor, completion, 3, 3)
    }

    expect(onConfigureWebSearch).toHaveBeenCalledOnce()
    expect(editor.state.doc.toString()).toBe("{{ ")
    editor.destroy()
  })

  it("inserts the normal web search binding when configured", () => {
    const onConfigureWebSearch = vi.fn()
    const completions = buildAgentPromptCompletionOptions({
      promptBindings: [tableBinding, webSearchBinding],
      webSearchBinding,
      webSearchConfigured: true,
      onConfigureWebSearch,
    })
    const completion = completions.find(option => option.label === "Web search")
    const editor = createEditor()

    expect(completion).toBeDefined()
    expect(typeof completion?.apply).toBe("function")
    if (typeof completion?.apply === "function") {
      completion.apply(editor, completion, 3, 3)
    }

    expect(onConfigureWebSearch).not.toHaveBeenCalled()
    expect(editor.state.doc.toString()).toContain("search.web_search")
    editor.destroy()
  })

  it("keeps other tool completions in both configuration states", () => {
    const onConfigureWebSearch = vi.fn()

    for (const webSearchConfigured of [false, true]) {
      const completions = buildAgentPromptCompletionOptions({
        promptBindings: webSearchConfigured
          ? [tableBinding, webSearchBinding]
          : [tableBinding],
        webSearchBinding,
        webSearchConfigured,
        onConfigureWebSearch,
      })

      expect(completions.some(option => option.label === "Find rows")).toBe(
        true
      )
    }
  })
})
