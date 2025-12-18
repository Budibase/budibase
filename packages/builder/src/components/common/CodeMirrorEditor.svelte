<script context="module">
  export const EditorModes = {
    JS: {
      name: "javascript",
      json: false,
    },
    JSON: {
      name: "javascript",
      json: true,
    },
    XML: {
      name: "xml",
    },
    SQL: {
      name: "sql",
    },
    Handlebars: {
      name: "handlebars",
      base: "text/html",
    },
    Text: {
      name: "text/html",
    },
  }
</script>

<script>
  import { Label } from "@budibase/bbui"
  import CodeMirror from "@/components/integration/codemirror"
  import { themeStore } from "@/stores/portal"
  import { createEventDispatcher, onMount } from "svelte"

  export let mode = EditorModes.JS
  export let value = ""
  export let height = 300
  export let resize = "none"
  export let readonly = false
  export let hints = []
  export let label

  const dispatch = createEventDispatcher()
  let textarea
  let editor

  // Keep editor up to date with value
  $: editor?.setOption("mode", mode)
  $: editor?.setValue(value || "")

  // Creates an instance of a code mirror editor
  async function createEditor(mode, value) {
    if (!CodeMirror || !textarea) {
      return
    }

    // Configure CM options
    const lightTheme = $themeStore.theme.includes("light")
    const options = {
      mode,
      value: value || "",
      readOnly: readonly,
      theme: lightTheme ? "default" : "tomorrow-night-eighties",

      // Style
      lineNumbers: true,
      lineWrapping: true,
      indentWithTabs: true,
      indentUnit: 2,
      tabSize: 2,

      // QOL addons
      extraKeys: { "Ctrl-Space": "autocomplete" },
      styleActiveLine: { nonEmpty: true },
      autoCloseBrackets: true,
      matchBrackets: true,
    }

    // Register hints plugin if desired
    if (hints?.length) {
      CodeMirror.registerHelper("hint", "dictionaryHint", function (editor) {
        const cursor = editor.getCursor()
        return {
          list: hints,
          from: CodeMirror.Pos(cursor.line, cursor.ch),
          to: CodeMirror.Pos(cursor.line, cursor.ch),
        }
      })
      CodeMirror.commands.autocomplete = function (cm) {
        CodeMirror.showHint(cm, CodeMirror.hint.dictionaryHint)
      }
    }

    // Construct CM instance
    editor = CodeMirror.fromTextArea(textarea, options)

    // Use a blur handler to update the value
    editor.on("blur", instance => {
      dispatch("change", instance.getValue())
    })
  }

  // Export a function to expose caret position
  export const getCaretPosition = () => {
    const cursor = editor.getCursor()
    return {
      start: cursor.ch,
      end: cursor.ch,
    }
  }

  onMount(() => {
    // Create the editor with initial value
    createEditor(mode, value)

    // Clean up editor on unmount
    return () => {
      if (editor) {
        editor.toTextArea()
      }
    }
  })
</script>

{#if label}
  <div style="margin-bottom: var(--spacing-s)">
    <Label small>{label}</Label>
  </div>
{/if}
<div
  style={`--code-mirror-height: ${height}px; --code-mirror-resize: ${resize}`}
>
  <textarea tabindex="0" bind:this={textarea} readonly {value} />
</div>

<style>
  div :global(.CodeMirror) {
    height: var(--code-mirror-height);
    min-height: var(--code-mirror-height);
    font-family: var(--font-mono);
    line-height: 1.3;
    border: var(--spectrum-alias-border-size-thin) solid;
    border-color: var(--spectrum-alias-border-color);
    border-radius: var(--border-radius-s);
    resize: var(--code-mirror-resize);
    overflow: hidden;
  }

  /* Override default active line highlight colour in dark theme */
  div
    :global(
      .CodeMirror-focused.cm-s-tomorrow-night-eighties
        .CodeMirror-activeline-background
    ) {
    background: rgba(255, 255, 255, 0.075);
  }

  /* Remove active line styling when not focused */
  div
    :global(
      .CodeMirror:not(.CodeMirror-focused) .CodeMirror-activeline-background
    ) {
    background: unset;
  }

  /* Add a spectrum themed border when focused */
  div :global(.CodeMirror-focused) {
    border-color: var(--spectrum-alias-border-color-mouse-focus);
  }

  /* Ensure hints are always on top */
  :global(.CodeMirror-hints) {
    z-index: 999999;
  }
</style>
