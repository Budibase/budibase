<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { Body, Button } from "@budibase/bbui"
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
          <Button
            secondary
            quiet
            size="S"
            on:click={() => dispatch("clearSearch")}
          >
            Clear search
          </Button>
        {/if}
        {#if hasFilter}
          <Button
            secondary
            quiet
            size="S"
            on:click={() => dispatch("resetFilters")}
          >
            Reset filter
          </Button>
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
    flex-wrap: wrap;
  }
</style>
