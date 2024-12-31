<script lang="ts">
  import { setContext, onMount } from "svelte"
  import { writable, derived } from "svelte/store"
  import { fade } from "svelte/transition"
  import { clickOutside, ProgressCircle } from "@budibase/bbui"
  import { createEventManagers } from "../lib/events"
  import { createAPIClient } from "../../../api"
  import { attachStores } from "../stores"
  import BulkDeleteHandler from "../controls/BulkDeleteHandler.svelte"
  import BulkDuplicationHandler from "../controls/BulkDuplicationHandler.svelte"
  import ClipboardHandler from "../controls/ClipboardHandler.svelte"
  import GridBody from "./GridBody.svelte"
  import ResizeOverlay from "../overlays/ResizeOverlay.svelte"
  import ReorderOverlay from "../overlays/ReorderOverlay.svelte"
  import PopoverOverlay from "../overlays/PopoverOverlay.svelte"
  import HeaderRow from "./HeaderRow.svelte"
  import ScrollOverlay from "../overlays/ScrollOverlay.svelte"
  import MenuOverlay from "../overlays/MenuOverlay.svelte"
  import StickyColumn from "./StickyColumn.svelte"
  import UserAvatars from "./UserAvatars.svelte"
  import KeyboardManager from "../overlays/KeyboardManager.svelte"
  import NewRow from "./NewRow.svelte"
  import { createGridWebsocket } from "../lib/websocket"
  import * as Constants from "../lib/constants"

  export let API = null
  export let datasource = null
  export let schemaOverrides = null
  export let canAddRows = true
  export let canExpandRows = true
  export let canEditRows = true
  export let canDeleteRows = true
  export let canEditColumns = true
  export let canSaveSchema = true
  export let stripeRows = false
  export let quiet = false
  export let collaboration = true
  export let showAvatars = true
  export let initialFilter = null
  export let initialSortColumn = null
  export let initialSortOrder = null
  export let fixedRowHeight = null
  export let notifySuccess = null
  export let notifyError = null
  export let buttons = null
  export let buttonsCollapsed = false
  export let buttonsCollapsedText = null
  export let darkMode = false
  export let isCloud = null
  export let aiEnabled = false

  // Unique identifier for DOM nodes inside this instance
  const gridID = `grid-${Math.random().toString().slice(2)}`

  // Store props in a store for reference in other stores
  const props: any = writable($$props)

  // Build up context
  let context = attachStores({
    API: API || createAPIClient(),
    Constants,
    gridID,
    props,
    ...createEventManagers(),
  })

  // Reference some stores for local use
  const {
    config,
    isResizing,
    isReordering,
    ui,
    loaded,
    loading,
    rowHeight,
    contentLines,
    gridFocused,
    error,
  } = context

  // Keep config store up to date with props
  $: props.set({
    datasource,
    schemaOverrides,
    canAddRows,
    canExpandRows,
    canEditRows,
    canDeleteRows,
    canEditColumns,
    canSaveSchema,
    stripeRows,
    quiet,
    collaboration,
    showAvatars,
    initialFilter,
    initialSortColumn,
    initialSortOrder,
    fixedRowHeight,
    notifySuccess,
    notifyError,
    buttons,
    buttonsCollapsed,
    buttonsCollapsedText,
    darkMode,
    isCloud,
    aiEnabled,
  })

  // Derive min height and make available in context
  const minHeight = derived(rowHeight, $height => {
    const heightForControls = $$slots.controls ? Constants.ControlsHeight : 0
    return (
      Constants.VPadding +
      Constants.SmallRowHeight +
      $height +
      heightForControls
    )
  })
  context = { ...context, minHeight }

  // Set context for children to consume
  setContext("grid", context)

  // Expose ability to retrieve context externally for external control
  export const getContext = () => context

  // Initialise websocket for multi-user
  onMount(() => {
    if (collaboration) {
      return createGridWebsocket(context)
    }
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="grid"
  id={gridID}
  class:is-resizing={$isResizing}
  class:is-reordering={$isReordering}
  class:stripe={stripeRows}
  class:quiet
  on:mouseenter={() => gridFocused.set(true)}
  on:mouseleave={() => gridFocused.set(false)}
  style="--row-height:{$rowHeight}px; --default-row-height:{Constants.DefaultRowHeight}px; --gutter-width:{Constants.GutterWidth}px; --max-cell-render-overflow:{Constants.MaxCellRenderOverflow}px; --content-lines:{$contentLines}; --min-height:{$minHeight}px; --controls-height:{Constants.ControlsHeight}px; --scroll-bar-size:{Constants.ScrollBarSize}px;"
>
  {#if $$slots.controls}
    <div class="controls">
      <div class="controls-left">
        <slot name="controls" />
      </div>
      <div class="controls-right">
        <slot name="controls-right" />
        {#if showAvatars}
          <UserAvatars />
        {/if}
      </div>
    </div>
  {/if}
  {#if $error}
    <div class="grid-error">
      <div class="grid-error-title">There was a problem loading your grid</div>
      <div class="grid-error-subtitle">
        {$error}
      </div>
    </div>
  {:else if $loaded}
    <div class="grid-data-outer" use:clickOutside={ui.actions.blur}>
      <div class="grid-data-inner">
        <StickyColumn>
          <svelte:fragment slot="edit-column">
            <slot name="edit-column" />
          </svelte:fragment>
        </StickyColumn>
        <div class="grid-data-content">
          <HeaderRow>
            <svelte:fragment slot="add-column">
              <slot name="add-column" />
            </svelte:fragment>
            <svelte:fragment slot="edit-column">
              <slot name="edit-column" />
            </svelte:fragment>
          </HeaderRow>
          <GridBody />
        </div>
        {#if $config.canAddRows}
          <NewRow />
        {/if}
        <div class="overlays">
          <ResizeOverlay />
          <ReorderOverlay />
          <ScrollOverlay />
          <MenuOverlay />
          <PopoverOverlay />
        </div>
      </div>
    </div>
  {/if}
  {#if $loading && !$error}
    <div in:fade|local={{ duration: 130 }} class="grid-loading">
      <ProgressCircle />
    </div>
  {/if}
  {#if $config.canAddRows}
    <BulkDuplicationHandler />
  {/if}
  <BulkDeleteHandler />
  <ClipboardHandler />
  <KeyboardManager />
  <slot />
</div>

<style>
  /* Core grid */
  .grid {
    /* Variables */
    --accent-color: var(--primaryColor, var(--spectrum-global-color-blue-400));
    --grid-background: var(--spectrum-global-color-gray-50);
    --grid-background-alt: var(--spectrum-global-color-gray-100);
    --cell-background: var(--grid-background);
    --cell-background-hover: var(--grid-background-alt);
    --cell-background-alt: var(--cell-background);
    --cell-padding: 8px;
    --cell-spacing: 4px;
    --cell-border: 1px solid var(--spectrum-global-color-gray-200);
    --cell-font-size: 14px;
    --cell-font-color: var(--spectrum-global-color-gray-800);
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    position: relative;
    overflow: hidden;
    background: var(--grid-background);
    min-height: var(--min-height);
  }
  .grid,
  .grid :global(*) {
    box-sizing: border-box;
  }
  .grid.is-resizing :global(*) {
    cursor: col-resize !important;
  }
  .grid.is-reordering :global(*) {
    cursor: grabbing !important;
  }
  .grid.stripe {
    --cell-background-alt: var(--spectrum-global-color-gray-75);
  }

  /* Data layers */
  .grid-data-outer,
  .grid-data-inner {
    flex: 1 1 auto;
    display: flex;
    justify-items: flex-start;
    align-items: stretch;
    overflow: hidden;
  }
  .grid-data-outer {
    height: 0;
    flex-direction: column;
  }
  .grid-data-inner {
    flex-direction: row;
    position: relative;
  }
  .grid-data-content {
    flex: 1 1 auto;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  /* Controls */
  .controls {
    height: var(--controls-height);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: var(--border-light);
    padding: var(--cell-padding);
    gap: var(--cell-spacing);
    background: var(--grid-background-alt);
    z-index: 2;
  }
  .controls-left,
  .controls-right {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--cell-spacing);
  }
  .controls-right {
    gap: 12px;
  }

  /* Overlays */
  .overlays {
    z-index: 10;
  }

  /* Loading */
  .grid-loading {
    position: absolute;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    z-index: 100;
  }
  .grid-loading:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--grid-background-alt);
    opacity: 0.3;
  }

  /* Error */
  .grid-error {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }
  .grid-error-title {
    font-size: 18px;
    font-weight: 600;
  }
  .grid-error-subtitle {
    font-size: 16px;
  }

  /* Disable checkbox animation anywhere in the grid data */
  .grid-data-outer :global(.spectrum-Checkbox-box:before),
  .grid-data-outer :global(.spectrum-Checkbox-box:after),
  .grid-data-outer :global(.spectrum-Checkbox-checkmark),
  .grid-data-outer :global(.spectrum-Checkbox-partialCheckmark) {
    transition: none;
  }

  /* Overrides for quiet */
  .grid.quiet :global(.grid-data-content .row > .cell:not(:last-child)),
  .grid.quiet :global(.sticky-column .row > .cell),
  .grid.quiet :global(.new-row .row > .cell:not(:last-child)) {
    border-right: none;
  }
  .grid.quiet :global(.sticky-column:before) {
    display: none;
  }
</style>
