<script>
  import { getContext } from "svelte"
  import { ActionButton, Label } from "@budibase/bbui"
  import DetailPopover from "@/components/common/DetailPopover.svelte"

  const {
    Constants,
    columns,
    rowHeight,
    definition,
    fixedRowHeight,
    datasource,
  } = getContext("grid")

  // Some constants for column width options
  const smallColSize = 120
  const mediumColSize = Constants.DefaultColumnWidth
  const largeColSize = Constants.DefaultColumnWidth * 1.5

  // Row height sizes
  const rowSizeOptions = [
    {
      label: "Small",
      size: Constants.SmallRowHeight,
    },
    {
      label: "Medium",
      size: Constants.MediumRowHeight,
    },
    {
      label: "Large",
      size: Constants.LargeRowHeight,
    },
  ]

  let popover

  // Column width sizes
  $: allSmall = $columns.every(col => col.width === smallColSize)
  $: allMedium = $columns.every(col => col.width === mediumColSize)
  $: allLarge = $columns.every(col => col.width === largeColSize)
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

<DetailPopover bind:this={popover} title="Column and row size" width={300}>
  <svelte:fragment slot="anchor" let:open>
    <ActionButton
      icon="MoveUpDown"
      quiet
      size="M"
      on:click={popover?.open}
      selected={open}
      disabled={!$columns.length}
    >
      Size
    </ActionButton>
  </svelte:fragment>
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
</DetailPopover>

<style>
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
