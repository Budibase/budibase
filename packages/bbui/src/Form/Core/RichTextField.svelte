<script>
  import MarkdownEditor from "../../Markdown/MarkdownEditor.svelte"

  export let value = ""
  export let placeholder = null
  export let disabled = false
  export let readonly = false
  export let height = null
  export let id = null
  export let fullScreenOffset = null
  export let easyMDEOptions = null
</script>

<div>
  <MarkdownEditor
    {value}
    {placeholder}
    {height}
    {id}
    {fullScreenOffset}
    {disabled}
    {easyMDEOptions}
    {readonly}
    on:change
  />
</div>

<style>
</style>
