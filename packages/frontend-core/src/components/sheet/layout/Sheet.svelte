<script>
  import { setContext } from "svelte"
  import { writable } from "svelte/store"
  import { createEventManagers } from "../lib/events"
  import { createAPIClient } from "../../../api"
  import { createReorderStores } from "../stores/reorder"
  import { createViewportStores } from "../stores/viewport"
  import { createRowsStore } from "../stores/rows"
  import { createColumnsStores } from "../stores/columns"
  import { createScrollStores } from "../stores/scroll"
  import { createBoundsStores } from "../stores/bounds"
  import { createUIStores } from "../stores/ui"
  import { createUserStores } from "../stores/users"
  import { createResizeStores } from "../stores/resize"
  import { createMenuStores } from "../stores/menu"
  import { createMaxScrollStores } from "../stores/max-scroll"
  import { createPaginationStores } from "../stores/pagination"
  import { createWheelStores } from "../stores/wheel"
  import DeleteButton from "../controls/DeleteButton.svelte"
  import SheetBody from "./SheetBody.svelte"
  import ResizeOverlay from "../overlays/ResizeOverlay.svelte"
  import HeaderRow from "./HeaderRow.svelte"
  import ScrollOverlay from "../overlays/ScrollOverlay.svelte"
  import MenuOverlay from "../overlays/MenuOverlay.svelte"
  import StickyColumn from "./StickyColumn.svelte"
  import UserAvatars from "./UserAvatars.svelte"
  import KeyboardManager from "../overlays/KeyboardManager.svelte"
  import { clickOutside } from "@budibase/bbui"
  import SheetControls from "./SheetControls.svelte"
  import NewRowTop from "./NewRowTop.svelte"
  import { MaxCellRenderHeight } from "../lib/constants"

  export let API
  export let tableId
  export let allowAddRows = true
  export let allowSelectRows = true
  export let allowAddColumns = true
  export let allowEditColumns = true
  export let allowExpandRows = true
  export let allowEditRows = true

  // Sheet constants
  const gutterWidth = 72
  const rand = Math.random()

  // State stores
  const tableIdStore = writable(tableId)
  const config = writable({
    allowAddRows,
    allowSelectRows,
    allowAddColumns,
    allowEditColumns,
    allowExpandRows,
    allowEditRows,
  })

  // Build up spreadsheet context
  // Stores are listed in order of dependency on each other
  let context = {
    API: API || createAPIClient(),
    rand,
    gutterWidth,
    config,
    tableId: tableIdStore,
  }
  context = { ...context, ...createEventManagers() }
  context = { ...context, ...createBoundsStores(context) }
  context = { ...context, ...createScrollStores(context) }
  context = { ...context, ...createRowsStore(context) }
  context = { ...context, ...createColumnsStores(context) }
  context = { ...context, ...createUIStores(context) }
  context = { ...context, ...createResizeStores(context) }
  context = { ...context, ...createViewportStores(context) }
  context = { ...context, ...createMaxScrollStores(context) }
  context = { ...context, ...createReorderStores(context) }
  context = { ...context, ...createUserStores(context) }
  context = { ...context, ...createMenuStores(context) }
  context = { ...context, ...createPaginationStores(context) }
  context = { ...context, ...createWheelStores(context) }

  // Reference some stores for local use
  const { isResizing, isReordering, ui, loaded, rowHeight } = context

  // Keep stores up to date
  $: tableIdStore.set(tableId)
  $: config.set({
    allowAddRows,
    allowSelectRows,
    allowAddColumns,
    allowEditColumns,
    allowExpandRows,
    allowEditRows,
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
  style="--row-height:{$rowHeight}px; --gutter-width:{gutterWidth}px; --max-cell-render-height:{MaxCellRenderHeight}px;"
>
  <div class="controls">
    <div class="controls-left">
      <SheetControls />
      <slot name="controls" />
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
        {#if $config.allowAddRows}
          <!--          <NewRow />-->
          <NewRowTop />
        {/if}
        <ResizeOverlay />
        <ScrollOverlay />
        <MenuOverlay />
      </div>
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

    /* Variables */
    --cell-background: var(--spectrum-global-color-gray-50);
    --cell-background-hover: var(--spectrum-global-color-gray-100);
    --cell-padding: 10px;
    --cell-spacing: 4px;
    --cell-font-size: 14px;
    --controls-height: 50px;
    --cell-border: 1px solid var(--spectrum-global-color-gray-200);
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
    /*background: var(--spectrum-global-color-gray-75);*/
    background: var(--cell-background);
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
</style>
