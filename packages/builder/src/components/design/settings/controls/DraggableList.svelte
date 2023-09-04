<script>
  import { Icon } from "@budibase/bbui"
  import { dndzone } from "svelte-dnd-action"
  import { createEventDispatcher } from "svelte"
  import { generate } from "shortid"
  import { setContext } from "svelte"
  import { writable } from "svelte/store"

  export let items = []
  export let showHandle = true
  export let listType
  export let listTypeProps = {}
  export let listItemKey
  export let draggable = true

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

  const dispatch = createEventDispatcher()
  const flipDurationMs = 150

  let anchors = {}
  let draggableItems = []

  const buildDraggable = items => {
    return items
      .map(item => {
        return {
          id: listItemKey ? item[listItemKey] : generate(),
          item,
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
    updateRowOrder(e)
    dispatch("change", serialiseUpdate())
  }

  const onItemChanged = e => {
    dispatch("itemChange", e.detail)
  }
</script>

<ul
  class="list-wrap"
  use:dndzone={{
    items: draggableItems,
    flipDurationMs,
    dropTargetStyle: { outline: "none" },
    dragDisabled: !draggable,
  }}
  on:finalize={handleFinalize}
  on:consider={updateRowOrder}
>
  {#each draggableItems as draggable (draggable.id)}
    <li
      bind:this={anchors[draggable.id]}
      class:highlighted={draggable.id === $store.selected}
    >
      <div class="left-content">
        {#if showHandle}
          <div class="handle" aria-label="drag-handle">
            <Icon name="DragHandle" size="XL" />
          </div>
        {/if}
      </div>
      <div class="right-content">
        <svelte:component
          this={listType}
          anchor={anchors[draggable.item._id]}
          item={draggable.item}
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
  }
  .list-wrap > li:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  .list-wrap > li:last-child {
    border-top-left-radius: var(--spectrum-table-regular-border-radius);
    border-top-right-radius: var(--spectrum-table-regular-border-radius);
  }
  .right-content {
    flex: 1;
    min-width: 0;
  }
  .list-wrap li {
    padding-left: var(--spacing-s);
    padding-right: var(--spacing-s);
  }
</style>
