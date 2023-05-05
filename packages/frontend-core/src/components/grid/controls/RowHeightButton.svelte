<script>
  import { getContext } from "svelte"
  import { ActionButton, Popover } from "@budibase/bbui"
  import {
    LargeRowHeight,
    MediumRowHeight,
    SmallRowHeight,
  } from "../lib/constants"

  const { rowHeight, columns, table, compact } = getContext("grid")
  const sizeOptions = [
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

  const changeRowHeight = height => {
    columns.actions.saveTable({
      ...$table,
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
    tooltip={$compact ? "Height" : null}
  >
    {$compact ? "" : "Height"}
  </ActionButton>
</div>

<Popover bind:open {anchor} align={$compact ? "right" : "left"}>
  <div class="content">
    {#each sizeOptions as option}
      <ActionButton
        quiet
        selected={$rowHeight === option.size}
        on:click={() => changeRowHeight(option.size)}
      >
        {option.label}
      </ActionButton>
    {/each}
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
