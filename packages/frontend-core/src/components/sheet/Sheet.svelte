<script>
  import { setContext, onMount } from "svelte"
  import { writable } from "svelte/store"
  import { createEventManagers } from "./events"
  import { createAPIClient } from "../../api"
  import { createReorderStores } from "./stores/reorder"
  import { createViewportStores } from "./stores/viewport"
  import { createRowsStore } from "./stores/rows"
  import { createColumnsStores } from "./stores/columns"
  import { createScrollStores } from "./stores/scroll"
  import { createBoundsStores } from "./stores/bounds"
  import { createUIStores } from "./stores/ui"
  import { createUserStores } from "./stores/users"
  import { createWebsocket } from "./websocket"
  import { createResizeStores } from "./stores/resize"
  import { createMenuStores } from "./stores/menu"
  import { createMaxScrollStores } from "./stores/max-scroll"
  import { createPaginationStores } from "./stores/pagination"
  import DeleteButton from "./DeleteButton.svelte"
  import SheetBody from "./SheetBody.svelte"
  import ResizeOverlay from "./ResizeOverlay.svelte"
  import HeaderRow from "./HeaderRow.svelte"
  import ScrollOverlay from "./ScrollOverlay.svelte"
  import MenuOverlay from "./MenuOverlay.svelte"
  import StickyColumn from "./StickyColumn.svelte"
  import UserAvatars from "./UserAvatars.svelte"
  import KeyboardManager from "./KeyboardManager.svelte"
  import { clickOutside } from "@budibase/bbui"
  import AddRowButton from "./AddRowButton.svelte"
  import SheetControls from "./SheetControls.svelte"

  export let API
  export let tableId
  export let allowAddRows = true
  export let allowSelectRows = true
  export let allowAddColumns = true
  export let allowEditColumns = true

  // Sheet constants
  const cellHeight = 36
  const rand = Math.random()

  // State stores
  const config = writable({
    tableId,
    allowAddRows,
    allowSelectRows,
    allowAddColumns,
    allowEditColumns,
  })

  // Build up spreadsheet context
  // Stores are listed in order of dependency on each other
  let context = {
    API: API || createAPIClient(),
    rand,
    cellHeight,
    config,
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

  // Reference some stores for local use
  const { isResizing, isReordering, ui, loaded } = context

  // Keep config store up to date
  $: config.set({
    tableId,
    allowAddRows,
    allowSelectRows,
    allowAddColumns,
    allowEditColumns,
  })

  // Set context for children to consume
  setContext("sheet", context)

  // Expose ability to retrieve context externally to allow sheet control
  export const getContext = () => context

  // Initialise websocket for multi-user
  onMount(() => createWebsocket(context))
</script>

<div
  class="sheet"
  id="sheet-{rand}"
  class:is-resizing={$isResizing}
  class:is-reordering={$isReordering}
  style="--cell-height:{cellHeight}px;"
>
  <div class="controls">
    <div class="controls-left">
      <slot name="controls" />
      <SheetControls />
    </div>
    <div class="controls-right">
      <DeleteButton />
      <UserAvatars />
    </div>
  </div>
  {#if $loaded}
    <div class="sheet-data" use:clickOutside={ui.actions.blur}>
      <StickyColumn />
      <div class="sheet-main">
        <HeaderRow />
        <SheetBody />
      </div>
      <ResizeOverlay />
      <ScrollOverlay />
      <MenuOverlay />
      {#if $config.allowAddRows}
        <AddRowButton />
      {/if}
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

  .sheet-data {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-items: flex-start;
    align-items: stretch;
    overflow: hidden;
    height: 0;
    position: relative;
    background: var(--spectrum-global-color-gray-75);
  }
  .sheet-main {
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
