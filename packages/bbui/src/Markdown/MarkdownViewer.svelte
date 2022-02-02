<script>
  import SpectrumMDE from "./SpectrumMDE.svelte"
  import { onMount } from "svelte"

  export let value

  let mde

  // Keep the value up to date
  $: mde && mde.value(value || "")

  onMount(() => {
    // Turn on preview mode
    mde.togglePreview()
  })
</script>

<div class="markdown-viewer">
  <SpectrumMDE
    bind:mde
    scroll={false}
    easyMDEOptions={{
      initialValue: value,
      toolbar: false,
    }}
  />
</div>

<style>
  /* Remove padding, borders and background colors */
  .markdown-viewer :global(.editor-preview) {
    padding: 0;
    border: none;
    background: transparent;
  }
  .markdown-viewer :global(.CodeMirror) {
    border: none;
    background: transparent;
    padding: 0;
  }
  .markdown-viewer :global(.EasyMDEContainer) {
    background: transparent;
  }
  /* Hide the actual code editor */
  .markdown-viewer :global(.CodeMirror-scroll) {
    display: none;
  }
  /*Hide the scrollbar*/
  .markdown-viewer :global(.CodeMirror-vscrollbar) {
    display: none !important;
  }
  /*Position relatively so we only consume whatever space we need */
  .markdown-viewer :global(.editor-preview-full) {
    position: relative;
  }
  /* Remove margin on the final component to fully trim the preview */
  .markdown-viewer :global(.editor-preview-full > :last-child) {
    margin-bottom: 0;
  }
</style>
