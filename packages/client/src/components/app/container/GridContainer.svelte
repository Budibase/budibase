<script>
  import { getContext, onMount } from "svelte"
  import { writable } from "svelte/store"
  import { GridRowHeight, GridColumns } from "constants"
  import { memo } from "@budibase/frontend-core"

  export let onClick

  const component = getContext("component")
  const { styleable, builderStore } = getContext("sdk")
  const context = getContext("context")

  let width
  let height
  let ref
  let children = writable({})
  let mounted = false
  let styles = memo({})

  $: inBuilder = $builderStore.inBuilder
  $: addEmptyRows = $component.isRoot && inBuilder
  $: requiredRows = calculateRequiredRows($children, mobile, addEmptyRows)
  $: requiredHeight = requiredRows * GridRowHeight
  $: availableRows = Math.floor(height / GridRowHeight)
  $: rows = Math.max(requiredRows, availableRows)
  $: mobile = $context.device.mobile
  $: colSize = width / GridColumns
  $: styles.set({
    ...$component.styles,
    normal: {
      ...$component.styles?.normal,
      "--height": `${requiredHeight}px`,
      "--min-height": $component.styles?.normal?.height || 0,
      "--cols": GridColumns,
      "--rows": rows,
      "--col-size": colSize,
      "--row-size": GridRowHeight,
    },
  })

  // Calculates the minimum number of rows required to render all child
  // components, on a certain device type
  const calculateRequiredRows = (children, mobile, addEmptyRows) => {
    const key = mobile ? "mobileRowEnd" : "desktopRowEnd"
    let max = 2
    for (let id of Object.keys(children)) {
      if (children[id][key] > max) {
        max = children[id][key]
      }
    }
    let requiredRows = max - 1
    if (addEmptyRows) {
      return Math.ceil((requiredRows + 10) / 10) * 10
    } else {
      return requiredRows
    }
  }

  // Stores metadata about a child node as constraints for determining grid size
  const storeChild = node => {
    children.update(state => ({
      ...state,
      [node.dataset.id]: {
        desktopRowEnd: parseInt(node.dataset.gridDesktopRowEnd),
        mobileRowEnd: parseInt(node.dataset.gridMobileRowEnd),
      },
    }))
  }

  // Removes constraint metadata for a certain child node
  const removeChild = node => {
    children.update(state => {
      delete state[node.dataset.id]
      return { ...state }
    })
  }

  onMount(() => {
    let observer
    // Set up an observer to watch for changes in metadata attributes of child
    // components, as well as child addition and deletion
    observer = new MutationObserver(mutations => {
      for (let mutation of mutations) {
        const { target, type, addedNodes, removedNodes } = mutation
        if (target === ref) {
          if (addedNodes[0]?.classList?.contains("component")) {
            // We've added a new child component inside the grid, so we need
            // to consider it when determining required rows
            storeChild(addedNodes[0])
          } else if (removedNodes[0]?.classList?.contains("component")) {
            // We've removed a child component inside the grid, so we need
            // to stop considering it when determining required rows
            removeChild(removedNodes[0])
          }
        } else if (
          type === "attributes" &&
          target.parentNode === ref &&
          target.classList.contains("component")
        ) {
          // We've updated the size or position of a child
          storeChild(target)
        }
      }
    })
    observer.observe(ref, {
      childList: true,
      attributes: true,
      subtree: true,
      attributeFilter: [
        "data-grid-desktop-row-end",
        "data-grid-mobile-row-end",
      ],
    })

    // Now that the observer is set up, we mark the grid as mounted to mount
    // our child components
    mounted = true

    // Cleanup our observer
    return () => {
      observer?.disconnect()
    }
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  bind:this={ref}
  class="grid"
  class:mobile
  class:clickable={!!onClick}
  bind:clientWidth={width}
  bind:clientHeight={height}
  use:styleable={$styles}
  data-cols={GridColumns}
  data-col-size={colSize}
  on:click={onClick}
>
  {#if inBuilder}
    <div class="underlay">
      {#each { length: GridColumns * rows } as _, idx}
        <div class="placeholder" class:first-col={idx % GridColumns === 0} />
      {/each}
    </div>
  {/if}
  {#if mounted}
    <slot />
  {/if}
</div>

<style>
  .grid,
  .underlay {
    height: var(--height) !important;
    min-height: var(--min-height) !important;
    max-height: none !important;
    display: grid;
    gap: 0;
    grid-template-rows: repeat(var(--rows), calc(var(--row-size) * 1px));
    grid-template-columns: repeat(var(--cols), calc(var(--col-size) * 1px));
    position: relative;
  }
  .underlay {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-top: 1px solid var(--spectrum-global-color-gray-900);
    opacity: 0.1;
    pointer-events: none;
  }
  .underlay {
    z-index: 0;
  }
  .placeholder {
    border-bottom: 1px solid var(--spectrum-global-color-gray-900);
    border-right: 1px solid var(--spectrum-global-color-gray-900);
  }
  .placeholder.first-col {
    border-left: 1px solid var(--spectrum-global-color-gray-900);
  }
  .clickable {
    cursor: pointer;
  }

  /* Highlight grid lines when resizing children */
  :global(.grid.highlight > .underlay) {
    display: grid;
  }

  /* Highlight sibling borders when resizing childern */
  :global(.grid.highlight > .component:not(.dragging)) {
    outline: 2px solid var(--spectrum-global-color-static-blue-200);
    pointer-events: none !important;
  }
  :global(.grid.highlight > .component.dragging) {
    z-index: 999 !important;
  }

  /* Ensure all top level children have grid styles applied */
  .grid :global(> .component:not(.ignores-layout)) {
    display: flex;
    overflow: auto;
    pointer-events: all;
    position: relative;
    padding: calc(var(--grid-spacing) * 1px);
    margin: calc(var(--grid-spacing) * 1px);

    /* On desktop, use desktop metadata and fall back to mobile */
    --col-start: var(--grid-desktop-col-start, var(--grid-mobile-col-start));
    --col-end: var(--grid-desktop-col-end, var(--grid-mobile-col-end));
    --row-start: var(--grid-desktop-row-start, var(--grid-mobile-row-start));
    --row-end: var(--grid-desktop-row-end, var(--grid-mobile-row-end));
    --h-align: var(--grid-desktop-h-align, var(--grid-mobile-h-align));
    --v-align: var(--grid-desktop-v-align, var(--grid-mobile-v-align));

    /* Ensure grid metadata falls within limits */
    grid-column-start: min(max(1, var(--col-start)), var(--cols)) !important;
    grid-column-end: min(
      max(2, var(--col-end)),
      calc(var(--cols) + 1)
    ) !important;
    grid-row-start: max(1, var(--row-start)) !important;
    grid-row-end: max(2, var(--row-end)) !important;

    /* Flex container styles */
    flex-direction: column;
    align-items: var(--h-align);
    justify-content: var(--v-align);
  }

  /* On mobile, use mobile metadata and fall back to desktop */
  .grid.mobile :global(> .component) {
    --col-start: var(--grid-mobile-col-start, var(--grid-desktop-col-start));
    --col-end: var(--grid-mobile-col-end, var(--grid-desktop-col-end));
    --row-start: var(--grid-mobile-row-start, var(--grid-desktop-row-start));
    --row-end: var(--grid-mobile-row-end, var(--grid-desktop-row-end));
    --h-align: var(--grid-mobile-h-align, var(--grid-desktop-h-align));
    --v-align: var(--grid-mobile-v-align, var(--grid-desktop-v-align));
  }

  /* Handle grid children which need to fill the outer component wrapper */
  .grid :global(> .component > *) {
    flex: 0 0 auto !important;
  }
  .grid:not(.mobile)
    :global(> .component[data-grid-desktop-v-align="stretch"] > *) {
    flex: 1 1 0 !important;
    height: 0 !important;
  }
  .grid.mobile :global(> .component[data-grid-mobile-v-align="stretch"] > *) {
    flex: 1 1 0 !important;
    height: 0 !important;
  }

  /* Grid specific CSS overrides for certain components */
  .grid :global(> .component > img) {
    object-fit: contain;
    max-height: 100%;
  }
</style>
