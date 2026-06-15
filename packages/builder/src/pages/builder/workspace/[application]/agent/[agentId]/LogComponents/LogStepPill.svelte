<script lang="ts">
  import { TooltipWrapper } from "@budibase/bbui"
  import type { Snippet } from "svelte"

  type Props = {
    children: Snippet
    tooltip?: string
  }

  let { children, tooltip }: Props = $props()
</script>

{#if tooltip}
  <TooltipWrapper {tooltip} size="S">
    <span class="log-step-pill">{@render children()}</span>
  </TooltipWrapper>
{:else}
  <span class="log-step-pill">{@render children()}</span>
{/if}

<style>
  .log-step-pill {
    border: 1px solid var(--spectrum-global-color-gray-200);
    background: var(--spectrum-global-color-gray-100);
    border-radius: 999px;
    color: var(--spectrum-global-color-gray-600);
    flex-shrink: 0;
    font-size: 11px;
    padding: 2px 8px;
  }
</style>
