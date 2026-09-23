<script lang="ts">
  import { themeStore } from "@/stores/portal"
  import type {
    FunctionBuildDiagnostic,
    FunctionQueryCapability,
  } from "@budibase/types"
  import {
    autocompletion,
    closeBrackets,
    closeBracketsKeymap,
    completionKeymap,
    type CompletionContext,
  } from "@codemirror/autocomplete"
  import {
    defaultKeymap,
    history,
    historyKeymap,
    indentWithTab,
  } from "@codemirror/commands"
  import { javascript } from "@codemirror/lang-javascript"
  import { bracketMatching, syntaxHighlighting } from "@codemirror/language"
  import { setDiagnostics, type Diagnostic } from "@codemirror/lint"
  import { EditorState } from "@codemirror/state"
  import { oneDark, oneDarkHighlightStyle } from "@codemirror/theme-one-dark"
  import {
    drawSelection,
    EditorView,
    highlightActiveLine,
    highlightActiveLineGutter,
    keymap,
    lineNumbers,
  } from "@codemirror/view"
  import { onDestroy, onMount } from "svelte"
  import {
    getFunctionDatasourceCompletions,
    getFunctionQueryCompletions,
  } from "./functionCompletions"

  export let value = ""
  export let capabilities: FunctionQueryCapability[] = []
  export let diagnostics: FunctionBuildDiagnostic[] = []
  export let readonly = false

  const virtualModuleExports = [
    { label: "inputs", type: "variable", detail: "Function inputs" },
    { label: "queries", type: "variable", detail: "Linked queries" },
    { label: "FunctionResult", type: "type" },
    { label: "JsonValue", type: "type" },
  ]

  let container: HTMLDivElement
  let editor: EditorView | undefined

  const complete = (context: CompletionContext) => {
    const before = context.state.doc.sliceString(0, context.pos)

    // Complete the only module that Function source is allowed to import.
    const [fromMatch, typedModuleName] =
      before.match(/from\s+["']([^"']*)$/) || []
    if (fromMatch) {
      return {
        from: context.pos - typedModuleName.length,
        options: [
          {
            label: "@budibase/functions",
            type: "module",
          },
        ],
      }
    }

    // Complete exports while typing inside a named import.
    if (/import\s+(?:type\s+)?{[^}]*$/.test(before)) {
      const typedExport = context.matchBefore(/[\w$]*/)
      return {
        from: typedExport?.from ?? context.pos,
        options: virtualModuleExports,
      }
    }

    // Complete a query beneath an explicitly linked datasource.
    const queryMatch = context.matchBefore(/queries\.[A-Za-z_$][\w$]*\.[\w$]*$/)
    if (queryMatch) {
      const [, datasourceAlias, typedQueryName] = queryMatch.text.split(".")
      return {
        from: context.pos - typedQueryName.length,
        options: getFunctionQueryCompletions(capabilities, datasourceAlias).map(
          item => ({
            label: item.label,
            type: "function",
            detail: item.parameterNames.length
              ? `(${item.parameterNames.join(", ")})`
              : "()",
          })
        ),
      }
    }

    // Complete an explicitly linked datasource after `queries.`.
    const datasourceMatch = context.matchBefore(/queries\.[\w$]*$/)
    if (datasourceMatch) {
      const [, typedDatasourceAlias] = datasourceMatch.text.split(".")
      return {
        from: context.pos - typedDatasourceAlias.length,
        options: getFunctionDatasourceCompletions(capabilities).map(label => ({
          label,
          type: "property",
        })),
      }
    }

    return null
  }

  const toEditorDiagnostics = (
    values: FunctionBuildDiagnostic[]
  ): Diagnostic[] =>
    values.map(item => {
      if (!editor || !item.line) {
        return {
          from: 0,
          to: 0,
          severity: "error",
          message: item.message,
          source: item.code,
        }
      }
      const lineNumber = Math.min(item.line, editor.state.doc.lines)
      const line = editor.state.doc.line(lineNumber)
      const from = Math.min(
        line.to,
        line.from + Math.max(0, (item.column || 1) - 1)
      )
      return {
        from,
        to: Math.min(line.to, from + 1),
        severity: "error",
        message: item.message,
        source: item.code,
      }
    })

  const refreshDiagnostics = (
    values: FunctionBuildDiagnostic[],
    view?: EditorView
  ) => {
    if (view) {
      view.dispatch(setDiagnostics(view.state, toEditorDiagnostics(values)))
    }
  }

  $: refreshDiagnostics(diagnostics, editor)

  $: if (editor && editor.state.doc.toString() !== value) {
    editor.dispatch({
      changes: { from: 0, to: editor.state.doc.length, insert: value },
    })
  }

  onMount(() => {
    const isDark = !$themeStore?.theme?.includes("light")
    editor = new EditorView({
      parent: container,
      doc: value,
      extensions: [
        lineNumbers(),
        history(),
        drawSelection(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        bracketMatching(),
        closeBrackets(),
        javascript({ typescript: true }),
        syntaxHighlighting(oneDarkHighlightStyle, { fallback: true }),
        ...(isDark ? [oneDark] : []),
        autocompletion({ override: [complete] }),
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...historyKeymap,
          ...completionKeymap,
          indentWithTab,
        ]),
        EditorState.readOnly.of(readonly),
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            value = update.state.doc.toString()
          }
        }),
      ],
    })
    refreshDiagnostics(diagnostics, editor)
  })

  onDestroy(() => editor?.destroy())
</script>

<div class="function-code-editor" bind:this={container}></div>

<style>
  .function-code-editor {
    min-height: 420px;
    height: 100%;
    overflow: hidden;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--radius-l);
    background: var(--spectrum-global-color-gray-50);
    font-size: 13px;
  }
  .function-code-editor :global(.cm-editor) {
    height: 100%;
    min-height: 420px;
  }
  .function-code-editor :global(.cm-scroller) {
    overflow: auto;
    font-family: var(--font-family-code);
  }
  .function-code-editor :global(.cm-focused) {
    outline: 2px solid var(--spectrum-global-color-blue-500);
    outline-offset: -2px;
  }
</style>
