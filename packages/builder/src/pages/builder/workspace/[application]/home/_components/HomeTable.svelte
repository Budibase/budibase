<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { Body, Helpers, Icon } from "@budibase/bbui"
  import PublishStatusBadge from "@/components/common/PublishStatusBadge.svelte"
  import FavouriteResourceButton from "@/pages/builder/_components/FavouriteResourceButton.svelte"
  import type {
    HomeRow,
    HomeSortColumn,
    HomeSortOrder,
    HomeType,
  } from "./types"
  import HomeEmptyState from "./HomeEmptyState.svelte"
  import { getTypeLabel } from "./rows"

  export let rows: HomeRow[] = []
  export let loading = false
  export let allRowsCount = 0
  export let typeFilter: HomeType = "all"
  export let searchTerm = ""
  export let sortColumn: HomeSortColumn
  export let sortOrder: HomeSortOrder

  const dispatch = createEventDispatcher<{
    openRow: HomeRow
    clearSearch: void
    resetFilters: void
    sortChange: HomeSortColumn
  }>()

  const isSorted = (column: HomeSortColumn) => sortColumn === column
  const isAscending = sortOrder === "asc"

  const headerClick = (column: HomeSortColumn) => {
    dispatch("sortChange", column)
  }

  const handleRowClick = (row: HomeRow) => {
    dispatch("openRow", row)
  }

  const stop = (event: Event) => {
    event.stopPropagation()
  }
</script>

