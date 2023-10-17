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
  import { EditorModes, getDefaultTheme } from "./"
  import { themeStore } from "builderStore"

  export let label
  export let completions = []
  export let height = 200
  export let resize = "none"
  export let mode = EditorModes.Handlebars
  export let value = ""
  export let placeholder = null
  export let autocompleteEnabled = true

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
      if (completionStatus(view.state) == "active") {
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
    const baseMap = [
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
      indentWithTabCustom,
    ]
    return baseMap
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
      EditorView.lineWrapping,
      EditorView.updateListener.of(v => {
        const docStr = v.state.doc?.toString()
        if (docStr === value) {
          return
        }
        dispatch("change", docStr)
      }),
      keymap.of(buildKeymap()),
      themeConfig.of([
        getDefaultTheme({
          height: editorHeight,
          resize,
          dark: isDark,
        }),
        ...(isDark ? [oneDark] : []),
      ]),
    ]
  }

  const buildExtensions = base => {
    const complete = [...base]

    if (autocompleteEnabled) {
      complete.push(
        autocompletion({
          override: [...completions],
          closeOnBlur: true,
          icons: false,
          optionClass: () => "autocomplete-option",
        })
      )
      complete.push(
        EditorView.inputHandler.of((view, from, to, insert) => {
          if (insert === "$") {
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

    if (mode.name == "javascript") {
      complete.push(javascript())
      complete.push(highlightWhitespace())
      complete.push(lineNumbers())
      complete.push(foldGutter())
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
        effects: themeConfig.reconfigure([
          getDefaultTheme({
            height: editorHeight,
            resize,
            dark: isDark,
          }),
          ...(isDark ? [oneDark] : []),
        ]),
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
  .code-editor.handlebars :global(.cm-content) {
    font-family: var(--font-sans);
  }
  .code-editor :global(.cm-tooltip.cm-completionInfo) {
    padding: var(--spacing-m);
  }
  .code-editor :global(.cm-tooltip-autocomplete > ul > li[aria-selected]) {
    border-radius: var(
        --spectrum-popover-border-radius,
        var(--spectrum-alias-border-radius-regular)
      ),
      var(
        --spectrum-popover-border-radius,
        var(--spectrum-alias-border-radius-regular)
      ),
      0, 0;
  }

  .code-editor :global(.autocomplete-option .cm-completionDetail) {
    background-color: var(--spectrum-global-color-gray-200);
    border-radius: var(--border-radius-s);
    padding: 4px 6px;
  }
</style>
