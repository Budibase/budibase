<script>
  import { getContext, onMount } from "svelte"
  import { Button, CollapsedButtonGroup } from "@budibase/bbui"
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
    metadata,
  } = getContext("grid")

  let container

  $: buttons = getButtons($props)
  $: columnsWidth = $scrollableColumns.reduce(
    (total, col) => (total += col.width),
    0
  )
  $: columnEnd = columnsWidth - $scrollLeft - 1
  $: gridEnd = $width - $buttonColumnWidth - 1
  $: left = Math.min(columnEnd, gridEnd)

  const getButtons = ({ buttons, buttonsCollapsed }) => {
    let gridButtons = buttons || []
    if (!buttonsCollapsed) {
      return gridButtons.slice(0, 3)
    }
    return gridButtons
  }

  // Apply button conditions and return filtered/modified buttons for a specific row
  const getButtonsForRow = (buttons, row) => {
    if (!buttons || !row) return buttons

    const rowMetadata = $metadata?.[row._id]?.button || {}

    return buttons
      .map((button, index) => {
        const buttonMetadata = rowMetadata[index]
        if (!buttonMetadata) return button

        // Skip hidden buttons
        if (buttonMetadata.hidden) return null

        // Apply any setting updates
        return {
          ...button,
          ...buttonMetadata,
        }
      })
      .filter(button => button !== null)
  }

  const handleClick = async (button, row) => {
    await button.onClick?.(rows.actions.cleanRow(row))
    await rows.actions.refreshRow(row._id)
  }

  const makeCollapsedButtons = (buttons, row) => {
    return buttons.map(button => ({
      ...button,
      onClick: () => handleClick(button, row),
    }))
  }

  onMount(() => {
    const observer = new ResizeObserver(entries => {
      const width = entries?.[0]?.contentRect?.width ?? 0
      buttonColumnWidth.set(width - 1)
    })
    observer.observe(container)
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="button-column"
  style="left:{left}px"
  class:hidden={$buttonColumnWidth === 0}
>
  <div class="content" on:mouseleave={() => ($hoveredRowId = null)}>
    <GridScrollWrapper scrollVertically attachHandlers bind:ref={container}>
      {#each $renderedRows as row}
        {@const rowSelected = !!$selectedRows[row._id]}
        {@const rowHovered = $hoveredRowId === row._id}
        {@const rowFocused = $focusedRow?._id === row._id}
        {@const rowButtons = getButtonsForRow(buttons, row)}
        <div
          class="row"
          on:mouseenter={$isDragging ? null : () => ($hoveredRowId = row._id)}
          on:mouseleave={$isDragging ? null : () => ($hoveredRowId = null)}
        >
          <GridCell
            width="100%"
            rowIdx={row.__idx}
            selected={rowSelected}
            highlighted={rowHovered || rowFocused}
            metadata={row.__metadata?.row}
          >
            <div
              class="buttons"
              class:offset={$showVScrollbar && $showHScrollbar}
            >
              {#if $props.buttonsCollapsed}
                {#if rowButtons.length > 0}
                  <CollapsedButtonGroup
                    buttons={makeCollapsedButtons(rowButtons, row)}
                    text={$props.buttonsCollapsedText || "Action"}
                    align="right"
                    offset={5}
                    size="S"
                    animate={false}
                    on:mouseenter={() => ($hoveredRowId = row._id)}
                  />
                {:else}
                  <div class="button-placeholder-collapsed" />
                {/if}
              {:else}
                {#each rowButtons as button}
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
                {#if rowButtons.length === 0}
                  <div class="button-placeholder" />
                {/if}
              {/if}
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
            width="100%"
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
  .button-placeholder {
    min-width: 60px;
    height: 32px;
  }
  .button-placeholder-collapsed {
    min-width: 70px;
    height: 32px;
    visibility: hidden;
  }
  .blank :global(.cell:hover) {
    cursor: pointer;
  }

  /* Add left cell border to all cells */
  .button-column :global(.cell) {
    border-left: var(--cell-border);
  }
</style>
