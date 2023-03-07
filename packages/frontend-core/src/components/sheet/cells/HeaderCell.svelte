<script>
  import { getContext } from "svelte"
  import SheetCell from "./SheetCell.svelte"
  import { Icon, Popover, Menu, MenuItem } from "@budibase/bbui"
  import { getIconForField } from "../utils"

  export let column
  export let orderable = true

  const { reorder, isReordering, isResizing, rand, sort, columns } =
    getContext("sheet")

  let anchor
  let open = false
  let timeout

  $: sortedBy = column.name === $sort.column
  $: canMoveLeft = orderable && column.idx > 0
  $: canMoveRight = orderable && column.idx < $columns.length - 1

  const startReordering = e => {
    timeout = setTimeout(() => {
      reorder.actions.startReordering(column.name, e)
    }, 200)
  }

  const stopReordering = () => {
    clearTimeout(timeout)
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
</script>

<div
  class="header-cell"
  class:open
  style="flex: 0 0 {column.width}px;"
  bind:this={anchor}
  class:disabled={$isReordering || $isResizing}
  class:sorted={sortedBy}
>
  <SheetCell
    reorderSource={$reorder.sourceColumn === column.name}
    reorderTarget={$reorder.targetColumn === column.name}
    on:mousedown={orderable ? startReordering : null}
    on:mouseup={orderable ? stopReordering : null}
    width={column.width}
    left={column.left}
  >
    <Icon
      size="S"
      name={getIconForField(column)}
      color={`var(--spectrum-global-color-gray-600)`}
    />
    <div class="name">
      {column.name}
    </div>
    <div
      class="more"
      on:mousedown|stopPropagation
      on:click={() => (open = true)}
    >
      <Icon
        size="S"
        name="MoreVertical"
        color={`var(--spectrum-global-color-gray-600)`}
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
    <MenuItem icon="Edit">Edit column</MenuItem>
    <MenuItem icon="SortOrderUp" on:click={sortAscending}>
      Sort ascending
    </MenuItem>
    <MenuItem icon="SortOrderDown" on:click={sortDescending}>
      Sort descending
    </MenuItem>
    <MenuItem disabled={!canMoveLeft} icon="ArrowLeft" on:click={moveLeft}>
      Move left
    </MenuItem>
    <MenuItem disabled={!canMoveRight} icon="ArrowRight" on:click={moveRight}>
      Move right
    </MenuItem>
    <MenuItem icon="Delete">Delete</MenuItem>
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
    border-bottom: none;
  }
  .header-cell.sorted :global(.cell) {
  }

  .name {
    flex: 1 1 auto;
    width: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .more {
    padding: 4px;
    margin: 0 -4px;
  }
  .more:hover {
    cursor: pointer;
  }
  .more:hover :global(.spectrum-Icon) {
    color: var(--spectrum-global-color-gray-800) !important;
  }
</style>
