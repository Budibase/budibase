<script lang="ts">
  import type { Snippet } from "svelte"

  let {
    ariaLabel,
    bordered = false,
    children,
  }: {
    ariaLabel: string
    bordered?: boolean
    children: Snippet
  } = $props()
</script>

<div
  class="agent-tab-list"
  class:bordered
  role="tablist"
  aria-label={ariaLabel}
>
  {@render children()}
</div>

<style>
  .agent-tab-list {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1 1 auto;
    min-height: 40px;
  }

  .agent-tab-list.bordered {
    flex: none;
    height: 40px;
    padding: 2px 12px;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }

  .agent-tab-list :global(button) {
    border: 0;
    border-radius: 6px;
    padding: 4px 8px;
    background: transparent;
    color: var(--spectrum-global-color-gray-700);
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    line-height: 19px;
  }

  .agent-tab-list :global(button.active) {
    background: var(--spectrum-global-color-gray-200);
    color: var(--spectrum-global-color-gray-900);
  }
</style>
