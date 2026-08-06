<script lang="ts">
  import type { RestRequestPreview } from "@budibase/types"
  import CodeEditor from "../common/CodeEditor/CodeEditor.svelte"
  import { EditorModes } from "../common/CodeEditor"
  import { secretTagPlugin } from "../common/CodeEditor/secretTags"
  import QueryStats from "./QueryStats.svelte"

  export let request: RestRequestPreview | undefined = undefined
  export let info: { code: number; time: string; size: string } | undefined =
    undefined
  export let fullscreen = false

  $: value = JSON.stringify(request ?? {}, null, 2)
</script>

<div class="request-panel">
  {#if !request}
    <div class="placeholder">-</div>
  {:else}
    <QueryStats {info} compact={!fullscreen} />
    <div class="embed">
      <CodeEditor
        {value}
        readonly
        readonlyLineNumbers={false}
        mode={EditorModes.JSON}
        extraExtensions={[secretTagPlugin]}
      />
    </div>
  {/if}
</div>

<style>
  .request-panel {
    height: 100%;
    display: flex;
    flex-direction: column;
    /* matches the gap="S" Layout used by ResponsePanel */
    gap: var(--spectrum-alias-grid-gutter-xsmall);
  }
  .placeholder {
    padding: var(--spacing-xl);
    text-align: center;
    color: var(--spectrum-global-color-gray-600);
  }
  /* fill whatever is left below the stats */
  .embed {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
  .embed :global(.code-editor),
  .embed :global(.code-editor > div) {
    height: 100% !important;
    overflow: hidden;
  }
  .embed :global(.cm-editor) {
    height: 100% !important;
    min-height: unset;
    overflow-y: auto;
    border: 1px solid var(--spectrum-global-color-gray-400);
    border-radius: 4px;
  }
  .embed :global(.cm-gutters) {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  /* redaction tags read as annotations here, not as bindings to act on */
  .request-panel :global(.hbs-tag) {
    background: none;
    border: 1px solid var(--spectrum-global-color-gray-300);
  }
</style>
