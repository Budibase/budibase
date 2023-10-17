<script>
  import MarkdownEditor from "../../Markdown/MarkdownEditor.svelte"

  export let value = ""
  export let placeholder = null
  export let disabled = false
  export let error = null
  export let height = null
  export let id = null
  export let fullScreenOffset = null
  export let easyMDEOptions = null
</script>

<div class:error>
  <MarkdownEditor
    {value}
    {placeholder}
    {height}
    {id}
    {fullScreenOffset}
    {disabled}
    {easyMDEOptions}
    on:change
  />
</div>

<style>
  .error :global(.EasyMDEContainer .editor-toolbar) {
    border-top-color: var(--spectrum-semantic-negative-color-default);
    border-left-color: var(--spectrum-semantic-negative-color-default);
    border-right-color: var(--spectrum-semantic-negative-color-default);
  }
  .error :global(.EasyMDEContainer .CodeMirror) {
    border-bottom-color: var(--spectrum-semantic-negative-color-default);
    border-left-color: var(--spectrum-semantic-negative-color-default);
    border-right-color: var(--spectrum-semantic-negative-color-default);
  }
  .error :global(.EasyMDEContainer .editor-preview-side) {
    border-bottom-color: var(--spectrum-semantic-negative-color-default);
    border-right-color: var(--spectrum-semantic-negative-color-default);
  }
</style>
