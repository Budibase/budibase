<script lang="ts">
  import { Label } from "@budibase/bbui"
  import { onMount, createEventDispatcher, onDestroy } from "svelte"
  import { FIND_ANY_HBS_REGEX } from "@budibase/string-templates"

  import {
    autocompletion,
    closeBrackets,
    completionKeymap,
    closeBracketsKeymap,
    acceptCompletion,
    completionStatus,
  } from "@codemirror/autocomplete"
  import {
    lineNumbers,
    keymap,
    highlightSpecialChars,
    drawSelection,
    dropCursor,
    highlightActiveLine,
    highlightActiveLineGutter,
    highlightWhitespace,
    placeholder as placeholderFn,
    MatchDecorator,
    ViewPlugin,
    Decoration,
    EditorView,
  } from "@codemirror/view"
  import {
    bracketMatching,
    foldKeymap,
    foldGutter,
    syntaxHighlighting,
  } from "@codemirror/language"
  import { oneDark, oneDarkHighlightStyle } from "@codemirror/theme-one-dark"
  import {
    defaultKeymap,
    historyKeymap,
    history,
    indentMore,
    indentLess,
  } from "@codemirror/commands"
  import { Compartment, EditorState } from "@codemirror/state"
  import { javascript } from "@codemirror/lang-javascript"
  import { EditorModes } from "./"
  import { themeStore } from "@/stores/portal"
  import type { EditorMode } from "@budibase/types"

  export let label: string | undefined = undefined
  // TODO: work out what best type fits this
  export let completions: any[] = []
  export let mode: EditorMode = EditorModes.Handlebars
  export let value: string | null = ""
  export let placeholder: string | null = null
  export let autocompleteEnabled = true
  export let autofocus = false
  export let jsBindingWrapping = true
  export let readonly = false
  export let readonlyLineNumbers = false

  const dispatch = createEventDispatcher()

  let textarea: HTMLDivElement
  let editor: EditorView
  let mounted = false
  let isEditorInitialised = false
  let queuedRefresh = false

  // Theming!
  let currentTheme = $themeStore?.theme
  let isDark = !currentTheme.includes("light")
  let themeConfig = new Compartment()

  $: {
    if (autofocus && isEditorInitialised) {
      editor.focus()
    }
  }

  // Init when all elements are ready
  $: if (mounted && !isEditorInitialised) {
    isEditorInitialised = true
    initEditor()
  }

  // Theme change
  $: if (mounted && isEditorInitialised && $themeStore?.theme) {
    if (currentTheme != $themeStore?.theme) {
      currentTheme = $themeStore?.theme
      isDark = !currentTheme.includes("light")

      // Issue theme compartment update
      editor.dispatch({
        effects: themeConfig.reconfigure([...(isDark ? [oneDark] : [])]),
      })
    }
  }

  // Wait to try and gracefully replace
  $: refresh(value, isEditorInitialised, mounted)

  /**
   * Will refresh the editor contents only after
   * it has been fully initialised
   */
  const refresh = (
    value: string | null,
    initialised?: boolean,
    mounted?: boolean
  ) => {
    if (!initialised || !mounted) {
      queuedRefresh = true
      return
    }

    if (
      editor &&
      value &&
      (editor.state.doc.toString() !== value || queuedRefresh)
    ) {
      editor.dispatch({
        changes: { from: 0, to: editor.state.doc.length, insert: value },
      })
      queuedRefresh = false
    }
  }

  // Export a function to expose caret position
  export const getCaretPosition = () => {
    const selection_range = editor.state.selection.ranges[0]
    return {
      start: selection_range?.from,
      end: selection_range?.to,
    }
  }

  export const insertAtPos = (opts: {
    start: number
    end?: number
    value: string
    cursor: { anchor: number }
  }) => {
    // Updating the value inside.
    // Retain focus
    editor.dispatch({
      changes: {
        from: opts.start || editor.state.doc.length,
        to: opts.end || editor.state.doc.length,
        insert: opts.value,
      },
      selection: opts.cursor
        ? {
            anchor: opts.start + opts.value.length,
          }
        : undefined,
    })
  }

  // Match decoration for HBS bindings
  const hbsMatchDeco = new MatchDecorator({
    regexp: FIND_ANY_HBS_REGEX,
    decoration: () => {
      return Decoration.mark({
        tag: "span",
        attributes: {
          class: "binding-wrap",
        },
      })
    },
  })
  const hbsMatchDecoPlugin = ViewPlugin.define(
    view => ({
      decorations: hbsMatchDeco.createDeco(view),
      update(u) {
        this.decorations = hbsMatchDeco.updateDeco(u, this.decorations)
      },
    }),
    {
      decorations: v => v.decorations,
    }
  )

  // Match decoration for snippets
  const snippetMatchDeco = new MatchDecorator({
    regexp: /snippets\.[^\s(]+/g,
    decoration: () => {
      return Decoration.mark({
        tag: "span",
        attributes: {
          class: "snippet-wrap",
        },
      })
    },
  })
  const snippetMatchDecoPlugin = ViewPlugin.define(
    view => ({
      decorations: snippetMatchDeco.createDeco(view),
      update(u) {
        this.decorations = snippetMatchDeco.updateDeco(u, this.decorations)
      },
    }),
    {
      decorations: v => v.decorations,
    }
  )

  const indentWithTabCustom = {
    key: "Tab",
    run: (view: EditorView) => {
      if (completionStatus(view.state) === "active") {
        acceptCompletion(view)
        return true
      }
      indentMore(view)
      return true
    },
    shift: (view: EditorView) => {
      indentLess(view)
      return true
    },
  }

  const buildKeymap = () => {
    return [
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
      indentWithTabCustom,
    ]
  }

  const buildBaseExtensions = () => {
    return [
      drawSelection(),
      dropCursor(),
      bracketMatching(),
      closeBrackets(),
      syntaxHighlighting(oneDarkHighlightStyle, { fallback: true }),
      highlightSpecialChars(),
      EditorView.lineWrapping,
      themeConfig.of([...(isDark ? [oneDark] : [])]),
    ]
  }

  // None of this is reactive, but it never has been, so we just assume most
  // config flags aren't changed at runtime
  // TODO: work out type for base
  const buildExtensions = (base: any[]) => {
    let complete = [...base]

    if (autocompleteEnabled) {
      complete.push(
        autocompletion({
          override: [...completions],
          closeOnBlur: true,
          icons: false,
          optionClass: completion =>
            "simple" in completion && completion.simple
              ? "autocomplete-option-simple"
              : "autocomplete-option",
        })
      )
      complete.push(
        EditorView.inputHandler.of((view, from, to, insert) => {
          if (jsBindingWrapping && insert === "$") {
            let { text } = view.state.doc.lineAt(from)

            const left = from ? text.substring(0, from) : ""
            const right = to ? text.substring(to) : ""
            const wrap = !left.includes('$("') || !right.includes('")')
            const tr = view.state.update(
              {
                changes: [{ from, insert: wrap ? '$("")' : "$" }],
                selection: {
                  anchor: from + (wrap ? 3 : 1),
                },
              },
              {
                scrollIntoView: true,
                userEvent: "input.type",
              }
            )
            view.dispatch(tr)
            return true
          }
          return false
        })
      )
    }

    // JS only plugins
    if (mode.name === "javascript") {
      complete.push(snippetMatchDecoPlugin)
      complete.push(javascript())
      if (!readonly) {
        complete.push(highlightWhitespace())
      }
    }
    // HBS only plugins
    else {
      complete.push(hbsMatchDecoPlugin)
    }

    if (placeholder) {
      complete.push(placeholderFn(placeholder))
    }

    if (readonly) {
      complete.push(EditorState.readOnly.of(true))
      if (readonlyLineNumbers) {
        complete.push(lineNumbers())
      }
    } else {
      complete = [
        ...complete,
        history(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        lineNumbers(),
        foldGutter(),
        keymap.of(buildKeymap()),
        EditorView.domEventHandlers({
          blur: () => {
            dispatch("blur", editor.state.doc.toString())
          },
        }),
        EditorView.updateListener.of(v => {
          const docStr = v.state.doc?.toString()
          if (docStr === value) {
            return
          }
          dispatch("change", docStr)
        }),
      ]
    }

    return complete
  }

  const initEditor = () => {
    const baseExtensions = buildBaseExtensions()

    editor = new EditorView({
      doc: value?.toString(),
      extensions: buildExtensions(baseExtensions),
      parent: textarea,
    })
  }

  onMount(async () => {
    mounted = true
  })

  onDestroy(() => {
    if (editor) {
      editor.destroy()
    }
  })
</script>

{#if label}
  <div>
    <Label size="S">{label}</Label>
  </div>
{/if}

<div class={`code-editor ${mode?.name || ""}`}>
  <div tabindex="-1" bind:this={textarea} />
</div>

<style>
  /* Editor */
  .code-editor {
    font-size: 12px;
    height: 100%;
  }
  .code-editor :global(.cm-editor) {
    height: 100%;
    background: var(--spectrum-global-color-gray-50) !important;
    outline: none;
    border: none;
    border-radius: 0;
  }
  .code-editor :global(.cm-content) {
    padding: 10px 0;
  }
  .code-editor > div {
    height: 100%;
  }

  /* Active line */
  .code-editor :global(.cm-line) {
    padding: 0 var(--spacing-s);
    color: var(--spectrum-alias-text-color);
  }
  .code-editor :global(.cm-activeLine) {
    position: relative;
    background: transparent;
  }
  .code-editor :global(.cm-activeLine::before) {
    content: "";
    position: absolute;
    left: 0;
    top: 1px;
    height: calc(100% - 2px);
    width: 100%;
    background: var(--spectrum-global-color-gray-100) !important;
    z-index: -2;
  }
  .code-editor :global(.cm-highlightSpace:before) {
    color: var(--spectrum-global-color-gray-500);
  }

  /* Code selection */
  .code-editor :global(.cm-selectionBackground) {
    background-color: var(--spectrum-global-color-blue-400) !important;
    opacity: 0.4;
  }

  /* Gutters */
  .code-editor :global(.cm-gutterElement) {
    margin-bottom: 0;
  }
  .code-editor :global(.cm-gutters) {
    background-color: var(--spectrum-global-color-gray-75) !important;
    color: var(--spectrum-global-color-gray-500);
  }
  .code-editor :global(.cm-activeLineGutter::before) {
    content: "";
    position: absolute;
    left: 0;
    top: 1px;
    height: calc(100% - 2px);
    width: 100%;
    background: var(--spectrum-global-color-gray-200) !important;
    z-index: -2;
  }
  .code-editor :global(.cm-activeLineGutter) {
    color: var(--spectrum-global-color-gray-700);
    background: transparent;
    position: relative;
  }

  /* Cursor color */
  .code-editor :global(.cm-focused .cm-cursor) {
    border-left-color: var(--spectrum-alias-text-color);
  }

  /* Placeholder */
  .code-editor :global(.cm-placeholder) {
    color: var(--spectrum-global-color-gray-700);
    font-style: italic;
  }

  /* Highlight bindings and snippets */
  .code-editor :global(.binding-wrap) {
    color: var(--spectrum-global-color-blue-700) !important;
  }
  .code-editor :global(.snippet-wrap *) {
    color: #61afef !important;
  }

  /* Completion popover */
  .code-editor :global(.cm-tooltip-autocomplete) {
    background: var(--spectrum-global-color-gray-75);
    border-radius: 4px;
    border: 1px solid var(--spectrum-global-color-gray-200);
  }
  .code-editor :global(.cm-tooltip-autocomplete > ul) {
    max-height: 20em;
  }

  /* Completion section header*/
  .code-editor :global(.info-section) {
    display: flex;
    align-items: center;
    padding: var(--spacing-m);
    font-family: var(--font-sans);
    font-size: var(--font-size-s);
    gap: var(--spacing-m);
    color: var(--spectrum-alias-text-color);
    font-weight: 600;
  }
  .code-editor :global(.info-section:not(:first-of-type)) {
    border-top: 1px solid var(--spectrum-global-color-gray-200);
  }

  /* Completion item container */
  .code-editor :global(.autocomplete-option),
  .code-editor :global(.autocomplete-option-simple) {
    padding: var(--spacing-s) var(--spacing-m) !important;
    padding-left: calc(16px + 2 * var(--spacing-m)) !important;
    display: flex;
    gap: var(--spacing-m);
    align-items: center;
    color: var(--spectrum-alias-text-color);
  }
  .code-editor :global(.autocomplete-option-simple) {
    padding-left: var(--spacing-s) !important;
  }

  /* Highlighted completion item */
  .code-editor :global(.autocomplete-option[aria-selected]),
  .code-editor :global(.autocomplete-option-simple[aria-selected]) {
    background: var(--spectrum-global-color-blue-400);
    color: white;
  }
  .code-editor
    :global(.autocomplete-option[aria-selected] .cm-completionDetail) {
    color: white;
  }

  /* Completion item label */
  .code-editor :global(.cm-completionLabel) {
    flex: 1 1 auto;
    font-size: var(--font-size-s);
    font-family: var(--font-sans);
    text-transform: capitalize;
  }
  .code-editor :global(.autocomplete-option-simple .cm-completionLabel) {
    text-transform: none;
  }

  /* Completion item type */
  .code-editor :global(.autocomplete-option .cm-completionDetail) {
    font-family: var(--font-mono);
    color: var(--spectrum-global-color-gray-700);
    font-style: normal;
    text-transform: capitalize;
    font-size: 10px;
  }

  /* Live binding value / helper container */
  .code-editor :global(.cm-completionInfo) {
    margin-left: var(--spacing-s);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-s);
    background-color: var(--spectrum-global-color-gray-50);
    padding: var(--spacing-m);
    margin-top: -2px;
  }

  /* Wrapper around helpers */
  .code-editor :global(.info-bubble) {
    font-size: var(--font-size-s);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    color: var(--spectrum-global-color-gray-800);
  }

  /* Live binding value / helper value */
  .code-editor :global(.binding__description) {
    color: var(--spectrum-alias-text-color);
    font-size: var(--font-size-m);
  }
  .code-editor :global(.binding__example) {
    padding: 0;
    margin: 0;
    font-size: 12px;
    font-family: var(--font-mono);
    white-space: pre;
    text-overflow: ellipsis;
    overflow: hidden;
    max-height: 480px;
  }
  .code-editor :global(.binding__example.helper) {
    color: var(--spectrum-global-color-blue-700);
  }
  .code-editor :global(.binding__example span) {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }
</style>
