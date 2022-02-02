<script>
  import EasyMDE from "easymde"
  import "easymde/dist/easymde.min.css"
  import { onMount } from "svelte"

  export let height = "300px"
  export let scroll = false
  export let easyMDEOptions = null
  export let mde

  let element

  onMount(() => {
    height = height || "300px"
    mde = new EasyMDE({
      element,
      spellChecker: false,
      status: false,
      unorderedListStyle: "-",
      maxHeight: scroll ? height : undefined,
      minHeight: scroll ? undefined : height,
      ...easyMDEOptions,
    })

    // Revert the editor when we unmount
    return () => {
      mde.toTextArea()
    }
  })
</script>

<textarea bind:this={element} />

<style>
  /* Toolbar container */
  :global(.EasyMDEContainer .editor-toolbar) {
    background: var(--background);
    border-top: var(--border-light);
    border-left: var(--border-light);
    border-right: var(--border-light);
  }
  /* Main code mirror instance and default color */
  :global(.EasyMDEContainer .CodeMirror) {
    border: var(--border-light);
    background: var(--background);
    color: var(--ink);
  }
  /* Toolbar button active state */
  :global(.EasyMDEContainer .editor-toolbar button.active) {
    background: var(--spectrum-global-color-gray-200);
    border-color: var(--spectrum-global-color-gray-400);
  }
  /* Toolbar button hover state */
  :global(.EasyMDEContainer .editor-toolbar button:hover) {
    background: var(--spectrum-global-color-gray-200);
    border-color: var(--spectrum-global-color-gray-400);
  }
  /* Toolbar button color */
  :global(.EasyMDEContainer .editor-toolbar button i) {
    color: var(--spectrum-global-color-gray-800);
  }
  /* Separator between toolbar buttons*/
  :global(.EasyMDEContainer .editor-toolbar i.separator) {
    border-color: var(--spectrum-global-color-gray-300);
  }
  /* Cursor */
  :global(.EasyMDEContainer .CodeMirror-cursor) {
    border-color: var(--ink);
  }
  /* Text selections */
  :global(.EasyMDEContainer .CodeMirror-selectedtext) {
    background: var(--spectrum-global-color-gray-400);
  }
  /* Background of lines containing selected text */
  :global(.EasyMDEContainer .CodeMirror-selected) {
    background: var(--spectrum-global-color-gray-400) !important;
  }
  /* Color of text for images and links */
  :global(.EasyMDEContainer .cm-s-easymde .cm-link) {
    color: var(--spectrum-global-color-gray-600);
  }
  /* Color of URL for images and links */
  :global(.EasyMDEContainer .cm-s-easymde .cm-url) {
    color: var(--spectrum-global-color-gray-500);
  }
  /* Full preview window */
  :global(.EasyMDEContainer .editor-preview) {
    background: var(--background);
  }
  /* Side by side preview window */
  :global(.EasyMDEContainer .editor-preview) {
    border: var(--border-light);
  }
</style>
