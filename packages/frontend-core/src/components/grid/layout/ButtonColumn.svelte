<script>
  import { getContext, onMount } from "svelte"
  import { Button } from "@budibase/bbui"
  import GridCell from "../cells/GridCell.svelte"
  import GridScrollWrapper from "./GridScrollWrapper.svelte"
  import { BlankRowID } from "../lib/constants"

  const {
    renderedRows,
    hoveredRowId,
    props,
    width,
    rows,
    focusedRow,
    selectedRows,
    scrollableColumns,
    scrollLeft,
    isDragging,
    buttonColumnWidth,
    showVScrollbar,
    showHScrollbar,
    dispatch,
    config,
  } = getContext("grid")

  let container

  $: buttons = $props.buttons?.slice(0, 3) || []
  $: columnsWidth = $scrollableColumns.reduce(
    (total, col) => (total += col.width),
    0
  )
  $: columnEnd = columnsWidth - $scrollLeft - 1
  $: gridEnd = $width - $buttonColumnWidth - 1
  $: left = Math.min(columnEnd, gridEnd)

  const handleClick = async (e, button, row) => {
    await button.onClick?.(
      e,
      rows.actions.cleanRow(row),
      async () => await rows.actions.refreshRow(row._id)
    )
  }

  onMount(() => {
    const observer = new ResizeObserver(entries => {
      const width = entries?.[0]?.contentRect?.width ?? 0
      buttonColumnWidth.set(Math.floor(width) - 1)
    })
    observer.observe(container)
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="button-column"
  style="left:{left}px"
  class:hidden={$buttonColumnWidth === 0}
  class:right-border={left !== gridEnd}
>
  <div class="content" on:mouseleave={() => ($hoveredRowId = null)}>
    <GridScrollWrapper scrollVertically attachHandlers bind:ref={container}>
      {#each $renderedRows as row}
        {@const rowSelected = !!$selectedRows[row._id]}
        {@const rowHovered = $hoveredRowId === row._id}
        {@const rowFocused = $focusedRow?._id === row._id}
        <div
          class="row"
          on:mouseenter={$isDragging ? null : () => ($hoveredRowId = row._id)}
          on:mouseleave={$isDragging ? null : () => ($hoveredRowId = null)}
        >
          <GridCell
            width="auto"
            rowIdx={row.__idx}
            selected={rowSelected}
            highlighted={rowHovered || rowFocused}
            metadata={row.__metadata?.row}
          >
            <div
              class="buttons"
              class:offset={$showVScrollbar && $showHScrollbar}
            >
              {#each buttons as button}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <span on:click={e => handleClick(e, button, row)}>
                  <Button
                    newStyles
                    size="S"
                    icon={button.icon}
                    cta={button.type === "cta"}
                    primary={button.type === "primary"}
                    secondary={button.type === "secondary"}
                    warning={button.type === "warning"}
                    overBackground={button.type === "overBackground"}
                  >
                    {#if button.icon}
                      <i class="{button.icon} S" />
                    {/if}
                    {button.text || "Button"}
                  </Button>
                </span>
              {/each}
            </div>
          </GridCell>
        </div>
      {/each}
      {#if $config.canAddRows}
        <div
          class="row blank"
          on:mouseenter={$isDragging
            ? null
            : () => ($hoveredRowId = BlankRowID)}
          on:mouseleave={$isDragging ? null : () => ($hoveredRowId = null)}
        >
          <GridCell
            width={$buttonColumnWidth}
            highlighted={$hoveredRowId === BlankRowID}
            on:click={() => dispatch("add-row-inline")}
          />
        </div>
      {/if}
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
  .buttons.offset {
    padding-right: calc(var(--cell-padding) + 2 * var(--scroll-bar-size) - 2px);
  }
  .buttons :global(.spectrum-Button-Label) {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .blank :global(.cell:hover) {
    cursor: pointer;
  }

  /* Add left cell border to all cells */
  .button-column :global(.cell) {
    border-left: var(--cell-border);
  }
  .button-column:not(.right-border) :global(.cell) {
    border-right-color: transparent;
  }
</style>
