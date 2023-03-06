<script>
  import { getContext } from "svelte"
  import SheetCell from "./SheetCell.svelte"
  import { Icon, Popover, Menu, MenuItem } from "@budibase/bbui"
  import { getIconForField } from "../utils"

  export let column
  export let orderable = true

  const { reorder, isReordering, rand } = getContext("sheet")

  let timeout
  let anchor
  let open = false
  let isClick = true

  const startReordering = e => {
    isClick = true
    timeout = setTimeout(() => {
      isClick = false
      reorder.actions.startReordering(column.name, e)
    }, 250)
  }

  const stopReordering = () => {
    clearTimeout(timeout)
  }

  const onClick = () => {
    if (isClick) {
      stopReordering()
      open = true
    }
  }
</script>

<div
  class="header-cell"
  class:open
  style="flex: 0 0 {column.width}px;"
  bind:this={anchor}
  class:disabled={$isReordering}
>
  <SheetCell
    reorderSource={$reorder.sourceColumn === column.name}
    reorderTarget={$reorder.targetColumn === column.name}
    on:mousedown={orderable ? startReordering : null}
    on:mouseup={orderable ? stopReordering : null}
    on:click={onClick}
    width={column.width}
    left={column.left}
  >
    <Icon
      size="S"
      name={getIconForField(column)}
      color="var(--spectrum-global-color-gray-600)"
    />
    <div class="name">
      {column.name}
    </div>
    <div class="more">
      <Icon size="S" name="MoreVertical" />
    </div>
  </SheetCell>
</div>

<Popover
  bind:open
  {anchor}
  align="left"
  offset={0}
  popoverTarget={document.getElementById(`sheet-${rand}`)}
  animate={false}
>
  <Menu>
    <MenuItem icon="Edit">Edit column</MenuItem>
    <MenuItem icon="SortOrderUp">Sort ascending</MenuItem>
    <MenuItem icon="SortOrderDown">Sort descending</MenuItem>
    {#if orderable}
      <MenuItem icon="ArrowLeft">Move left</MenuItem>
      <MenuItem icon="ArrowRight">Move right</MenuItem>
    {/if}
    <MenuItem icon="Delete">Delete</MenuItem>
  </Menu>
</Popover>

<style>
  .header-cell {
    display: flex;
  }
  .header-cell:not(.disabled):hover :global(.cell),
  .header-cell:not(.disabled).open :global(.cell) {
    cursor: pointer;
    background: var(--spectrum-global-color-gray-200);
  }
  .header-cell :global(.cell) {
    background: var(--background);
    padding: 0 var(--cell-padding);
    gap: calc(2 * var(--cell-spacing));
    border-bottom: none;
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
  }
  .header-cell:not(.disabled):hover .more,
  .header-cell:not(.disabled).open .more {
    display: block;
  }
</style>
