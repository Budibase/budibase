<script>
  import { getContext } from "svelte"
  import { ActionButton, Popover, Label } from "@budibase/bbui"
  import {
    DefaultColumnWidth,
    LargeRowHeight,
    MediumRowHeight,
    SmallRowHeight,
  } from "../lib/constants"

  const {
    stickyColumn,
    columns,
    rowHeight,
    definition,
    fixedRowHeight,
    datasource,
  } = getContext("grid")

  // Some constants for column width options
  const smallColSize = 120
  const mediumColSize = DefaultColumnWidth
  const largeColSize = DefaultColumnWidth * 1.5

  // Row height sizes
  const rowSizeOptions = [
    {
      label: "Small",
      size: SmallRowHeight,
    },
    {
      label: "Medium",
      size: MediumRowHeight,
    },
    {
      label: "Large",
      size: LargeRowHeight,
    },
  ]

  let open = false
  let anchor

  // Column width sizes
  $: allCols = $columns.concat($stickyColumn ? [$stickyColumn] : [])
  $: allSmall = allCols.every(col => col.width === smallColSize)
  $: allMedium = allCols.every(col => col.width === mediumColSize)
  $: allLarge = allCols.every(col => col.width === largeColSize)
  $: custom = !allSmall && !allMedium && !allLarge
  $: columnSizeOptions = [
    {
      label: "Small",
      size: smallColSize,
      selected: allSmall,
    },
    {
      label: "Medium",
      size: mediumColSize,
      selected: allMedium,
    },
    {
      label: "Large",
      size: largeColSize,
      selected: allLarge,
    },
  ]

  const changeRowHeight = height => {
    datasource.actions.saveDefinition({
      ...$definition,
      rowHeight: height,
    })
  }
</script>

<div bind:this={anchor}>
  <ActionButton
    icon="MoveUpDown"
    quiet
    size="M"
    on:click={() => (open = !open)}
    selected={open}
    disabled={!allCols.length}
  >
    Size
  </ActionButton>
</div>

<Popover bind:open {anchor} align="left">
  <div class="content">
    <div class="size">
      <Label>Row height</Label>
      <div class="options">
        {#each rowSizeOptions as option}
          <ActionButton
            disabled={$fixedRowHeight}
            quiet
            selected={$rowHeight === option.size}
            on:click={() => changeRowHeight(option.size)}
          >
            {option.label}
          </ActionButton>
        {/each}
      </div>
    </div>
    <div class="size">
      <Label>Column width</Label>
      <div class="options">
        {#each columnSizeOptions as option}
          <ActionButton
            quiet
            on:click={() => columns.actions.changeAllColumnWidths(option.size)}
            selected={option.selected}
          >
            {option.label}
          </ActionButton>
        {/each}
        {#if custom}
          <ActionButton selected={custom} quiet>Custom</ActionButton>
        {/if}
      </div>
    </div>
  </div>
</Popover>

<style>
  .content {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .size {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .options {
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
