<script>
  import { getContext, onMount } from "svelte"
  import { Icon, Popover, clickOutside } from "@budibase/bbui"

  const { renderedColumns, scroll, hiddenColumnsWidth, width, subscribe } =
    getContext("grid")

  let anchor
  let open = false

  $: columnsWidth = $renderedColumns.reduce(
    (total, col) => (total += col.width),
    0
  )
  $: end = $hiddenColumnsWidth + columnsWidth - 1 - $scroll.left
  $: left = Math.min($width - 40, end)

  const close = () => {
    open = false
  }

  onMount(() => subscribe("close-edit-column", close))
</script>

<div
  id="add-column-button"
  bind:this={anchor}
  class="add"
  style="left:{left}px"
  on:click={() => (open = true)}
>
  <Icon name="Add" />
</div>
<Popover
  bind:open
  {anchor}
  align={$renderedColumns.length ? "right" : "left"}
  offset={0}
  popoverTarget={document.getElementById(`add-column-button`)}
  customZindex={100}
>
  <div
    use:clickOutside={() => {
      open = false
    }}
    class="content"
  >
    <slot />
  </div>
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

  .content {
    width: 300px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    z-index: 2;
    background: var(--spectrum-alias-background-color-secondary);
  }
</style>
