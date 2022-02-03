<script>
  import SpectrumMDE from "./SpectrumMDE.svelte"

  export let value
  export let height

  let mde

  // Keep the value up to date
  $: mde && mde.value(value || "")
  $: {
    if (mde && !mde.isPreviewActive()) {
      mde.togglePreview()
    }
  }
</script>

<div class="markdown-viewer" style="height:{height};">
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
  .markdown-viewer {
    overflow: auto;
  }
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
  /* Remove margin on the first and last components to fully trim the preview */
  .markdown-viewer :global(.editor-preview-full > :first-child) {
    margin-top: 0;
  }
  .markdown-viewer :global(.editor-preview-full > :last-child) {
    margin-bottom: 0;
  }
  /* Code blocks in preview */
  .markdown-viewer :global(.editor-preview-full pre) {
    background: var(--spectrum-global-color-gray-200);
  }
</style>
