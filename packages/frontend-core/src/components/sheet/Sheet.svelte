<script>
  import { setContext, createEventDispatcher, onMount } from "svelte"
  import { writable } from "svelte/store"
  import { createReorderStores } from "./stores/reorder"
  import { createViewportStores } from "./stores/viewport"
  import { createRowsStore } from "./stores/rows"
  import { createColumnsStores } from "./stores/columns"
  import { createScrollStores } from "./stores/scroll"
  import { createBoundsStores } from "./stores/bounds"
  import { createInterfaceStores } from "./stores/interface"
  export { createUserStores } from "./stores/users"
  import DeleteButton from "./DeleteButton.svelte"
  import SheetBody from "./SheetBody.svelte"
  import ResizeOverlay from "./ResizeOverlay.svelte"
  import HeaderRow from "./HeaderRow.svelte"
  import { createAPIClient } from "../../api"
  import ScrollOverlay from "./ScrollOverlay.svelte"
  import StickyColumn from "./StickyColumn.svelte"
  import { createWebsocket } from "./websocket"
  import { createUserStores } from "./stores/users"

  export let API
  export let tableId
  export let allowAddRows = true
  export let allowSelectRows = true
  export let filter

  // Sheet constants
  const cellHeight = 40
  const rand = Math.random()

  // State stores
  const dispatch = createEventDispatcher()
  const config = writable({
    tableId,
    filter,
    allowAddRows,
    allowSelectRows,
  })

  // Build up spreadsheet context
  // Stores are listed in order of dependency on each other
  let context = {
    API: API || createAPIClient(),
    rand,
    cellHeight,
    config,
    dispatch,
  }
  context = { ...context, ...createRowsStore(context) }
  context = { ...context, ...createColumnsStores(context) }
  context = { ...context, ...createBoundsStores(context) }
  context = { ...context, ...createScrollStores(context) }
  context = { ...context, ...createViewportStores(context) }
  context = { ...context, ...createReorderStores(context) }
  context = { ...context, ...createInterfaceStores(context) }
  context = { ...context, ...createUserStores(context) }

  // Keep config store up to date
  $: config.set({
    tableId,
    filter,
    allowAddRows,
    allowSelectRows,
  })

  // Set context for children to consume
  setContext("spreadsheet", context)

  // Initialise websocket for multi-user
  onMount(() => {
    return createWebsocket(context)
  })
</script>

<div class="sheet" style="--cell-height:{cellHeight}px;" id="sheet-{rand}">
  <!--<SheetControls />-->
  <div class="sheet-data">
    <StickyColumn />
    <div class="sheet-main">
      <HeaderRow />
      <SheetBody />
    </div>
    <DeleteButton />
    <ResizeOverlay />
    <ScrollOverlay />
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
    --cell-background-hover: var(--spectrum-global-color-gray-75);
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
</style>
