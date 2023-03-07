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
  import { createInterfaceStores } from "./stores/interface"
  export { createUserStores } from "./stores/users"
  import { createWebsocket } from "./websocket"
  import { createUserStores } from "./stores/users"
  import { createResizeStores } from "./stores/resize"
  import { createMenuStores } from "./stores/menu"
  import DeleteButton from "./DeleteButton.svelte"
  import SheetBody from "./SheetBody.svelte"
  import ResizeOverlay from "./ResizeOverlay.svelte"
  import HeaderRow from "./HeaderRow.svelte"
  import ScrollOverlay from "./ScrollOverlay.svelte"
  import MenuOverlay from "./MenuOverlay.svelte"
  import StickyColumn from "./StickyColumn.svelte"
  import UserAvatars from "./UserAvatars.svelte"

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
  context = { ...context, ...createRowsStore(context) }
  context = { ...context, ...createColumnsStores(context) }
  context = { ...context, ...createResizeStores(context) }
  context = { ...context, ...createBoundsStores(context) }
  context = { ...context, ...createScrollStores(context) }
  context = { ...context, ...createViewportStores(context) }
  context = { ...context, ...createReorderStores(context) }
  context = { ...context, ...createInterfaceStores(context) }
  context = { ...context, ...createUserStores(context) }
  context = { ...context, ...createMenuStores(context) }

  // Reference some stores for local use
  const { isResizing, isReordering } = context

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
  class:is-resizing={$isResizing}
  class:is-reordering={$isReordering}
  style="--cell-height:{cellHeight}px;"
  id="sheet-{rand}"
>
  <div class="controls">
    <div class="controls-left">
      <slot name="controls" />
    </div>
    <div class="controls-right">
      <DeleteButton />
      <UserAvatars />
    </div>
  </div>
  <div class="sheet-data">
    <StickyColumn />
    <div class="sheet-main">
      <HeaderRow />
      <SheetBody />
    </div>
    <ResizeOverlay />
    <ScrollOverlay />
    <MenuOverlay />
  </div>
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
    align-items: flex-start;
    overflow: hidden;
    height: 0;
    position: relative;
  }
  .sheet-main {
    flex: 1 1 auto;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-self: stretch;
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
