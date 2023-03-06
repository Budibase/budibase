<script>
  import { getContext } from "svelte"
  import SheetCell from "./SheetCell.svelte"
  import { Icon, Popover } from "@budibase/bbui"
  import { getIconForField } from "../utils"

  export let column

  const { reorder } = getContext("sheet")

  let popover
  let anchor

  const openPopover = () => {
    console.log("open")
    popover.show()
  }
</script>

<div class="header-cell" bind:this={anchor}>
  <SheetCell
    reorderSource={$reorder.sourceColumn === column.name}
    reorderTarget={$reorder.targetColumn === column.name}
    on:mousedown={e => reorder.actions.startReordering(column.name, e)}
    on:click={openPopover}
    width={column.width}
    left={column.left}
  >
    <div class="content">
      <Icon
        size="S"
        name={getIconForField(column)}
        color="var(--spectrum-global-color-gray-600)"
      />
      <div class="name">
        {column.name} asdasdasd asdasdas asdasdasd
      </div>
      <div class="more">
        <Icon size="S" name="MoreVertical" />
      </div>
    </div>
  </SheetCell>
</div>

<Popover bind:this={popover} {anchor} align="left"
  >asdsad asdasd asdasd asasa</Popover
>

<style>
  .header-cell {
    display: contents;
  }
  .header-cell:hover :global(.cell) {
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
  .header-cell:hover .more {
    display: block;
  }
</style>
