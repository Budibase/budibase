<script>
  import { setContext } from "svelte"
  import { writable } from "svelte/store"
  import { createEventManagers } from "../lib/events"
  import { createAPIClient } from "../../../api"
  import { attachStores } from "../stores"
  import DeleteButton from "../controls/DeleteButton.svelte"
  import SheetBody from "./SheetBody.svelte"
  import ResizeOverlay from "../overlays/ResizeOverlay.svelte"
  import ReorderOverlay from "../overlays/ReorderOverlay.svelte"
  import HeaderRow from "./HeaderRow.svelte"
  import ScrollOverlay from "../overlays/ScrollOverlay.svelte"
  import MenuOverlay from "../overlays/MenuOverlay.svelte"
  import StickyColumn from "./StickyColumn.svelte"
  import UserAvatars from "./UserAvatars.svelte"
  import KeyboardManager from "../overlays/KeyboardManager.svelte"
  import { clickOutside, ProgressCircle } from "@budibase/bbui"
  import {
    MaxCellRenderHeight,
    MaxCellRenderWidthOverflow,
  } from "../lib/constants"
  import SortButton from "../controls/SortButton.svelte"
  import AddColumnButton from "../controls/AddColumnButton.svelte"
  import HideColumnsButton from "../controls/HideColumnsButton.svelte"
  import AddRowButton from "../controls/AddRowButton.svelte"

  export let API
  export let tableId
  export let allowAddRows = true
  export let allowAddColumns = true
  export let allowEditColumns = true
  export let allowExpandRows = true
  export let allowEditRows = true
  export let allowDeleteRows = true

  // Sheet constants
  const gutterWidth = 72
  const rand = Math.random()

  // State stores
  const tableIdStore = writable(tableId)
  const config = writable({
    allowAddRows,
    allowAddColumns,
    allowEditColumns,
    allowExpandRows,
    allowEditRows,
    allowDeleteRows,
  })

  // Build up spreadsheet context
  let context = {
    API: API || createAPIClient(),
    rand,
    gutterWidth,
    config,
    tableId: tableIdStore,
  }
  context = { ...context, ...createEventManagers() }
  context = attachStores(context)

  // Reference some stores for local use
  const { isResizing, isReordering, ui, loaded, rowHeight } = context

  // Keep stores up to date
  $: tableIdStore.set(tableId)
  $: config.set({
    allowAddRows,
    allowAddColumns,
    allowEditColumns,
    allowExpandRows,
    allowEditRows,
    allowDeleteRows,
  })

  // Set context for children to consume
  setContext("sheet", context)

  // Expose ability to retrieve context externally to allow sheet control
  export const getContext = () => context

  // Initialise websocket for multi-user
  // onMount(() => createWebsocket(context))
</script>

<div
  class="sheet"
  id="sheet-{rand}"
  class:is-resizing={$isResizing}
  class:is-reordering={$isReordering}
  style="--row-height:{$rowHeight}px; --gutter-width:{gutterWidth}px; --max-cell-render-height:{MaxCellRenderHeight}px; --max-cell-render-width-overflow:{MaxCellRenderWidthOverflow}px;"
>
  <div class="controls">
    <div class="controls-left">
      <AddRowButton />
      <AddColumnButton />
      <slot name="controls" />
      <HideColumnsButton />
      <SortButton />
    </div>
    <div class="controls-right">
      <DeleteButton />
      <UserAvatars />
    </div>
  </div>
  {#if $loaded}
    <div class="sheet-data-outer" use:clickOutside={ui.actions.blur}>
      <div class="sheet-data-inner">
        <StickyColumn />
        <div class="sheet-data-content">
          <HeaderRow />
          <SheetBody />
        </div>
        <div class="overlays">
          <ResizeOverlay />
          <ReorderOverlay />
          <ScrollOverlay />
          <MenuOverlay />
        </div>
      </div>
    </div>
  {:else}
    <div class="sheet-loading">
      <ProgressCircle />
    </div>
  {/if}
  <KeyboardManager />
</div>

<style>
  .sheet {
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
    --cell-padding: 10px;
    --cell-spacing: 4px;
    --cell-border: 1px solid var(--spectrum-global-color-gray-200);
    --cell-font-size: 14px;
    --controls-height: 50px;
  }
  .sheet,
  .sheet :global(*) {
    box-sizing: border-box;
  }
  .sheet.is-resizing :global(*) {
    cursor: col-resize !important;
  }
  .sheet.is-reordering :global(*) {
    cursor: grabbing !important;
  }

  .sheet-data-outer,
  .sheet-data-inner {
    flex: 1 1 auto;
    display: flex;
    justify-items: flex-start;
    align-items: stretch;
    overflow: hidden;
  }
  .sheet-data-outer {
    height: 0;
    flex-direction: column;
  }
  .sheet-data-inner {
    flex-direction: row;
    position: relative;
  }
  .sheet-data-content {
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
    background: var(--spectrum-global-color-gray-100);
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
  .sheet-loading {
    position: absolute;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }
</style>
