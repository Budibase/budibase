<script>
  import { getContext } from "svelte"
  import GridScrollWrapper from "./GridScrollWrapper.svelte"
  import HeaderCell from "../cells/HeaderCell.svelte"
  import { Icon, Popover } from "@budibase/bbui"
  import ColumnConfiguration from "./ColumnConfiguration.svelte"

  const { renderedColumns, scroll, hiddenColumnsWidth, width } =
    getContext("grid")

  let anchor
  let open = false
  $: columnsWidth = $renderedColumns.reduce(
    (total, col) => (total += col.width),
    0
  )
  $: end = $hiddenColumnsWidth + columnsWidth - 1 - $scroll.left
  $: left = Math.min($width - 40, end)
</script>

<div>
  <div
    id="add-column-button"
    bind:this={anchor}
    class="add"
    style="left:{left}px"
    on:click={() => (open = true)}
  >
    <Icon name="Add" />
  </div>
</div>
<Popover
  bind:open
  {anchor}
  align="right"
  offset={0}
  popoverTarget={document.getElementById(`add-column-button`)}
  animate={false}
>
  <ColumnConfiguration />
</Popover>

<style>
  .add {
    height: var(--default-row-height);
    display: grid;
    place-items: center;
    width: 40px;
    position: absolute;
    top: 0;
    border-left: var(--cell-border);
    border-right: var(--cell-border);
    border-bottom: var(--cell-border);
    background: var(--grid-background-alt);
    z-index: 1;
  }
  .add:hover {
    background: var(--spectrum-global-color-gray-200);
    cursor: pointer;
  }
</style>