<div class="table" class:table--loading={loading}>
  <div class="table-header" role="row">
    <button
      type="button"
      class="header-cell"
      on:click={() => headerClick("name")}
    >
      <span>Name</span>
      <span
        class="sort-indicator"
        class:sort-indicator--active={isSorted("name")}
        class:sort-indicator--asc={isSorted("name") && isAscending}
      >
        <Icon
          name="caret-down"
          size="S"
          color="var(--spectrum-global-color-gray-700)"
        />
      </span>
    </button>

    <button
      type="button"
      class="header-cell header-cell--with-icon"
      on:click={() => headerClick("type")}
    >
      <Icon
        name="circle-half-tilt"
        size="S"
        color="var(--spectrum-global-color-gray-600)"
      />
      <span>Type</span>
      <span
        class="sort-indicator"
        class:sort-indicator--active={isSorted("type")}
        class:sort-indicator--asc={isSorted("type") && isAscending}
      >
        <Icon
          name="caret-down"
          size="S"
          color="var(--spectrum-global-color-gray-700)"
        />
      </span>
    </button>

    <button
      type="button"
      class="header-cell header-cell--with-icon"
      on:click={() => headerClick("status")}
    >
      <Icon
        name="circle-half-tilt"
        size="S"
        color="var(--spectrum-global-color-gray-600)"
      />
      <span>Status</span>
      <span
        class="sort-indicator"
        class:sort-indicator--active={isSorted("status")}
        class:sort-indicator--asc={isSorted("status") && isAscending}
      >
        <Icon
          name="caret-down"
          size="S"
          color="var(--spectrum-global-color-gray-700)"
        />
      </span>
    </button>

    <button
      type="button"
      class="header-cell header-cell--with-icon"
      on:click={() => headerClick("created")}
    >
      <Icon
        name="calendar"
        size="S"
        color="var(--spectrum-global-color-gray-600)"
      />
      <span>Created</span>
      <span
        class="sort-indicator"
        class:sort-indicator--active={isSorted("created")}
        class:sort-indicator--asc={isSorted("created") && isAscending}
      >
        <Icon
          name="caret-down"
          size="S"
          color="var(--spectrum-global-color-gray-700)"
        />
      </span>
    </button>

    <div class="header-cell header-cell--actions" aria-hidden="true"></div>
  </div>

  <div class="table-body" class:table-body--empty={!rows.length}>
    {#each rows as row (row._id)}
      <button
        class="row"
        class:favourite={row.favourite?._id}
        type="button"
        on:click={() => handleRowClick(row)}
      >
        <div class="cell name-cell">
          <Icon name={row.icon} size="S" color={row.iconColor} />
          <Body size="XS">{row.name}</Body>
        </div>

        <div class="cell">
          <Body size="XS" color="var(--spectrum-global-color-gray-700)">
            {getTypeLabel(row.type)}
          </Body>
        </div>

        <div class="cell">
          {#if row.type === "app" || row.type === "automation"}
            <PublishStatusBadge status={row.status} />
          {:else}
            <Body
              size="XS"
              color={row.live
                ? "#8CA171"
                : "var(--spectrum-global-color-gray-700)"}
            >
              {row.live ? "Live" : "Draft"}
            </Body>
          {/if}
        </div>

        <div class="cell">
          <Body size="XS" color="var(--spectrum-global-color-gray-700)">
            {#if row.createdAt || row.updatedAt}
              {Helpers.getDateDisplayValue(row.createdAt || row.updatedAt)}
            {:else}
              -
            {/if}
          </Body>
        </div>

        <div class="cell actions">
          <div class="ctx-btn" title="Coming soon">
            <Icon name="dots-three" size="M" hoverable on:click={stop} />
          </div>
          <span class="favourite-btn">
            <FavouriteResourceButton favourite={row.favourite} />
          </span>
        </div>
      </button>
    {/each}

    {#if !rows.length}
      <div class="empty">
        <HomeEmptyState
          {typeFilter}
          {searchTerm}
          {allRowsCount}
          filteredRowsCount={rows.length}
          on:clearSearch={() => dispatch("clearSearch")}
          on:resetFilters={() => dispatch("resetFilters")}
        />
      </div>
    {/if}
  </div>
</div>

<style>
  .table {
    --border: 1px solid var(--spectrum-global-color-gray-200);
    border: var(--border);
    border-radius: 6px;
    overflow: hidden;
    background: var(--background);
  }

  .table-header,
  .row {
    display: grid;
    grid-template-columns: 1fr 200px 200px 200px 50px;
    border-bottom: var(--border);
    align-items: center;
  }

  .table-header {
    padding: 5px 12px;
    color: var(--spectrum-global-color-gray-700);
    background: var(--background);
  }

  .header-cell {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: 0;
    margin: 0;
    border: none;
    background: transparent;
    color: inherit;
    font-family: var(--font-sans);
    font-size: 12px;
    text-align: left;
    cursor: pointer;
  }

  .sort-indicator {
    width: 16px;
    display: inline-flex;
    justify-content: center;
    opacity: 0;
    transform: rotate(0deg);
    transition:
      opacity 130ms ease-out,
      transform 130ms ease-out;
  }

  .sort-indicator--active {
    opacity: 1;
  }

  .sort-indicator--active.sort-indicator--asc {
    transform: rotate(180deg);
  }

  .header-cell--actions {
    cursor: default;
  }

  .table-body {
    display: flex;
    flex-direction: column;
    background: var(--background-alt);
  }

  .row {
    padding: 9px 12px;
    text-align: left;
    border: none;
    background: var(--background-alt);
    transition: background 130ms ease-out;
    cursor: pointer;

    &:hover {
      background: var(--spectrum-global-color-gray-200);

      & .actions > * {
        opacity: 1;
        pointer-events: all;
      }
    }

    &.favourite {
      & .actions .favourite-btn {
        opacity: 1;
      }
    }
  }

  .cell {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    min-width: 0;
  }

  .name-cell {
    gap: var(--spacing-s);
  }

  .actions {
    justify-content: flex-end;
    display: flex;
    align-items: center;
    pointer-events: none;
    gap: var(--spacing-xs);
  }

  .actions > * {
    opacity: 0;
    transition: opacity 130ms ease-out;
  }

  .actions .favourite-btn {
    pointer-events: all;
  }

  .ctx-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
  }

  .empty {
    padding: 20px 0;
  }

  @media (max-width: 900px) {
    .table-header,
    .row {
      grid-template-columns: 1fr 120px 120px 140px 40px;
    }
  }
</style>
