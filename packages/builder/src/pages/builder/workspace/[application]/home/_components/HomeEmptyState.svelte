<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { Body } from "@budibase/bbui"
  import type { HomeType } from "@budibase/types"

  export let allRowsCount = 0
  export let filteredRowsCount = 0
  export let typeFilter: HomeType = "all"
  export let searchTerm = ""

  const dispatch = createEventDispatcher<{
    clearSearch: void
    resetFilters: void
  }>()

  $: hasAnyRows = allRowsCount > 0
  $: hasSearch = !!searchTerm.trim()
  $: hasFilter = typeFilter !== "all"
  $: isNoResults = hasAnyRows && filteredRowsCount === 0
</script>

{#if filteredRowsCount === 0}
  <div class="empty">
    {#if isNoResults}
      <Body size="M" color="var(--spectrum-global-color-gray-700)">
        No results.
      </Body>
      <div class="actions">
        {#if hasSearch}
          <button
            type="button"
            class="action"
            on:click={() => dispatch("clearSearch")}
          >
            Clear search
          </button>
        {/if}
        {#if hasFilter}
          <button
            type="button"
            class="action"
            on:click={() => dispatch("resetFilters")}
          >
            Reset filter
          </button>
        {/if}
      </div>
    {:else}
      <Body size="M" color="var(--spectrum-global-color-gray-700)">
        Nothing here yet.
      </Body>
    {/if}
  </div>
{/if}

<style>
  .empty {
    padding: var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    justify-content: center;
    align-items: center;
    background: transparent;
  }

  .actions {
    display: flex;
    gap: var(--spacing-s);
  }

  .action {
    border: 1px solid var(--spectrum-global-color-gray-300);
    background: transparent;
    border-radius: 6px;
    padding: 6px 10px;
    cursor: pointer;
    color: var(--spectrum-global-color-gray-800);
    transition:
      background 130ms ease-out,
      border-color 130ms ease-out;
  }

  .action:hover {
    background: var(--spectrum-global-color-gray-100);
    border-color: var(--spectrum-global-color-gray-400);
  }
</style>
