<script>
  import { getContext, onMount } from "svelte"
  import GridScrollWrapper from "./GridScrollWrapper.svelte"
  import GridRow from "./GridRow.svelte"
  import { BlankRowID } from "../lib/constants"
  import ButtonColumn from "./ButtonColumn.svelte"

  const {
    bounds,
    renderedRows,
    visibleColumns,
    hoveredRowId,
    dispatch,
    isDragging,
    config,
    props,
  } = getContext("grid")

  let body

  $: columnsWidth = $visibleColumns.reduce(
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
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div bind:this={body} class="grid-body">
  <GridScrollWrapper scrollHorizontally scrollVertically attachHandlers>
    {#each $renderedRows as row, idx}
      <GridRow {row} top={idx === 0} />
    {/each}
    {#if $config.canAddRows}
      <div
        class="blank"
        class:highlighted={$hoveredRowId === BlankRowID}
        style="width:{columnsWidth}px"
        on:mouseenter={$isDragging ? null : () => ($hoveredRowId = BlankRowID)}
        on:mouseleave={$isDragging ? null : () => ($hoveredRowId = null)}
        on:click={() => dispatch("add-row-inline")}
      />
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
  .blank {
    height: var(--row-height);
    background: var(--cell-background);
    border-bottom: var(--cell-border);
    border-right: var(--cell-border);
    position: absolute;
  }
  .blank.highlighted {
    background: var(--cell-background-hover);
    cursor: pointer;
  }
</style>
