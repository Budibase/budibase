<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { Body, Button } from "@budibase/bbui"
  import type { HomeType } from "@budibase/types"

  export let allRowsCount = 0
  export let filteredRowsCount = 0
  export let typeFilter: HomeType = "all"
  export let searchTerm = ""
  export let selectedPlaybookName = ""

  const dispatch = createEventDispatcher<{
    clearSearch: void
    resetFilters: void
    create: void
  }>()

  $: hasAnyRows = allRowsCount > 0
  $: hasSearch = !!searchTerm.trim()
  $: hasPlaybookFilter = !!selectedPlaybookName
  $: hasFilter = typeFilter !== "all" || hasPlaybookFilter
  $: isNoResults = hasAnyRows && filteredRowsCount === 0
  $: noResultsText = hasPlaybookFilter
    ? `No results in ${selectedPlaybookName}.`
    : "No results."

  const createLabelByType: Record<HomeType, string> = {
    all: "Create app",
    app: "Create app",
    automation: "Create automation",
    agent: "Create agent",
  }

  $: createLabel = createLabelByType[typeFilter]
</script>

{#if filteredRowsCount === 0}
  <div class="empty">
    {#if isNoResults}
      <Body size="M" color="var(--spectrum-global-color-gray-700)">
        {noResultsText}
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
      <Button cta size="S" on:click={() => dispatch("create")}
        >{createLabel}</Button
      >
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
