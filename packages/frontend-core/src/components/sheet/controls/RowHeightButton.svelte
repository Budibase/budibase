<script>
  import { getContext } from "svelte"
  import { ActionButton, Popover } from "@budibase/bbui"

  const { rowHeight } = getContext("sheet")
  const sizeOptions = [
    {
      label: "Small",
      size: 36,
    },
    {
      label: "Medium",
      size: 54,
    },
    {
      label: "Large",
      size: 72,
    },
  ]

  let open = false
  let anchor
</script>

<div bind:this={anchor}>
  <ActionButton
    icon="LineHeight"
    quiet
    size="M"
    on:click={() => (open = !open)}
    selected={open}
  >
    Row height
  </ActionButton>
</div>

<Popover bind:open {anchor} align="left">
  <div class="content">
    {#each sizeOptions as option}
      <ActionButton
        quiet
        selected={$rowHeight === option.size}
        on:click={() => rowHeight.set(option.size)}
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
