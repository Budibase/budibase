<script>
  import { getContext } from "svelte"
  import SheetCell from "./SheetCell.svelte"
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
    table,
    rows,
    API,
  } = getContext("sheet")

  let anchor
  let open = false
  let timeout

  $: sortedBy = column.name === $sort.column
  $: canMoveLeft = orderable && idx > 0
  $: canMoveRight = orderable && idx < $renderedColumns.length - 1

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

  const makeDisplayColumn = async () => {
    const tableDefinition = $table
    if (!tableDefinition) {
      return
    }
    await API.saveTable({
      ...tableDefinition,
      primaryDisplay: column.name,
    })
    await rows.actions.refreshTableDefinition()
    open = false
  }
</script>

<div
  class="header-cell"
  class:open
  style="flex: 0 0 {column.width}px"
  bind:this={anchor}
  class:disabled={$isReordering || $isResizing}
  class:sorted={sortedBy}
>
  <SheetCell
    reorderSource={$reorder.sourceColumn === column.name}
    reorderTarget={$reorder.targetColumn === column.name}
    on:mousedown={onMouseDown}
    on:mouseup={onMouseUp}
    on:contextmenu={onContextMenu}
    width={column.width}
    left={column.left}
  >
    <Icon
      size="S"
      name={getColumnIcon(column)}
      color={`var(--spectrum-global-color-gray-600)`}
    />
    <div class="name">
      {column.name}
    </div>
    {#if sortedBy}
      <div class="sort-indicator">
        <Icon
          size="S"
          name={$sort.order === "descending" ? "ChevronDown" : "ChevronUp"}
          color="var(--spectrum-global-color-gray-600)"
        />
      </div>
    {/if}
    <div
      class="more"
      on:mousedown|stopPropagation
      on:click={() => (open = true)}
    >
      <Icon
        size="S"
        name="MoreVertical"
        color="var(--spectrum-global-color-gray-600)"
      />
    </div>
  </SheetCell>
</div>

<Popover
  bind:open
  {anchor}
  align="right"
  offset={0}
  popoverTarget={document.getElementById(`sheet-${rand}`)}
  animate={false}
>
  <Menu>
    {#if $config.allowEditColumns}
      <MenuItem icon="Edit" on:click={editColumn}>Edit column</MenuItem>
    {/if}
    <MenuItem icon="SortOrderUp" on:click={sortAscending}>Sort A-Z</MenuItem>
    <MenuItem icon="SortOrderDown" on:click={sortDescending}>Sort Z-A</MenuItem>
    <MenuItem disabled={!canMoveLeft} icon="ArrowLeft" on:click={moveLeft}>
      Move left
    </MenuItem>
    <MenuItem disabled={!canMoveRight} icon="ArrowRight" on:click={moveRight}>
      Move right
    </MenuItem>
    <MenuItem
      icon="Label"
      on:click={makeDisplayColumn}
      disabled={column.idx === "sticky"}
    >
      Use as display column
    </MenuItem>
  </Menu>
</Popover>

<style>
  .header-cell {
    display: flex;
  }
  .header-cell :global(.cell) {
    background: var(--background);
    padding: 0 var(--cell-padding);
    gap: calc(2 * var(--cell-spacing));
  }
  .header-cell.sorted :global(.cell) {
    background: var(--spectrum-global-color-gray-200);
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
