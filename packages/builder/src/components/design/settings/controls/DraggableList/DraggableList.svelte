<script>
  import { dndzone } from "svelte-dnd-action"
  import { createEventDispatcher, setContext } from "svelte"
  import { generate } from "shortid"
  import { writable, get } from "svelte/store"
  import DragHandle from "./drag-handle.svelte"

  export let items = []
  export let showHandle = true
  export let listType
  export let listTypeProps = {}
  export let listItemKey
  export let draggable = true
  export let focus

  let zoneType = generate()

  let store = writable({
    selected: null,
    actions: {
      select: id => {
        store.update(state => ({
          ...state,
          selected: id,
        }))
      },
    },
  })

  setContext("draggable", store)

  $: if (focus && store) {
    get(store).actions.select(focus)
  }

  const dispatch = createEventDispatcher()

  let anchors = {}
  let draggableItems = []

  // Used for controlling cursor behaviour in order to limit drag behaviour
  // to the drag handle
  let inactive = true

  const buildDraggable = items => {
    return items
      .map(item => {
        return {
          id: listItemKey ? item[listItemKey] : generate(),
          item,
          type: zoneType,
        }
      })
      .filter(item => item.id)
  }

  $: if (items) {
    draggableItems = buildDraggable(items)
  }

  const updateRowOrder = e => {
    draggableItems = e.detail.items
  }

  const serialiseUpdate = () => {
    return draggableItems.reduce((acc, ele) => {
      acc.push(ele.item)
      return acc
    }, [])
  }

  const handleFinalize = e => {
    inactive = true
    updateRowOrder(e)
    dispatch("change", serialiseUpdate())
  }

  const onItemChanged = e => {
    dispatch("itemChange", e.detail)
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions-->
<ul
  class="list-wrap"
  use:dndzone={{
    items: draggableItems,
    dropTargetStyle: { outline: "none" },
    dragDisabled: !draggable || inactive,
    type: zoneType,
    dropFromOthersDisabled: true,
  }}
  on:finalize={handleFinalize}
  on:consider={updateRowOrder}
>
  {#each draggableItems as draggableItem (draggableItem.id)}
    <li
      on:click={() => {
        get(store).actions.select(draggableItem.id)
      }}
      bind:this={anchors[draggableItem.id]}
      class:highlighted={draggableItem.id === $store.selected}
    >
      <div class="left-content">
        {#if showHandle}
          <div
            class="handle"
            aria-label="drag-handle"
            style={!inactive ? "cursor:grabbing" : "cursor:grab"}
            on:mousedown={() => {
              inactive = false
            }}
            on:mouseup={() => {
              inactive = true
            }}
          >
            <DragHandle />
          </div>
        {/if}
      </div>
      <div class="right-content">
        <svelte:component
          this={listType}
          anchor={anchors[draggableItem.id]}
          item={draggableItem.item}
          {...listTypeProps}
          on:change={onItemChanged}
        />
      </div>
    </li>
  {/each}
</ul>

<style>
  .list-wrap {
    list-style-type: none;
    margin: 0;
    padding: 0;
    width: 100%;
    border-radius: 4px;
    background-color: var(
      --spectrum-table-background-color,
      var(--spectrum-global-color-gray-50)
    );
    border: 1px solid
      var(--spectrum-table-border-color, var(--spectrum-alias-border-color-mid));
  }
  .list-wrap > li {
    background-color: var(
      --spectrum-table-background-color,
      var(--spectrum-global-color-gray-50)
    );
    transition: background-color ease-in-out 130ms;
    display: flex;
    align-items: center;
    border-bottom: 1px solid
      var(--spectrum-table-border-color, var(--spectrum-alias-border-color-mid));
  }
  .list-wrap > li:hover,
  li.highlighted {
    background-color: var(
      --spectrum-table-row-background-color-hover,
      var(--spectrum-alias-highlight-hover)
    );
    cursor: pointer;
  }
  .list-wrap > li:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  .list-wrap > li:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border-bottom: 0px;
  }
  .right-content {
    flex: 1;
    min-width: 0;
  }
  .list-wrap li {
    padding-left: var(--spacing-s);
    padding-right: var(--spacing-s);
  }
  .handle {
    display: flex;
    height: var(--spectrum-global-dimension-size-150);
  }
  .handle:hover {
    cursor: grab;
  }
  .handle :global(svg) {
    fill: var(--spectrum-global-color-gray-500);
    margin-right: var(--spacing-m);
    margin-left: 2px;
    width: var(--spectrum-global-dimension-size-65);
    height: 100%;
  }
</style>
