<script lang="ts">
  import { marked } from "marked"

  export let value: string | undefined = undefined
  export let height: string | undefined = undefined

  let ref: HTMLDivElement | undefined

  $: updateValue(ref, value)

  const updateValue = (
    ref: HTMLDivElement | undefined,
    markdown: string | undefined
  ) => {
    if (!ref) {
      return
    }
    if (!markdown) {
      ref.innerHTML = ""
      return
    }
    ref.innerHTML = marked.parse(markdown)
  }
</script>

<div class="markdown-viewer" style="height:{height};" bind:this={ref} />

<style>
  .markdown-viewer {
    overflow: auto;
  }
  /* Remove margin on the first and last components to fully trim the preview */
  .markdown-viewer :global(:first-child) {
    margin-top: 0;
  }
  .markdown-viewer :global(:last-child) {
    margin-bottom: 0;
  }
  /* Code blocks */
  .markdown-viewer :global(pre) {
    background: var(--spectrum-global-color-gray-200);
    padding: 4px;
    border-radius: 4px;
  }
  .markdown-viewer :global(code) {
    color: #e83e8c;
  }
  .markdown-viewer :global(pre code) {
    color: var(--spectrum-alias-text-color);
  }
  /* Block quotes */
  .markdown-viewer :global(blockquote) {
    border-left: 4px solid var(--spectrum-global-color-gray-400);
    color: var(--spectrum-global-color-gray-700);
    margin-left: 0;
    padding-left: 20px;
  }
  /* HRs */
  .markdown-viewer :global(hr) {
    background-color: var(--spectrum-global-color-gray-300);
    border: none;
    height: 2px;
  }
  /* Tables */
  .markdown-viewer :global(td),
  .markdown-viewer :global(th) {
    border-color: var(--spectrum-alias-border-color) !important;
  }
  /* Links */
  .markdown-viewer :global(a) {
    color: var(--primaryColor);
  }
  .markdown-viewer :global(a:hover) {
    color: var(--primaryColorHover);
  }
</style>
