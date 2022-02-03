<script>
  import MarkdownEditor from "../../Markdown/MarkdownEditor.svelte"

  export let value = ""
  export let placeholder = null
  export let disabled = false
  export let error = null
  export let height = null
  export let id = null
  export let fullScreenOffset = 0
</script>

<MarkdownEditor
  {value}
  {placeholder}
  {height}
  {id}
  {fullScreenOffset}
  on:change
/>
