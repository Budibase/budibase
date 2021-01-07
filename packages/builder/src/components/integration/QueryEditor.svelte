<script>
  import cm from "./codemirror"
  import { onMount, createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let value
  export let mode = "sql"

  let editor
  let codemirror

  // $: codemirror && codemirror.setValue(value)

  onMount(async () => {
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
      value = code
      dispatch("change", code)
    })
  })
</script>

<textarea bind:value bind:this={editor} />

<style>
  textarea {
    background: var(--background);
    border-radius: var(--border-radius-m);
  }
</style>
