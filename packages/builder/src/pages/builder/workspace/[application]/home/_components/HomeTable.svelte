<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { Body, Icon } from "@budibase/bbui"
  import dayjs from "dayjs"
  import relativeTime from "dayjs/plugin/relativeTime"
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

  dayjs.extend(relativeTime)

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
    openContextMenu: {
      row: HomeRow
      x: number
      y: number
    }
  }>()

  const isSorted = (column: HomeSortColumn) => sortColumn === column

  const headerClick = (column: HomeSortColumn) => {
    dispatch("sortChange", column)
  }

  const handleRowClick = (row: HomeRow) => {
    dispatch("openRow", row)
  }

  export let highlightedRowId: string | null = null

  const openContextMenu = (event: MouseEvent, row: HomeRow) => {
    event.preventDefault()
    event.stopPropagation()
    dispatch("openContextMenu", { row, x: event.clientX, y: event.clientY })
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
        class:sort-indicator--asc={isSorted("name") && sortOrder === "desc"}
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
      <span>Type</span>
      <span
        class="sort-indicator"
        class:sort-indicator--active={isSorted("type")}
        class:sort-indicator--asc={isSorted("type") && sortOrder === "desc"}
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
      <span>Status</span>
      <span
        class="sort-indicator"
        class:sort-indicator--active={isSorted("status")}
        class:sort-indicator--asc={isSorted("status") && sortOrder === "desc"}
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
      <span>Created</span>
      <span
        class="sort-indicator"
        class:sort-indicator--active={isSorted("created")}
        class:sort-indicator--asc={isSorted("created") && sortOrder === "desc"}
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
        class:active={highlightedRowId === row._id}
        type="button"
        on:click={() => handleRowClick(row)}
        on:contextmenu={e => openContextMenu(e, row)}
      >
        <div class="cell name-cell">
          <div class="icon-wrapper">
            <Icon
              name={row.icon}
              size="S"
              color={row.iconColor}
              weight="fill"
            />
          </div>
          <Body size="S" color="var(--spectrum-global-color-gray-900)"
            >{row.name}</Body
          >
        </div>

        <div class="cell">
          <Body size="S" color="var(--spectrum-global-color-gray-700)">
            {getTypeLabel(row.type)}
          </Body>
        </div>

        <div class="cell">
          {#if row.type === "app" || row.type === "automation"}
            <!-- todo: sort out for agents and chat -->
            <PublishStatusBadge status={row.status} />
          {:else}
            <Body
              size="S"
              color={row.live
                ? "#8CA171"
                : "var(--spectrum-global-color-gray-600)"}
            >
              {row.live ? "Live" : "Draft"}
            </Body>
          {/if}
        </div>

        <div class="cell">
          <Body size="S" color="var(--spectrum-global-color-gray-700)">
            {#if row.createdAt}
              {dayjs(row.createdAt).fromNow()}
            {:else}
              -
            {/if}
          </Body>
        </div>

        <div class="cell actions">
          <span class="favourite-btn">
            <FavouriteResourceButton favourite={row.favourite} />
          </span>
          <div class="ctx-btn">
            <Icon
              name="dots-three"
              size="M"
              hoverable
              color="var(--spectrum-global-color-gray-600)"
              on:click={e => openContextMenu(e, row)}
            />
          </div>
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
    border-radius: 6px;
    overflow: hidden;
    background: transparent;
  }

  .table-header,
  .row {
    display: grid;
    grid-template-columns: 1fr 200px 200px 200px 50px;
    border-bottom: var(--border);
    align-items: center;
  }

  .table-header {
    padding: 12px 12px;
    font-size: 14px;
    color: var(--spectrum-global-color-gray-700);
    background: transparent;
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
    border-bottom: 0.5px solid var(--spectrum-global-color-gray-200);
    background: var(--background-alt);
    transition: background 130ms ease-out;
    cursor: pointer;
  }

  .row:hover,
  .row.active {
    background: var(--spectrum-global-color-gray-100);
  }

  .row:hover .actions > *,
  .row.active .actions > *,
  .row:focus-within .actions > * {
    opacity: 1;
    pointer-events: auto;
  }

  .row:hover .favourite-btn :global(i[aria-label="star"]),
  .row.active .favourite-btn :global(i[aria-label="star"]),
  .row:focus-within .favourite-btn :global(i[aria-label="star"]) {
    --color: var(--spectrum-global-color-gray-600);
  }

  .row.favourite .actions .favourite-btn {
    opacity: 1;
    pointer-events: auto;
  }

  .row.favourite .favourite-btn :global(i[aria-label="star"]) {
    --hover-color: var(--spectrum-global-color-gray-500) !important;
  }

  .cell {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    min-width: 0;
  }

  .name-cell {
    gap: var(--spacing-m);
  }

  .icon-wrapper {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--spectrum-global-color-gray-200);
  }

  .actions {
    justify-content: flex-end;
    display: flex;
    align-items: center;
    gap: calc(var(--spacing-xs) + 12px);
  }

  .actions > * {
    opacity: 0;
    pointer-events: none;
    transition: opacity 130ms ease-out;
  }

  .actions .ctx-btn {
    opacity: 1;
    pointer-events: auto;
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

  @media (hover: none), (pointer: coarse) {
    .row .actions > * {
      opacity: 1;
      pointer-events: auto;
    }

    .row .favourite-btn :global(i[aria-label="star"]) {
      --color: var(--spectrum-global-color-gray-600);
    }
  }
</style>
