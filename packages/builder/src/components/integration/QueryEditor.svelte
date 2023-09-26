<script>
  import CodeMirror from "./codemirror"
  import { Label } from "@budibase/bbui"
  import { onMount, createEventDispatcher } from "svelte"
  import { themeStore } from "builderStore"

  const dispatch = createEventDispatcher()

  const THEMES = {
    DARK: "tomorrow-night-eighties",
    LIGHT: "default",
  }

  export let label
  export let value = ""
  export let readOnly = false
  export let lineNumbers = true
  export let tab = true
  export let mode
  export let editorHeight = 500
  export let editorWidth = 640
  // export let parameters = []

  let width
  let height

  // We have to expose set and update methods, rather
  // than making this state-driven through props,
  // because it's difficult to update an editor
  // without resetting scroll otherwise
  export async function set(new_value, new_mode) {
    if (new_mode !== mode) {
      await createEditor((mode = new_mode))
    }

    value = new_value
    updating_externally = true
    if (editor) editor.setValue(value)
    updating_externally = false
  }

  export function update(new_value) {
    value = new_value

    if (editor) {
      const { left, top } = editor.getScrollInfo()
      editor.setValue((value = new_value))
      editor.scrollTo(left, top)
    }
  }

  export function resize() {
    editor.refresh()
  }

  export function focus() {
    editor.focus()
  }

  const modes = {
    js: {
      name: "javascript",
      json: false,
    },
    json: {
      name: "javascript",
      json: true,
    },
    sql: {
      name: "sql",
    },
    svelte: {
      name: "handlebars",
      base: "text/html",
    },
  }

  const refs = {}
  let editor
  let updating_externally = false
  let destroyed = false

  $: if (editor && width && height) {
    editor.refresh()
  }

  onMount(() => {
    createEditor(mode).then(() => {
      if (editor) editor.setValue(value || "")
    })

    return () => {
      destroyed = true
      if (editor) editor.toTextArea()
    }
  })

  let first = true

  async function createEditor(mode) {
    if (destroyed || !CodeMirror) return

    if (editor) editor.toTextArea()

    const opts = {
      lineNumbers,
      lineWrapping: true,
      indentWithTabs: true,
      indentUnit: 2,
      tabSize: 2,
      value: "",
      mode: modes[mode] || {
        name: mode,
      },

      readOnly,
      autoCloseBrackets: true,
      autoCloseTags: true,
      theme: $themeStore.theme.includes("light") ? THEMES.LIGHT : THEMES.DARK,
    }

    if (!tab)
      opts.extraKeys = {
        Tab: tab,
        "Shift-Tab": tab,
      }

    // Creating a text editor is a lot of work, so we yield
    // the main thread for a moment. This helps reduce jank
    if (first) await sleep(50)

    if (destroyed) return

    CodeMirror.commands.autocomplete = function (cm) {
      CodeMirror.showHint(cm, CodeMirror.hint.javascript)
    }

    editor = CodeMirror.fromTextArea(refs.editor, opts)

    editor.on("change", instance => {
      if (!updating_externally) {
        const value = instance.getValue()
        dispatch("change", { value })
      }
    })

    // editor.on("cursorActivity", function() {
    //   editor.showHint({
    //     hint: function() {
    //       return {
    //         from: editor.getDoc().getCursor(),
    //         to: editor.getDoc().getCursor(),
    //         list: completions,
    //       }
    //     },
    //   })
    // })

    if (first) await sleep(50)
    editor.refresh()

    first = false
  }

  function sleep(ms) {
    return new Promise(fulfil => setTimeout(fulfil, ms))
  }
</script>

{#if label}
  <Label small>{label}</Label>
{/if}
<div
  style={`--code-mirror-height: ${editorHeight}px; --code-mirror-width: ${editorWidth}px;`}
>
  <textarea tabindex="0" bind:this={refs.editor} readonly {value} />
</div>

<style>
  textarea {
    visibility: hidden;
  }

  div {
    margin-top: var(--spacing-s);
  }

  div :global(.CodeMirror) {
    height: var(--code-mirror-height) !important;
    border-radius: var(--border-radius-s);
    font-family: var(--font-mono);
    line-height: 1.3;
  }
</style>
