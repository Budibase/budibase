<script>
  import cm from "./codemirror"
  import { onMount, createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let value
  export let mode = "sql"

  let editor
  let codemirror

  $: {
    if (codemirror) {
      const { left, top } = codemirror.getScrollInfo()
      codemirror.setValue(value)
      codemirror.scrollTo(left, top)
    }
  }

  onMount(() => {
    if (codemirror) codemirror.toTextArea()

    codemirror = cm.fromTextArea(editor, {
      lineNumbers: true,
      mode,
      lineWrapping: true,
      indentUnit: 2,
      tabSize: 2,
      autoCloseBrackets: true,
      autoCloseTags: true,
      extraKeys: {
        "Ctrl-/": "toggleComment",
      },
    })
    codemirror.on("change", instance => {
      const code = instance.getValue()
      dispatch("change", code)
    })

    codemirror.setValue(value || "")

    return () => {
      if (codemirror) codemirror.toTextArea()
    }
  })
</script>

<textarea bind:value bind:this={editor} />

<style>
  textarea {
    background: var(--background);
    border-radius: var(--border-radius-m);
  }
  :global(.CodeMirror) {
    border-radius: var(--border-radius-m);
  }
</style>
