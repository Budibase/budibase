<script>
  import { getContext } from "svelte"
  import { ActionButton, Popover } from "@budibase/bbui"
  import { DefaultColumnWidth } from "../lib/constants"

  const { stickyColumn, columns, compact } = getContext("grid")
  const smallSize = 120
  const mediumSize = DefaultColumnWidth
  const largeSize = DefaultColumnWidth * 1.5

  let open = false
  let anchor

  $: allCols = $columns.concat($stickyColumn ? [$stickyColumn] : [])
  $: allSmall = allCols.every(col => col.width === smallSize)
  $: allMedium = allCols.every(col => col.width === mediumSize)
  $: allLarge = allCols.every(col => col.width === largeSize)
  $: custom = !allSmall && !allMedium && !allLarge
  $: sizeOptions = [
    {
      label: "Small",
      size: smallSize,
      selected: allSmall,
    },
    {
      label: "Medium",
      size: mediumSize,
      selected: allMedium,
    },
    {
      label: "Large",
      size: largeSize,
      selected: allLarge,
    },
  ]

  const changeColumnWidth = async width => {
    columns.update(state => {
      state.forEach(column => {
        column.width = width
      })
      return state
    })
    if ($stickyColumn) {
      stickyColumn.update(state => ({
        ...state,
        width,
      }))
    }
    await columns.actions.saveChanges()
  }
</script>

<div bind:this={anchor}>
  <ActionButton
    icon="MoveLeftRight"
    quiet
    size="M"
    on:click={() => (open = !open)}
    selected={open}
    disabled={!allCols.length}
    tooltip={$compact ? "Width" : null}
  >
    {$compact ? "" : "Width"}
  </ActionButton>
</div>

<Popover bind:open {anchor} align={$compact ? "right" : "left"}>
  <div class="content">
    {#each sizeOptions as option}
      <ActionButton
        quiet
        on:click={() => changeColumnWidth(option.size)}
        selected={option.selected}
      >
        {option.label}
      </ActionButton>
    {/each}
    {#if custom}
      <ActionButton selected={custom} quiet>Custom</ActionButton>
    {/if}
  </div>
</Popover>

<style>
  .content {
    padding: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
