<script>
  import { Label } from "@budibase/bbui"
  import { onMount, createEventDispatcher } from "svelte"
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
    EditorView,
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
  import { Compartment } from "@codemirror/state"
  import { javascript } from "@codemirror/lang-javascript"
  import { EditorModes } from "./"
  import { themeStore } from "stores/portal"

  export let label
  export let completions = []
  export let height = 200
  export let resize = "none"
  export let mode = EditorModes.Handlebars
  export let value = ""
  export let placeholder = null
  export let autocompleteEnabled = true
  export let autofocus = false
  export let jsBindingWrapping = true

  // Export a function to expose caret position
  export const getCaretPosition = () => {
    const selection_range = editor.state.selection.ranges[0]
    return {
      start: selection_range.from,
      end: selection_range.to,
    }
  }

  export const insertAtPos = opts => {
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

  // For handlebars only.
  const bindStyle = new MatchDecorator({
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

  let plugin = ViewPlugin.define(
    view => ({
      decorations: bindStyle.createDeco(view),
      update(u) {
        this.decorations = bindStyle.updateDeco(u, this.decorations)
      },
    }),
    {
      decorations: v => v.decorations,
    }
  )

  const dispatch = createEventDispatcher()

  // Theming!
  let currentTheme = $themeStore?.theme
  let isDark = !currentTheme.includes("light")
  let themeConfig = new Compartment()

  const indentWithTabCustom = {
    key: "Tab",
    run: view => {
      if (completionStatus(view.state) === "active") {
        acceptCompletion(view)
        return true
      }
      indentMore(view)
      return true
    },
    shift: view => {
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
      ...(mode.name === "handlebars" ? [plugin] : []),
      history(),
      drawSelection(),
      dropCursor(),
      bracketMatching(),
      closeBrackets(),
      highlightActiveLine(),
      syntaxHighlighting(oneDarkHighlightStyle, { fallback: true }),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      lineNumbers(),
      foldGutter(),
      EditorView.lineWrapping,
      EditorView.updateListener.of(v => {
        const docStr = v.state.doc?.toString()
        if (docStr === value) {
          return
        }
        dispatch("change", docStr)
      }),
      keymap.of(buildKeymap()),
      themeConfig.of([...(isDark ? [oneDark] : [])]),
    ]
  }

  const buildExtensions = base => {
    const complete = [...base]

    if (autocompleteEnabled) {
      complete.push(
        autocompletion({
          override: [...completions],
          closeOnBlur: false,
          icons: false,
          optionClass: () => "autocomplete-option",
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

    if (mode.name === "javascript") {
      complete.push(javascript())
      complete.push(highlightWhitespace())
    }

    if (placeholder) {
      complete.push(placeholderFn(placeholder))
    }
    return complete
  }

  let textarea
  let editor
  let mounted = false
  let isEditorInitialised = false

  const initEditor = () => {
    const baseExtensions = buildBaseExtensions()

    editor = new EditorView({
      doc: value?.toString(),
      extensions: buildExtensions(baseExtensions),
      parent: textarea,
    })
  }

  $: {
    if (autofocus && isEditorInitialised) {
      editor.focus()
    }
  }

  $: editorHeight = typeof height === "number" ? `${height}px` : height

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

  onMount(async () => {
    mounted = true
    return () => {
      if (editor) {
        editor.destroy()
      }
    }
  })
</script>

{#if label}
  <div>
    <Label small>{label}</Label>
  </div>
{/if}

<div class={`code-editor ${mode?.name || ""}`}>
  <div tabindex="-1" bind:this={textarea} />
</div>

<style>
  /* Editor */
  .code-editor :global(.cm-editor) {
    background: var(--spectrum-global-color-gray-50) !important;
  }
  .code-editor :global(.cm-content) {
    padding: 10px 0;
  }
  .code-editor {
    font-size: 12px;
  }

  /* Active line */
  .code-editor :global(.cm-line) {
    height: 16px;
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

  /* Highlight bindings */
  .code-editor :global(.binding-wrap) {
    color: var(--spectrum-global-color-blue-700);
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
  .code-editor :global(.autocomplete-option) {
    padding: var(--spacing-s) var(--spacing-m) !important;
    padding-left: calc(16px + 2 * var(--spacing-m)) !important;
    display: flex;
    gap: var(--spacing-m);
    align-items: center;
    color: var(--spectrum-alias-text-color);
  }

  /* Highlighted completion item */
  .code-editor :global(.autocomplete-option[aria-selected]) {
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

  /* Live binding value / helper value */
  .code-editor :global(.binding__description) {
    color: var(--spectrum-global-color-gray-700);
    font-size: var(--font-size-s);
  }
  .code-editor :global(.binding__example) {
    padding: 0;
    margin: 0;
    font-size: var(--font-size-s);
    font-family: var(--font-mono);
    white-space: pre;
    text-overflow: ellipsis;
    overflow: hidden;
    max-height: 480px;
  }
  .code-editor :global(.binding__example span) {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }

  /* Wrapper around helpers */
  .code-editor :global(.info-bubble) {
    font-size: var(--font-size-s);
    display: grid;
    grid-gap: var(--spacing-s);
    grid-template-columns: 1fr;
    color: var(--spectrum-global-color-gray-800);
  }
</style>
