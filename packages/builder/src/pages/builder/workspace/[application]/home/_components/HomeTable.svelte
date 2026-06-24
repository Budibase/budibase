<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { AbsTooltip, Body, Helpers, Icon } from "@budibase/bbui"
  import dayjs from "dayjs"
  import relativeTime from "dayjs/plugin/relativeTime"
  import FavouriteResourceButton from "@/pages/builder/_components/FavouriteResourceButton.svelte"
  import type {
    HomeRow,
    HomeSortColumn,
    HomeSortOrder,
    HomeType,
  } from "@budibase/types"
  import HomeEmptyState from "./HomeEmptyState.svelte"
  import { getTypeLabel } from "./rows"
  import { getAgentStatusLabel, getPublishResourceStatusLabel } from "./status"

  dayjs.extend(relativeTime)

  export let rows: HomeRow[] = []
  export let loading = false
  export let allRowsCount = 0
  export let typeFilter: HomeType = "all"
  export let searchTerm = ""
  export let projectsEnabled = false
  export let selectedProjectName = ""
  export let sortColumn: HomeSortColumn
  export let sortOrder: HomeSortOrder
  export let variant: "default" | "panel" = "default"

  const dispatch = createEventDispatcher<{
    openRow: HomeRow
    create: void
    clearSearch: void
    resetFilters: void
    sortChange: HomeSortColumn
    createAgent: void
    createAutomation: void
    createApp: void
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

  const getRowStatusLabel = (row: HomeRow) => {
    if (row.type === "app" || row.type === "automation") {
      return getPublishResourceStatusLabel(row.resource.publishStatus)
    }

    if (row.type === "agent") {
      return getAgentStatusLabel(row.resource)
    }

    return "-"
  }

  const getStatusColor = (status: string) => {
    if (status === "Live") {
      return "var(--color-green-500)"
    }
    if (status === "Stopped") {
      return "var(--color-orange-400)"
    }
    return "var(--spectrum-global-color-gray-600)"
  }

  const getProjectCount = (row: HomeRow) =>
    row.projectCount ?? row.projectIds?.length ?? 0

  const getCreatedDisplay = (row: HomeRow) => {
    if (!row.createdAt) {
      return "-"
    }
    return Helpers.getDateDisplayValue(row.createdAt)
  }

  export let highlightedRowId: string | null = null

  const openContextMenu = (event: MouseEvent, row: HomeRow) => {
    event.preventDefault()
    event.stopPropagation()
    dispatch("openContextMenu", { row, x: event.clientX, y: event.clientY })
  }

  $: gridColumns = projectsEnabled
    ? "1fr 140px 140px 140px 140px 60px"
    : "1fr 140px 140px 140px 60px"
</script>

<div class="table-wrapper" class:table-wrapper--panel={variant === "panel"}>
  <div
    class="table"
    class:table--loading={loading}
    style="--grid-columns: {gridColumns}"
  >
    {#if allRowsCount > 0}
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
            class:sort-indicator--up={isSorted("name") && sortOrder === "desc"}
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
          class="header-cell"
          on:click={() => headerClick("type")}
        >
          <span>Type</span>
          <span
            class="sort-indicator"
            class:sort-indicator--active={isSorted("type")}
            class:sort-indicator--up={isSorted("type") && sortOrder === "desc"}
          >
            <Icon
              name="caret-down"
              size="S"
              color="var(--spectrum-global-color-gray-700)"
            />
          </span>
        </button>

        {#if projectsEnabled}
          <button
            type="button"
            class="header-cell"
            on:click={() => headerClick("projects")}
          >
            <span>Projects</span>
            <span
              class="sort-indicator"
              class:sort-indicator--active={isSorted("projects")}
              class:sort-indicator--up={isSorted("projects") &&
                sortOrder === "desc"}
            >
              <Icon
                name="caret-down"
                size="S"
                color="var(--spectrum-global-color-gray-700)"
              />
            </span>
          </button>
        {/if}

        <button
          type="button"
          class="header-cell"
          on:click={() => headerClick("status")}
        >
          <span>Status</span>
          <span
            class="sort-indicator"
            class:sort-indicator--active={isSorted("status")}
            class:sort-indicator--up={isSorted("status") &&
              sortOrder === "desc"}
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
          class="header-cell"
          on:click={() => headerClick(projectsEnabled ? "created" : "updated")}
        >
          <span>{projectsEnabled ? "Created" : "Updated"}</span>
          <span
            class="sort-indicator"
            class:sort-indicator--active={isSorted(
              projectsEnabled ? "created" : "updated"
            )}
            class:sort-indicator--up={isSorted(
              projectsEnabled ? "created" : "updated"
            ) && sortOrder === "desc"}
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
    {/if}

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
            <Icon
              name={row.icon}
              size="S"
              color={row.iconColor}
              weight="fill"
            />
            <div class="name-content">
              <Body size="S" color="var(--spectrum-global-color-gray-800)"
                >{row.name}</Body
              >
            </div>
          </div>

          <div class="cell">
            <Body size="S" color="var(--spectrum-global-color-gray-700)">
              {getTypeLabel(row.type)}
            </Body>
          </div>

          {#if projectsEnabled}
            <div class="cell">
              <Body size="S" color="var(--spectrum-global-color-gray-700)">
                {getProjectCount(row)}
              </Body>
            </div>
          {/if}

          <div class="cell">
            <Body size="S" color={getStatusColor(getRowStatusLabel(row))}>
              {getRowStatusLabel(row)}
            </Body>
          </div>

          <div class="cell">
            {#if projectsEnabled}
              <Body size="S" color="var(--spectrum-global-color-gray-700)">
                {getCreatedDisplay(row)}
              </Body>
            {:else if row.updatedAt}
              <AbsTooltip text={Helpers.getDateDisplayValue(row.updatedAt)}>
                <Body size="S" color="var(--spectrum-global-color-gray-700)">
                  {dayjs(row.updatedAt).fromNow()}
                </Body>
              </AbsTooltip>
            {:else}
              <Body size="S" color="var(--spectrum-global-color-gray-700)">
                -
              </Body>
            {/if}
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
            {selectedProjectName}
            on:create={() => dispatch("create")}
            on:clearSearch={() => dispatch("clearSearch")}
            on:resetFilters={() => dispatch("resetFilters")}
            on:createAgent={() => dispatch("createAgent")}
            on:createAutomation={() => dispatch("createAutomation")}
            on:createApp={() => dispatch("createApp")}
          />
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .table-wrapper {
    overflow-x: auto;
    width: 100%;
    scrollbar-width: none;
  }

  .table-wrapper--panel {
    border-radius: 0;
  }

  .table-wrapper::-webkit-scrollbar {
    display: none;
  }

  .table {
    --border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: var(--border-radius-s);
    overflow: hidden;
    background: transparent;
    min-width: 700px;
  }

  .table-wrapper--panel .table {
    border-radius: 0;
    min-width: 0;
  }

  .table-header,
  .row {
    display: grid;
    grid-template-columns: var(--grid-columns);
    border-bottom: var(--border);
    align-items: center;
  }

  .name-content {
    display: flex;
    min-width: 0;
  }

  .name-content :global(.spectrum-Body) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .table-header {
    padding: 8px 12px;
    font-size: var(--font-size-s);
    color: var(--spectrum-global-color-gray-700);
    background: var(--spectrum-global-color-gray-100);
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
    font-size: inherit;
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

  .sort-indicator--active.sort-indicator--up {
    transform: rotate(180deg);
  }

  .header-cell--actions {
    cursor: default;
  }

  .table-body {
    display: flex;
    flex-direction: column;
    background: var(--spectrum-global-color-gray-100);
  }

  .row {
    padding: 8px 12px;
    text-align: left;
    border: none;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    background: var(--spectrum-global-color-gray-100);
    transition: background 130ms ease-out;
    cursor: pointer;
  }

  .row:hover,
  .row.active {
    background: var(--spectrum-global-color-gray-200);
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
    gap: 12px;
  }

  .actions {
    justify-content: flex-end;
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
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
    padding: var(--spacing-l) 0;
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
