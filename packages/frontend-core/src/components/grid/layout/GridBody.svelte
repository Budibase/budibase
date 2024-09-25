<script>
  import { getContext, onMount } from "svelte"
  import GridScrollWrapper from "./GridScrollWrapper.svelte"
  import GridRow from "./GridRow.svelte"
  import GridCell from "../cells/GridCell.svelte"
  import { BlankRowID } from "../lib/constants"
  import ButtonColumn from "./ButtonColumn.svelte"

  const {
    bounds,
    renderedRows,
    scrollableColumns,
    hoveredRowId,
    dispatch,
    isDragging,
    config,
    props,
  } = getContext("grid")

  let body

  $: columnsWidth = $scrollableColumns.reduce(
    (total, col) => (total += col.width),
    0
  )

  const updateBounds = () => {
    bounds.set(body.getBoundingClientRect())
  }

  onMount(() => {
    // Observe and record the height of the body
    const resizeObserver = new ResizeObserver(updateBounds)
    resizeObserver.observe(body)

    // Capture any wheel events on the page to ensure our scroll offset is
    // correct. We don't care about touch events as we only need this for
    // hovering over rows with a mouse.
    window.addEventListener("wheel", updateBounds, true)

    // Clean up listeners
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("wheel", updateBounds, true)
    }
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div bind:this={body} class="grid-body">
  <GridScrollWrapper scrollHorizontally scrollVertically attachHandlers>
    {#each $renderedRows as row, idx}
      <GridRow {row} top={idx === 0} />
    {/each}
    {#if $config.canAddRows}
      <div
        class="row blank"
        on:mouseenter={$isDragging ? null : () => ($hoveredRowId = BlankRowID)}
        on:mouseleave={$isDragging ? null : () => ($hoveredRowId = null)}
      >
        <GridCell
          width={columnsWidth}
          highlighted={$hoveredRowId === BlankRowID}
          on:click={() => dispatch("add-row-inline")}
        />
      </div>
    {/if}
  </GridScrollWrapper>
  {#if $props.buttons?.length}
    <ButtonColumn />
  {/if}
</div>

<style>
  .grid-body {
    display: block;
    position: relative;
    cursor: default;
    overflow: hidden;
    flex: 1 1 auto;
  }
  .row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
  }
  .blank :global(.cell:hover) {
    cursor: pointer;
  }
</style>
