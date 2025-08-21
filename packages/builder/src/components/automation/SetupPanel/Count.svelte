<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { AbsTooltip } from "@budibase/bbui"

  export let count: number = 0
  export let tooltip: string | undefined = undefined
  export let hoverable: boolean = true

  const dispatch = createEventDispatcher()
</script>

<div class="wrapper">
  <AbsTooltip text={tooltip}>
    {#if count}
      <span
        class="count"
        role="button"
        tabindex="-1"
        aria-label={`Notifications ${count}`}
        class:hoverable
        on:mouseenter={() => {
          dispatch("hover")
        }}
      >
        {count}
      </span>
    {/if}
  </AbsTooltip>
  <slot />
</div>

<style>
  .wrapper {
    position: relative;
  }
  .count {
    position: absolute;
    right: -6px;
    top: -6px;
    background: var(--spectrum-global-color-static-red-600);
    color: white;
    border-radius: 8px;
    padding: 0 4px;
    z-index: 2;
    font-size: 0.8em;
    cursor: default;
  }
  .count.hoverable {
    cursor: pointer;
  }
</style>
