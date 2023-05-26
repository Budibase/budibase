<script>
  import { getContext } from "svelte"
  import GridCell from "./GridCell.svelte"
  import { Icon, Popover, Menu, MenuItem } from "@budibase/bbui"
  import { getColumnIcon } from "../lib/utils"

  export let column
  export let idx
  export let orderable = true

  const {
    reorder,
    isReordering,
    isResizing,
    rand,
    sort,
    renderedColumns,
    dispatch,
    config,
    ui,
    columns,
  } = getContext("grid")

  const bannedDisplayColumnTypes = [
    "link",
    "array",
    "attachment",
    "boolean",
    "formula",
    "json",
  ]

  let anchor
  let open = false
  let timeout

  $: sortedBy = column.name === $sort.column
  $: canMoveLeft = orderable && idx > 0
  $: canMoveRight = orderable && idx < $renderedColumns.length - 1
  $: ascendingLabel = column.schema?.type === "number" ? "low-high" : "A-Z"
  $: descendingLabel = column.schema?.type === "number" ? "high-low" : "Z-A"

  const editColumn = () => {
    dispatch("edit-column", column.schema)
    open = false
  }

  const onMouseDown = e => {
    if (e.button === 0 && orderable) {
      timeout = setTimeout(() => {
        reorder.actions.startReordering(column.name, e)
      }, 200)
    }
  }

  const onMouseUp = e => {
    if (e.button === 0 && orderable) {
      clearTimeout(timeout)
    }
  }

  const onContextMenu = e => {
    e.preventDefault()
    ui.actions.blur()
    open = !open
  }

  const sortAscending = () => {
    sort.set({
      column: column.name,
      order: "ascending",
    })
    open = false
  }

  const sortDescending = () => {
    sort.set({
      column: column.name,
      order: "descending",
    })
    open = false
  }

  const moveLeft = () => {
    reorder.actions.moveColumnLeft(column.name)
    open = false
  }

  const moveRight = () => {
    reorder.actions.moveColumnRight(column.name)
    open = false
  }

  const makeDisplayColumn = () => {
    columns.actions.changePrimaryDisplay(column.name)
    open = false
  }

  const hideColumn = () => {
    columns.update(state => {
      const index = state.findIndex(col => col.name === column.name)
      state[index].visible = false
      return state.slice()
    })
    columns.actions.saveChanges()
    open = false
  }
</script>

<div
  class="header-cell"
  class:open
  style="flex: 0 0 {column.width}px;"
  bind:this={anchor}
  class:disabled={$isReordering || $isResizing}
  class:sticky={idx === "sticky"}
>
  <GridCell
    on:mousedown={onMouseDown}
    on:mouseup={onMouseUp}
    on:contextmenu={onContextMenu}
    width={column.width}
    left={column.left}
    defaultHeight
    center
  >
    <Icon
      size="S"
      name={getColumnIcon(column)}
      color={`var(--spectrum-global-color-gray-600)`}
    />
    <div class="name">
      {column.label}
    </div>
    {#if sortedBy}
      <div class="sort-indicator">
        <Icon
          size="S"
          name={$sort.order === "descending" ? "SortOrderDown" : "SortOrderUp"}
          color="var(--spectrum-global-color-gray-600)"
        />
      </div>
    {/if}
    <div class="more" on:click={() => (open = true)}>
      <Icon
        size="S"
        name="MoreVertical"
        color="var(--spectrum-global-color-gray-600)"
      />
    </div>
  </GridCell>
</div>

<Popover
  bind:open
  {anchor}
  align="right"
  offset={0}
  popoverTarget={document.getElementById(`grid-${rand}`)}
  animate={false}
>
  <Menu>
    <MenuItem
      icon="Edit"
      on:click={editColumn}
      disabled={!$config.allowEditColumns || column.schema.disabled}
    >
      Edit column
    </MenuItem>
    <MenuItem
      icon="Label"
      on:click={makeDisplayColumn}
      disabled={idx === "sticky" ||
        !$config.allowEditColumns ||
        bannedDisplayColumnTypes.includes(column.schema.type)}
    >
      Use as display column
    </MenuItem>
    <MenuItem
      icon="SortOrderUp"
      on:click={sortAscending}
      disabled={column.name === $sort.column && $sort.order === "ascending"}
    >
      Sort {ascendingLabel}
    </MenuItem>
    <MenuItem
      icon="SortOrderDown"
      on:click={sortDescending}
      disabled={column.name === $sort.column && $sort.order === "descending"}
    >
      Sort {descendingLabel}
    </MenuItem>
    <MenuItem disabled={!canMoveLeft} icon="ChevronLeft" on:click={moveLeft}>
      Move left
    </MenuItem>
    <MenuItem disabled={!canMoveRight} icon="ChevronRight" on:click={moveRight}>
      Move right
    </MenuItem>
    <MenuItem
      disabled={idx === "sticky"}
      icon="VisibilityOff"
      on:click={hideColumn}>Hide column</MenuItem
    >
  </Menu>
</Popover>

<style>
  .header-cell {
    display: flex;
  }
  .header-cell:not(.sticky):hover,
  .header-cell:not(.sticky) :global(.cell:hover) {
    cursor: grab;
  }
  .header-cell.disabled {
    pointer-events: none;
  }
  .header-cell :global(.cell) {
    padding: 0 var(--cell-padding);
    gap: calc(2 * var(--cell-spacing));
    background: var(--spectrum-global-color-gray-100);
  }

  .name {
    flex: 1 1 auto;
    width: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .more {
    display: none;
    padding: 4px;
    margin: 0 -4px;
  }
  .header-cell.open .more,
  .header-cell:hover .more {
    display: block;
  }
  .more:hover {
    cursor: pointer;
  }
  .more:hover :global(.spectrum-Icon) {
    color: var(--spectrum-global-color-gray-800) !important;
  }

  .header-cell.open .sort-indicator,
  .header-cell:hover .sort-indicator {
    display: none;
  }
</style>
