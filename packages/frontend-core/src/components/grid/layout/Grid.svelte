<script>
  import { setContext } from "svelte"
  import { writable } from "svelte/store"
  import { fade } from "svelte/transition"
  import { clickOutside, ProgressCircle } from "@budibase/bbui"
  import { createEventManagers } from "../lib/events"
  import { createAPIClient } from "../../../api"
  import { attachStores } from "../stores"
  import BulkDeleteHandler from "../controls/BulkDeleteHandler.svelte"
  import BetaButton from "../controls/BetaButton.svelte"
  import GridBody from "./GridBody.svelte"
  import ResizeOverlay from "../overlays/ResizeOverlay.svelte"
  import ReorderOverlay from "../overlays/ReorderOverlay.svelte"
  import HeaderRow from "./HeaderRow.svelte"
  import ScrollOverlay from "../overlays/ScrollOverlay.svelte"
  import MenuOverlay from "../overlays/MenuOverlay.svelte"
  import StickyColumn from "./StickyColumn.svelte"
  import UserAvatars from "./UserAvatars.svelte"
  import KeyboardManager from "../overlays/KeyboardManager.svelte"
  import SortButton from "../controls/SortButton.svelte"
  import AddColumnButton from "../controls/AddColumnButton.svelte"
  import HideColumnsButton from "../controls/HideColumnsButton.svelte"
  import AddRowButton from "../controls/AddRowButton.svelte"
  import RowHeightButton from "../controls/RowHeightButton.svelte"
  import ColumnWidthButton from "../controls/ColumnWidthButton.svelte"
  import NewRow from "./NewRow.svelte"
  import {
    MaxCellRenderHeight,
    MaxCellRenderWidthOverflow,
    GutterWidth,
    DefaultRowHeight,
  } from "../lib/constants"

  export let API = null
  export let tableId = null
  export let tableType = null
  export let schemaOverrides = null
  export let allowAddRows = true
  export let allowAddColumns = true
  export let allowEditColumns = true
  export let allowExpandRows = true
  export let allowEditRows = true
  export let allowDeleteRows = true
  export let stripeRows = false

  // Unique identifier for DOM nodes inside this instance
  const rand = Math.random()

  // State stores
  const tableIdStore = writable(tableId)
  const schemaOverridesStore = writable(schemaOverrides)
  const config = writable({
    allowAddRows,
    allowAddColumns,
    allowEditColumns,
    allowExpandRows,
    allowEditRows,
    allowDeleteRows,
    stripeRows,
  })

  // Build up context
  let context = {
    API: API || createAPIClient(),
    rand,
    config,
    tableId: tableIdStore,
    tableType,
    schemaOverrides: schemaOverridesStore,
  }
  context = { ...context, ...createEventManagers() }
  context = attachStores(context)

  // Reference some stores for local use
  const {
    isResizing,
    isReordering,
    ui,
    loaded,
    loading,
    rowHeight,
    contentLines,
  } = context

  // Keep stores up to date
  $: tableIdStore.set(tableId)
  $: schemaOverridesStore.set(schemaOverrides)
  $: config.set({
    allowAddRows,
    allowAddColumns,
    allowEditColumns,
    allowExpandRows,
    allowEditRows,
    allowDeleteRows,
    stripeRows,
  })

  // Set context for children to consume
  setContext("grid", context)

  // Expose ability to retrieve context externally for external control
  export const getContext = () => context

  // Initialise websocket for multi-user
  // onMount(() => createWebsocket(context))
</script>

<div
  class="grid"
  id="grid-{rand}"
  class:is-resizing={$isResizing}
  class:is-reordering={$isReordering}
  class:stripe={$config.stripeRows}
  style="--row-height:{$rowHeight}px; --default-row-height:{DefaultRowHeight}px; --gutter-width:{GutterWidth}px; --max-cell-render-height:{MaxCellRenderHeight}px; --max-cell-render-width-overflow:{MaxCellRenderWidthOverflow}px; --content-lines:{$contentLines};"
>
  <div class="controls">
    <div class="controls-left">
      <AddRowButton />
      <AddColumnButton />
      <slot name="controls" />
      <SortButton />
      <HideColumnsButton />
      <ColumnWidthButton />
      <RowHeightButton />
    </div>
    <div class="controls-right">
      <UserAvatars />
    </div>
  </div>
  {#if $loaded}
    <div class="grid-data-outer" use:clickOutside={ui.actions.blur}>
      <div class="grid-data-inner">
        <StickyColumn />
        <div class="grid-data-content">
          <HeaderRow />
          <GridBody />
        </div>
        <BetaButton />
        {#if allowAddRows}
          <NewRow />
        {/if}
        <div class="overlays">
          <ResizeOverlay />
          <ReorderOverlay />
          <ScrollOverlay />
          <MenuOverlay />
        </div>
      </div>
    </div>
  {/if}
  {#if $loading}
    <div in:fade|local={{ duration: 130 }} class="grid-loading">
      <ProgressCircle />
    </div>
  {/if}
  {#if allowDeleteRows}
    <BulkDeleteHandler />
  {/if}
  <KeyboardManager />
</div>

<style>
  .grid {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    position: relative;
    overflow: hidden;
    background: var(--cell-background);

    /* Variables */
    --cell-background: var(--spectrum-global-color-gray-50);
    --cell-background-hover: var(--spectrum-global-color-gray-100);
    --cell-background-alt: var(--cell-background);
    --cell-padding: 8px;
    --cell-spacing: 4px;
    --cell-border: 1px solid var(--spectrum-global-color-gray-200);
    --cell-font-size: 14px;
    --controls-height: 50px;
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
    border-bottom: 2px solid var(--spectrum-global-color-gray-200);
    padding: var(--cell-padding);
    gap: var(--cell-spacing);
    background: var(--background);
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
    background: var(--background);
    opacity: 0.6;
  }
</style>
