<script>
  import { getContext, onMount } from "svelte"
  import { Button } from "@budibase/bbui"
  import GridCell from "../cells/GridCell.svelte"
  import GridScrollWrapper from "./GridScrollWrapper.svelte"

  const {
    renderedRows,
    hoveredRowId,
    props,
    width,
    rows,
    focusedRow,
    selectedRows,
    visibleColumns,
    scroll,
    isDragging,
    buttonColumnWidth,
  } = getContext("grid")

  let measureContainer

  $: buttons = $props.buttons?.slice(0, 3) || []
  $: columnsWidth = $visibleColumns.reduce(
    (total, col) => (total += col.width),
    0
  )
  $: end = columnsWidth - 1 - $scroll.left
  $: left = Math.min($width - $buttonColumnWidth, end)

  const handleClick = async (button, row) => {
    await button.onClick?.(rows.actions.cleanRow(row))
    // Refresh the row in case it changed
    await rows.actions.refreshRow(row._id)
  }

  onMount(() => {
    const observer = new ResizeObserver(entries => {
      const width = entries?.[0]?.contentRect?.width ?? 0
      buttonColumnWidth.set(width)
    })
    observer.observe(measureContainer)
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="button-column"
  style="left:{left}px"
  class:hidden={$buttonColumnWidth === 0}
>
  <div class="content" on:mouseleave={() => ($hoveredRowId = null)}>
    <GridScrollWrapper scrollVertically attachHandlers>
      {#each $renderedRows as row}
        {@const rowSelected = !!$selectedRows[row._id]}
        {@const rowHovered = $hoveredRowId === row._id}
        {@const rowFocused = $focusedRow?._id === row._id}
        <div
          class="row"
          on:mouseenter={$isDragging ? null : () => ($hoveredRowId = row._id)}
          on:mouseleave={$isDragging ? null : () => ($hoveredRowId = null)}
          bind:this={measureContainer}
        >
          <GridCell
            width="auto"
            rowIdx={row.__idx}
            selected={rowSelected}
            highlighted={rowHovered || rowFocused}
          >
            <div class="buttons">
              {#each buttons as button}
                <Button
                  newStyles
                  size="S"
                  cta={button.type === "cta"}
                  primary={button.type === "primary"}
                  secondary={button.type === "secondary"}
                  warning={button.type === "warning"}
                  overBackground={button.type === "overBackground"}
                  on:click={() => handleClick(button, row)}
                >
                  {#if button.icon}
                    <i class="{button.icon} S" />
                  {/if}
                  {button.text || "Button"}
                </Button>
              {/each}
            </div>
          </GridCell>
        </div>
      {/each}
    </GridScrollWrapper>
  </div>
</div>

<style>
  .button-column {
    display: flex;
    flex-direction: column;
    background: var(--cell-background);
    position: absolute;
    top: 0;
  }
  .button-column.hidden {
    opacity: 0;
  }
  .content {
    position: relative;
    flex: 1 1 auto;
  }
  .row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
  }
  .buttons {
    display: flex;
    align-items: center;
    padding: 0 var(--cell-padding);
    gap: var(--cell-padding);
    height: inherit;
  }
  .buttons :global(.spectrum-Button-Label) {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* Add left cell border */
  .button-column :global(.cell) {
    border-left: var(--cell-border);
  }
</style>
