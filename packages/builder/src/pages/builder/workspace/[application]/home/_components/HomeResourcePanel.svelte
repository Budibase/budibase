<svelte:options runes={true} />

<script lang="ts">
  import type { Snippet } from "svelte"

  interface Props {
    toolbar?: Snippet
    children?: Snippet
    attachTopLeft?: boolean
  }

  let { toolbar, children, attachTopLeft = false }: Props = $props()
</script>

<div
  class="resource-panel"
  class:resource-panel--attached-top-left={attachTopLeft}
>
  <div class="resource-panel__toolbar">
    {@render toolbar?.()}
  </div>
  <div class="resource-panel__content">
    {@render children?.()}
  </div>
</div>

<style>
  .resource-panel {
    width: 100%;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: var(--border-radius-s);
    overflow: hidden;
    background: var(--spectrum-global-color-gray-100);
  }

  .resource-panel--attached-top-left {
    border-top-left-radius: 0;
  }

  .resource-panel__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
    padding: 6px;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    flex-wrap: wrap;
  }

  .resource-panel__content {
    background: var(--spectrum-global-color-gray-100);
  }
</style>
