<script>
  import EasyMDE from "easymde"
  import "easymde/dist/easymde.min.css"
  import { onMount } from "svelte"

  export let height = "300px"
  export let scroll = true
  export let easyMDEOptions = null
  export let mde = null
  export let id = null

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
      hideIcons: ["fullscreen", "side-by-side"],
      ...easyMDEOptions,
    })

    // Revert the editor when we unmount
    return () => {
      mde.toTextArea()
    }
  })
</script>

<textarea {id} bind:this={element} />

<style>
  /* Toolbar container */
  :global(.EasyMDEContainer .editor-toolbar) {
    background: var(--spectrum-global-color-gray-50);
    border-top: 1px solid var(--spectrum-alias-border-color);
    border-left: 1px solid var(--spectrum-alias-border-color);
    border-right: 1px solid var(--spectrum-alias-border-color);
  }
  /* Main code mirror instance and default color */
  :global(.EasyMDEContainer .CodeMirror) {
    border: 1px solid var(--spectrum-alias-border-color);
    background: var(--spectrum-global-color-gray-50);
    color: var(--spectrum-alias-text-color);
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
    border-color: var(--spectrum-alias-text-color);
  }
  /* Text selections */
  :global(.EasyMDEContainer .CodeMirror-selectedtext) {
    background: var(--spectrum-global-color-gray-400) !important;
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
    background: var(--spectrum-global-color-gray-50);
  }
  /* Side by side preview window */
  :global(.EasyMDEContainer .editor-preview) {
    border: 1px solid var(--spectrum-alias-border-color);
  }
  /* Code blocks in editor */
  :global(.EasyMDEContainer .cm-s-easymde .cm-comment) {
    background: var(--spectrum-global-color-gray-100);
  }
  /* Code blocks in preview */
  :global(.EasyMDEContainer .editor-preview pre) {
    background: var(--spectrum-global-color-gray-100);
    padding: 4px;
    border-radius: 4px;
  }
  :global(.EasyMDEContainer .editor-preview code) {
    color: #e83e8c;
  }
  :global(.EasyMDEContainer .editor-preview pre code) {
    color: var(--spectrum-alias-text-color);
  }
  /* Block quotes */
  :global(.EasyMDEContainer .editor-preview blockquote) {
    border-left: 4px solid var(--spectrum-global-color-gray-400);
    color: var(--spectrum-global-color-gray-700);
    margin-left: 0;
    padding-left: 20px;
  }
</style>
